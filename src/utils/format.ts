export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
};

const pad = (value: number): string => String(value).padStart(2, '0');

const DATE_ONLY_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

export const toDateKey = (date: Date): string =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

export const parseDateOnly = (value: string): Date => {
  const match = DATE_ONLY_PATTERN.exec(value);
  if (!match) return new Date(value);
  return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
};

export const formatDate = (dateStr: string): string => {
  if (!dateStr) return '';
  const date = parseDateOnly(dateStr);
  return new Intl.DateTimeFormat('vi-VN', {
    weekday: 'short',
    day: 'numeric',
    month: 'numeric',
  }).format(date);
};
