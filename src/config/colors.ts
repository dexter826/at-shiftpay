// Semantic palette for charts and status-driven styles, backed by design tokens.

export const PAYMENT_COLORS = {
  PRIMARY: 'var(--color-accent)',

  UNPAID: 'var(--color-accent)', // Còn cần trả
  PAID: 'var(--color-success)', // Đã thanh toán
  ADVANCED: 'var(--color-warning)', // Đã ứng tiền
  TOTAL_EARNED: 'var(--color-info)', // Tổng đã làm

  REGULAR_PAYMENT: 'var(--color-success)',
  ADVANCE_PAYMENT: 'var(--color-warning)',
  SETTLEMENT: 'var(--color-info)',

  SUCCESS: 'var(--color-success)',
  WARNING: 'var(--color-warning)',
  ERROR: 'var(--color-danger)',
  INFO: 'var(--color-info)',
} as const;

export const PAYMENT_COLOR_CLASSES = {
  UNPAID_TEXT: 'text-accent-ink',
  PAID_TEXT: 'text-success',
  ADVANCED_TEXT: 'text-warning',
  TOTAL_EARNED_TEXT: 'text-info',

  UNPAID_BG: 'bg-accent/10',
  PAID_BG: 'bg-success/10',
  ADVANCED_BG: 'bg-warning/10',
  TOTAL_EARNED_BG: 'bg-info/10',

  UNPAID_BORDER: 'border-accent/20',
  PAID_BORDER: 'border-success/20',
  ADVANCED_BORDER: 'border-warning/20',
  TOTAL_EARNED_BORDER: 'border-info/20',
} as const;

export const getPaymentStatusColor = (status: 'unpaid' | 'paid' | 'advanced') => {
  switch (status) {
    case 'unpaid':
      return PAYMENT_COLORS.UNPAID;
    case 'paid':
      return PAYMENT_COLORS.PAID;
    case 'advanced':
      return PAYMENT_COLORS.ADVANCED;
    default:
      return PAYMENT_COLORS.PRIMARY;
  }
};

export const getPaymentStatusClass = (status: 'unpaid' | 'paid' | 'advanced') => {
  switch (status) {
    case 'unpaid':
      return PAYMENT_COLOR_CLASSES.UNPAID_TEXT;
    case 'paid':
      return PAYMENT_COLOR_CLASSES.PAID_TEXT;
    case 'advanced':
      return PAYMENT_COLOR_CLASSES.ADVANCED_TEXT;
    default:
      return PAYMENT_COLOR_CLASSES.UNPAID_TEXT;
  }
};
