import { Event, Shift } from '@/types/index';

export interface ShiftBreakdown {
  base: number;
  surcharge: number;
  total: number;
}

export const roundAmount = (value: number): number => Math.round(value);

export const sumShiftAmounts = (shifts: Shift[]): number =>
  shifts.reduce((sum, shift) => sum + shift.amount, 0);

export const shiftBreakdown = (shift: Shift, event?: Event): ShiftBreakdown => {
  if (!event || !event.surcharge) {
    return { base: shift.amount, surcharge: 0, total: shift.amount };
  }

  const base = event.amount || 0;
  return { base, surcharge: shift.amount - base, total: shift.amount };
};
