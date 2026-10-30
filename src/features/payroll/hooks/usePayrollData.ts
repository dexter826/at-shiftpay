import { useState, useMemo } from 'react';
import { Shift, Employee, PayrollSummary, Event } from '@/types/index';
import { shiftBreakdown } from '@/utils/payrollMath';

interface UsePayrollDataProps {
  shifts: Shift[];
  employees: Employee[];
  events: Event[];
}

export const usePayrollData = ({ shifts, employees, events }: UsePayrollDataProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'amount' | 'shifts' | 'name'>('amount');

  const summary: PayrollSummary[] = useMemo(() => {
    const map: Record<string, PayrollSummary & { totalFees?: number }> = {};

    employees.forEach((emp) => {
      map[emp.id] = {
        employeeId: emp.id,
        employeeName: emp.name,
        phone: emp.phone,
        unpaidCount: 0,
        totalUnpaid: 0,
        advancedCount: 0,
        totalAdvanced: 0,
        netAmount: 0,
      };
    });

    shifts.forEach((s) => {
      if (map[s.employeeId]) {
        const event = events.find((e) => e.id === s.eventId);
        const shiftFee = event ? shiftBreakdown(s, event).surcharge : 0;

        if (s.status === 'unpaid') {
          map[s.employeeId].unpaidCount += 1;
          map[s.employeeId].totalUnpaid += s.amount;
          if (shiftFee > 0) {
            map[s.employeeId].totalFees = (map[s.employeeId].totalFees || 0) + shiftFee;
          }
        } else if (s.status === 'advanced') {
          map[s.employeeId].advancedCount += 1;
          map[s.employeeId].totalAdvanced += s.amount;
          if (shiftFee > 0) {
            map[s.employeeId].totalFees = (map[s.employeeId].totalFees || 0) + shiftFee;
          }
        }
      }
    });

    Object.values(map).forEach((emp) => {
      emp.netAmount = emp.totalUnpaid;
    });

    return Object.values(map).sort((a, b) => b.netAmount - a.netAmount);
  }, [shifts, employees, events]);

  const filteredAndSortedSummary = useMemo(() => {
    const filtered = summary.filter((item) => {
      const matchesSearch =
        item.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.phone.includes(searchTerm);
      const hasDebt = item.totalUnpaid > 0 || item.totalAdvanced > 0;
      return matchesSearch && hasDebt;
    });

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'amount':
          return b.totalUnpaid - a.totalUnpaid;
        case 'shifts':
          return b.unpaidCount - a.unpaidCount;
        case 'name':
          return a.employeeName.localeCompare(b.employeeName, 'vi');
        default:
          return 0;
      }
    });
  }, [summary, searchTerm, sortBy]);

  const stats = useMemo(() => {
    const totalDebt = summary.reduce((acc, curr) => acc + curr.totalUnpaid, 0);
    const totalAdvanced = summary.reduce((acc, curr) => acc + curr.totalAdvanced, 0);
    const totalEarned = totalDebt + totalAdvanced;
    const totalUnpaidShifts = summary.reduce((acc, curr) => acc + curr.unpaidCount, 0);
    const totalAdvancedShifts = summary.reduce((acc, curr) => acc + curr.advancedCount, 0);
    const totalShifts = totalUnpaidShifts + totalAdvancedShifts;
    const totalFees = summary.reduce((acc, curr) => acc + (curr.totalFees || 0), 0);

    return {
      totalDebt,
      totalAdvanced,
      totalEarned,
      totalShifts,
      totalUnpaidShifts,
      totalAdvancedShifts,
      totalFees,
    };
  }, [summary]);

  return {
    summary,
    filteredAndSortedSummary,
    stats,
    searchTerm,
    setSearchTerm,
    sortBy,
    setSortBy,
  };
};
