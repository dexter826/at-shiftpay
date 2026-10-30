import type { PaymentTransaction } from '@/types/index';

export const getPaymentTypeLabel = (type: PaymentTransaction['type']) => {
  if (type === 'advance') return { label: 'Ứng lương', variant: 'info' as const };
  if (type === 'settlement') return { label: 'Quyết toán', variant: 'highlight' as const };
  return { label: 'Thanh toán', variant: 'neutral' as const };
};
