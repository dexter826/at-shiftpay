import { useMemo, useState } from 'react';
import type { Employee, Event, Shift } from '@/types/index';
import { buildPayrollSummary, calculatePayrollStats } from '@/features/payroll/payrollSummary';

interface UsePayrollDataProps {
  shifts: Shift[];
  employees: Employee[];
  events: Event[];
}

export const usePayrollData = ({ shifts, employees, events }: UsePayrollDataProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'amount' | 'shifts' | 'name'>('amount');

  const summary = useMemo(
    () => buildPayrollSummary(shifts, employees, events),
    [shifts, employees, events]
  );

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

  const stats = useMemo(() => calculatePayrollStats(summary), [summary]);

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
