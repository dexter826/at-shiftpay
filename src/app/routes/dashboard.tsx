import React, { memo, useMemo } from 'react';
import { useNavigate } from 'react-router';
import type { Employee, Event, Location, Shift } from '@/types/index';
import { useAppDataStore } from '@/stores/appDataStore';
import {
  buildLocationSummary,
  buildWeekBoard,
  filterByMonth,
  getMonthLabel,
  getWeekRange,
} from '@/features/dashboard/dashboardData';
import { buildPayrollSummary } from '@/features/payroll/payrollSummary';
import DashboardHeader from '@/features/dashboard/components/DashboardHeader';
import DashboardSkeleton from '@/features/dashboard/components/DashboardSkeleton';
import KpiStrip from '@/features/dashboard/components/KpiStrip';
import LocationSummary from '@/features/dashboard/components/LocationSummary';
import PayrollSummary from '@/features/dashboard/components/PayrollSummary';
import TaskPanel from '@/features/dashboard/components/TaskPanel';
import WeekBoard from '@/features/dashboard/components/WeekBoard';

interface DashboardViewProps {
  employees: Employee[];
  events: Event[];
  shifts: Shift[];
  locations: Location[];
  loading?: boolean;
  onOpenExport: () => void;
}

const DashboardView: React.FC<DashboardViewProps> = ({
  employees,
  events,
  shifts,
  locations,
  loading = false,
  onOpenExport,
}) => {
  const navigate = useNavigate();
  const viewDate = useAppDataStore((state) => state.viewDate);
  const setViewDate = useAppDataStore((state) => state.setViewDate);

  const week = useMemo(() => getWeekRange(viewDate), [viewDate]);
  const board = useMemo(
    () => buildWeekBoard(events, shifts, locations, week),
    [events, shifts, locations, week]
  );
  const locationSummary = useMemo(
    () => buildLocationSummary(locations, events, shifts, week),
    [locations, events, shifts, week]
  );
  const monthlyShifts = useMemo(() => filterByMonth(shifts, viewDate), [shifts, viewDate]);
  const monthlyEvents = useMemo(() => filterByMonth(events, viewDate), [events, viewDate]);
  const payrollRows = useMemo(
    () => buildPayrollSummary(monthlyShifts, employees, monthlyEvents),
    [monthlyShifts, employees, monthlyEvents]
  );
  const monthLabel = getMonthLabel(viewDate);

  const openCalendar = () => navigate('/calendar');
  const openPayroll = () => navigate('/payroll');

  const changeWeek = (offset: number) => {
    const next = new Date(week.start);
    next.setDate(next.getDate() + offset * 7);
    setViewDate(next);
  };

  return (
    <div className="min-h-dynamic bg-canvas">
      <div className="mx-auto max-w-[1400px] px-4 py-5 md:px-6 md:py-6">
        {loading ? (
          <DashboardSkeleton />
        ) : (
          <div className="space-y-4">
            <DashboardHeader
              weekLabel={week.label}
              onPrevWeek={() => changeWeek(-1)}
              onNextWeek={() => changeWeek(1)}
              onToday={() => setViewDate(new Date())}
              onOpenExport={onOpenExport}
              onOpenCalendar={openCalendar}
            />

            <KpiStrip kpis={board.kpis} />

            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_292px]">
              <WeekBoard board={board} onOpenCalendar={openCalendar} />
              <TaskPanel
                unassigned={board.kpis.unassigned}
                unpaid={board.kpis.unpaidShifts}
                advanced={board.kpis.advancedShifts}
                onOpenCalendar={openCalendar}
                onOpenPayroll={openPayroll}
              />
            </div>

            <div className="grid gap-4 lg:grid-cols-[1.7fr_1fr]">
              <PayrollSummary
                rows={payrollRows}
                monthLabel={monthLabel}
                onOpenPayroll={openPayroll}
              />
              <LocationSummary rows={locationSummary} onOpenCalendar={openCalendar} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(DashboardView);
