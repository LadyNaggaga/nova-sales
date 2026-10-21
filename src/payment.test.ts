import { describe, expect, it, vi } from 'vitest';
import { PaymentError, processPaymentWithRetry, type PaymentGateway } from './payment';

function gatewayFrom(results: Array<'success' | PaymentError>): PaymentGateway {
  return {
    charge: vi.fn(async () => {
      const result = results.shift();
      if (result instanceof PaymentError) throw result;
      return { orderId: 'NL-DEMO-ORDER' };
    }),
  };
}

describe('processPaymentWithRetry', () => {
  it('completes an immediately successful payment once', async () => {
    const gateway = gatewayFrom(['success']);

    await expect(processPaymentWithRetry(gateway, 185)).resolves.toEqual({ orderId: 'NL-DEMO-ORDER' });
    expect(gateway.charge).toHaveBeenCalledTimes(1);
  });

  it('succeeds when a transient failure recovers on the third attempt', async () => {
    const gateway = gatewayFrom([
      new PaymentError('temporary outage', 'transient'),
      new PaymentError('temporary outage', 'transient'),
      'success',
    ]);

    await expect(processPaymentWithRetry(gateway, 185)).resolves.toEqual({ orderId: 'NL-DEMO-ORDER' });
    expect(gateway.charge).toHaveBeenCalledTimes(3);
  });

  it('does not retry a permanent payment decline', async () => {
    const error = new PaymentError('declined', 'permanent');
    const gateway = gatewayFrom([error, 'success']);

    await expect(processPaymentWithRetry(gateway, 185)).rejects.toBe(error);
    expect(gateway.charge).toHaveBeenCalledTimes(1);
  });

  it('stops after the configured transient retry limit', async () => {
    const gateway = gatewayFrom([
      new PaymentError('offline', 'transient'),
      new PaymentError('offline', 'transient'),
      new PaymentError('offline', 'transient'),
      'success',
    ]);

    await expect(processPaymentWithRetry(gateway, 185)).rejects.toThrow('offline');
    expect(gateway.charge).toHaveBeenCalledTimes(3);
  });
});
