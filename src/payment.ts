export type PaymentFailureType = 'transient' | 'permanent';

export class PaymentError extends Error {
  constructor(
    message: string,
    readonly type: PaymentFailureType,
  ) {
    super(message);
    this.name = 'PaymentError';
  }
}

export interface PaymentResult {
  orderId: string;
}

export interface PaymentGateway {
  charge(total: number): Promise<PaymentResult>;
}

export interface PaymentAttempt {
  attempt: number;
  maxAttempts: number;
}

interface PaymentOptions {
  maxRetries?: number;
  onAttempt?: (attempt: PaymentAttempt) => void;
}

export async function processPaymentWithRetry(
  gateway: PaymentGateway,
  total: number,
  options: PaymentOptions = {},
): Promise<PaymentResult> {
  const maxAttempts = (options.maxRetries ?? 2) + 1;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    options.onAttempt?.({ attempt, maxAttempts });

    try {
      return await gateway.charge(total);
    } catch (error) {
      const canRetry = error instanceof PaymentError && error.type === 'transient' && attempt < maxAttempts;
      if (!canRetry) throw error;
    }
  }

  throw new Error('Payment retry loop completed without a result.');
}
