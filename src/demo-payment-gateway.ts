import { PaymentError, type PaymentGateway, type PaymentResult } from './payment';

export type PaymentScenario = 'success' | 'transient' | 'declined' | 'offline';

const SCENARIOS: PaymentScenario[] = ['success', 'transient', 'declined', 'offline'];

export function getPaymentScenario(search: string): PaymentScenario {
  const requested = new URLSearchParams(search).get('payment');
  return SCENARIOS.includes(requested as PaymentScenario) ? (requested as PaymentScenario) : 'success';
}

export function isDemoMode(search: string): boolean {
  return new URLSearchParams(search).get('demo') === 'true';
}

export class DemoPaymentGateway implements PaymentGateway {
  attempts = 0;

  constructor(
    readonly scenario: PaymentScenario,
    private readonly delayMs = 450,
  ) {}

  async charge(_total: number): Promise<PaymentResult> {
    this.attempts += 1;
    await new Promise<void>((resolve) => setTimeout(resolve, this.delayMs));

    if (this.scenario === 'transient' && this.attempts <= 2) {
      throw new PaymentError('The payment network is temporarily unavailable.', 'transient');
    }

    if (this.scenario === 'declined') {
      throw new PaymentError('The payment was declined. Choose another payment method.', 'permanent');
    }

    if (this.scenario === 'offline') {
      throw new PaymentError('The payment service is still unavailable.', 'transient');
    }

    return { orderId: `NL-${crypto.randomUUID().toUpperCase()}` };
  }
}
