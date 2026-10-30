import type { Employee, Event, PayrollSummary, Shift } from '@/types/index';
import { shiftBreakdown } from '@/utils/payrollMath';

export type PayrollSummaryWithFees = PayrollSummary & { totalFees?: number };

export const buildPayrollSummary = (
  shifts: Shift[],
  employees: Employee[],
  events: Event[]
): PayrollSummaryWithFees[] => {
  const map: Record<string, PayrollSummaryWithFees> = {};

  employees.forEach((employee) => {
    map[employee.id] = {
      employeeId: employee.id,
      employeeName: employee.name,
      phone: employee.phone,
      unpaidCount: 0,
      totalUnpaid: 0,
      advancedCount: 0,
      totalAdvanced: 0,
      netAmount: 0,
    };
  });

  shifts.forEach((shift) => {
    const employee = map[shift.employeeId];
    if (!employee) return;

    const event = events.find((item) => item.id === shift.eventId);
    const fee = event ? shiftBreakdown(shift, event).surcharge : 0;

    if (shift.status === 'unpaid') {
      employee.unpaidCount += 1;
      employee.totalUnpaid += shift.amount;
      if (fee > 0) employee.totalFees = (employee.totalFees || 0) + fee;
    } else if (shift.status === 'advanced') {
      employee.advancedCount += 1;
      employee.totalAdvanced += shift.amount;
      if (fee > 0) employee.totalFees = (employee.totalFees || 0) + fee;
    }
  });

  Object.values(map).forEach((employee) => {
    employee.netAmount = employee.totalUnpaid;
  });

  return Object.values(map).sort((a, b) => b.netAmount - a.netAmount);
};

export const calculatePayrollStats = (summary: PayrollSummary[]) => {
  const totalDebt = summary.reduce((total, item) => total + item.totalUnpaid, 0);
  const totalAdvanced = summary.reduce((total, item) => total + item.totalAdvanced, 0);
  const totalEarned = totalDebt + totalAdvanced;
  const totalUnpaidShifts = summary.reduce((total, item) => total + item.unpaidCount, 0);
  const totalAdvancedShifts = summary.reduce((total, item) => total + item.advancedCount, 0);
  const totalShifts = totalUnpaidShifts + totalAdvancedShifts;
  const totalFees = summary.reduce(
    (total, item) => total + ((item as PayrollSummaryWithFees).totalFees || 0),
    0
  );

  return {
    totalDebt,
    totalAdvanced,
    totalEarned,
    totalShifts,
    totalUnpaidShifts,
    totalAdvancedShifts,
    totalFees,
  };
};
