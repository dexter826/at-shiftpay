import React, { memo, useEffect, useMemo, useState } from 'react';
import { Download } from 'lucide-react';
import {
  Shift,
  Employee,
  PaymentTransaction,
  PayrollSummary,
  Event,
  Location,
} from '@/types/index';
import { paymentService } from '@/lib/api/paymentService';
import { useAuthStore } from '@/stores/authStore';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import Button from '@/components/ui/Button';
import PayrollStats from '@/features/payroll/components/PayrollStats';
import PayrollFilters, {
  type PayrollSort,
  type PayrollTab,
} from '@/features/payroll/components/PayrollFilters';
import PayrollList from '@/features/payroll/components/PayrollList';
import HistoryList from '@/features/payroll/components/HistoryList';
import PayrollEmployeeDetailModal from '@/features/payroll/components/PayrollEmployeeDetailModal';
import TransactionDetailModal from '@/features/payroll/components/TransactionDetailModal';
import PayrollMonthPickerModal from '@/features/payroll/components/PayrollMonthPickerModal';
import { PaymentModal } from '@/features/payroll/components/PaymentModal';
import { SettlementModal } from '@/features/payroll/components/SettlementModal';
import { usePayrollData } from '@/features/payroll/hooks/usePayrollData';

interface PayrollViewProps {
  shifts: Shift[];
  employees: Employee[];
  events: Event[];
  locations: Location[];
  loading?: boolean;
  onOpenExport: () => void;
}

const startOfWindowMonthsAgo = (monthsBack: number): number => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() - monthsBack, 1).getTime();
};

const parseMonthStart = (value: string): number => {
  const [year, month] = value.split('-').map(Number);
  return new Date(year, month - 1, 1).getTime();
};

const nextMonthStart = (value: string): number => {
  const [year, month] = value.split('-').map(Number);
  return new Date(year, month, 1).getTime();
};

const PayrollView: React.FC<PayrollViewProps> = ({
  shifts,
  employees,
  events,
  locations,
  loading = false,
  onOpenExport,
}) => {
  const { user } = useAuthStore();
  const userId = user?.uid || '';

  const [activeTab, setActiveTab] = useState<PayrollTab>('debt');
  const [paymentHistory, setPaymentHistory] = useState<PaymentTransaction[]>([]);
  const [paymentSince, setPaymentSince] = useState(() => startOfWindowMonthsAgo(11));
  const [historySearch, setHistorySearch] = useState('');
  const [historyLoading, setHistoryLoading] = useState(true);
  const [filterDate, setFilterDate] = useState('');
  const [isMonthPickerOpen, setIsMonthPickerOpen] = useState(false);
  const [viewYear, setViewYear] = useState(new Date().getFullYear());
  const [payrollVisibleCount, setPayrollVisibleCount] = useState(12);

  const [detailEmployeeId, setDetailEmployeeId] = useState<string | null>(null);
  const [paymentSummary, setPaymentSummary] = useState<PayrollSummary | null>(null);
  const [settlementTarget, setSettlementTarget] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [selectedTransactionId, setSelectedTransactionId] = useState<string | null>(null);

  const {
    summary,
    filteredAndSortedSummary,
    stats,
    searchTerm: payrollSearchTerm,
    setSearchTerm: setPayrollSearchTerm,
    sortBy: payrollSortBy,
    setSortBy: setPayrollSortBy,
  } = usePayrollData({ shifts, employees, events });

  useEffect(() => {
    if (!userId) return;

    const unsubscribe = paymentService.subscribePayments(
      userId,
      paymentSince,
      (payments) => {
        setPaymentHistory(payments);
        setHistoryLoading(false);
      },
      () => setHistoryLoading(false)
    );

    return () => unsubscribe();
  }, [userId, paymentSince]);

  const openMonthPicker = () => {
    setViewYear(filterDate ? Number(filterDate.split('-')[0]) : new Date().getFullYear());
    setIsMonthPickerOpen(true);
  };

  const debtEmployees = useMemo(
    () => summary.filter((item) => item.totalUnpaid > 0 || item.totalAdvanced > 0).length,
    [summary]
  );

  const detailSummary = useMemo(
    () => summary.find((item) => item.employeeId === detailEmployeeId) ?? null,
    [summary, detailEmployeeId]
  );

  const detailUnpaidShifts = useMemo(() => {
    if (!detailEmployeeId) return [];
    return shifts
      .filter((shift) => shift.employeeId === detailEmployeeId && shift.status === 'unpaid')
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [detailEmployeeId, shifts]);

  const detailAdvancedShifts = useMemo(() => {
    if (!detailEmployeeId) return [];
    return shifts
      .filter((shift) => shift.employeeId === detailEmployeeId && shift.status === 'advanced')
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [detailEmployeeId, shifts]);

  const selectedTransaction = useMemo(
    () => paymentHistory.find((payment) => payment.id === selectedTransactionId) ?? null,
    [selectedTransactionId, paymentHistory]
  );

  const transactionShifts = useMemo(() => {
    if (!selectedTransaction) return [];
    return (
      selectedTransaction.shiftIds
        ?.map((shiftId) => shifts.find((shift) => shift.id === shiftId))
        .filter((shift): shift is Shift => shift !== undefined) ?? []
    );
  }, [selectedTransaction, shifts]);

  const filteredHistory = useMemo(() => {
    const term = historySearch.trim().toLowerCase();
    return paymentHistory.filter((payment) => {
      const matchesSearch = !term || payment.employeeName.toLowerCase().includes(term);
      const matchesDate = filterDate
        ? payment.date >= parseMonthStart(filterDate) && payment.date < nextMonthStart(filterDate)
        : true;
      return matchesSearch && matchesDate;
    });
  }, [paymentHistory, historySearch, filterDate]);

  const handlePayrollSearchChange = (value: string) => {
    setPayrollSearchTerm(value);
    setPayrollVisibleCount(12);
  };

  const handlePayrollSortChange = (value: PayrollSort) => {
    setPayrollSortBy(value);
    setPayrollVisibleCount(12);
  };

  const handleFilterDateChange = (value: string) => {
    setFilterDate(value);
    if (!value) return;
    const monthStart = parseMonthStart(value);
    if (monthStart < paymentSince) {
      setHistoryLoading(true);
      setPaymentSince(monthStart);
    }
  };

  const handleLoadMorePayments = () => {
    setHistoryLoading(true);
    setPaymentSince((previous) => {
      const current = new Date(previous);
      return new Date(current.getFullYear(), current.getMonth() - 12, 1).getTime();
    });
  };

  const openPayment = (summaryItem: PayrollSummary) => {
    setDetailEmployeeId(null);
    setPaymentSummary(summaryItem);
  };

  const openSettlement = (summaryItem: PayrollSummary) => {
    setDetailEmployeeId(null);
    setSettlementTarget({
      id: summaryItem.employeeId,
      name: summaryItem.employeeName,
    });
  };

  return (
    <div className="min-h-dynamic bg-canvas">
      <div className="mx-auto max-w-[1400px] px-4 py-5 md:px-6 md:py-6">
        <header className="flex flex-col gap-4 border-b border-line pb-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-mono text-mono-label text-ink-muted">
              {loading ? 'Đang tải công nợ' : `Công nợ hiện tại · ${debtEmployees} nhân viên`}
            </p>
            <h1 className="mt-1 text-display text-ink">Sổ lương</h1>
          </div>
          <Button variant="outline" onClick={onOpenExport} icon={<Download size={16} />}>
            Xuất báo cáo
          </Button>
        </header>

        <div className="mt-4">
          <PayrollStats loading={loading} {...stats} />
        </div>

        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as PayrollTab)}
          className="mt-4"
        >
          <TabsList>
            <TabsTrigger value="debt">Công nợ</TabsTrigger>
            <TabsTrigger value="history">Lịch sử</TabsTrigger>
          </TabsList>

          <TabsContent value="debt" className="space-y-3">
            <PayrollFilters
              activeTab="debt"
              loading={loading}
              payrollSearchTerm={payrollSearchTerm}
              onPayrollSearchChange={handlePayrollSearchChange}
              payrollSortBy={payrollSortBy}
              onPayrollSortChange={handlePayrollSortChange}
              historySearchTerm={historySearch}
              onHistorySearchChange={setHistorySearch}
              filterDate={filterDate}
              historySince={paymentSince}
              onOpenMonthPicker={openMonthPicker}
            />

            <PayrollList
              loading={loading}
              items={filteredAndSortedSummary}
              employees={employees}
              visibleCount={payrollVisibleCount}
              onLoadMore={() =>
                setPayrollVisibleCount((current) =>
                  Math.min(current + 12, filteredAndSortedSummary.length)
                )
              }
              onSelectEmployee={setDetailEmployeeId}
              searchTerm={payrollSearchTerm}
              onClearSearch={() => handlePayrollSearchChange('')}
            />
          </TabsContent>

          <TabsContent value="history" className="space-y-3">
            <PayrollFilters
              activeTab="history"
              loading={loading || historyLoading}
              payrollSearchTerm={payrollSearchTerm}
              onPayrollSearchChange={handlePayrollSearchChange}
              payrollSortBy={payrollSortBy}
              onPayrollSortChange={handlePayrollSortChange}
              historySearchTerm={historySearch}
              onHistorySearchChange={setHistorySearch}
              filterDate={filterDate}
              historySince={paymentSince}
              onOpenMonthPicker={openMonthPicker}
            />

            <HistoryList
              loading={loading || historyLoading}
              items={filteredHistory}
              onSelectTransaction={setSelectedTransactionId}
              onLoadMore={handleLoadMorePayments}
              hasSearch={historySearch.trim().length > 0}
              hasDateFilter={Boolean(filterDate)}
              onClearSearch={() => setHistorySearch('')}
            />
          </TabsContent>
        </Tabs>
      </div>

      {detailEmployeeId && detailSummary && (
        <PayrollEmployeeDetailModal
          isOpen
          onClose={() => setDetailEmployeeId(null)}
          selectedEmployeeSummary={detailSummary}
          selectedUnpaidShifts={detailUnpaidShifts}
          selectedAdvancedShifts={detailAdvancedShifts}
          onPayment={() => openPayment(detailSummary)}
          onSettlement={() => openSettlement(detailSummary)}
          events={events}
          locations={locations}
        />
      )}

      {paymentSummary && (
        <PaymentModal
          isOpen
          onClose={() => setPaymentSummary(null)}
          employeeSummary={paymentSummary}
          shifts={shifts}
          events={events}
          employees={employees}
          locations={locations}
        />
      )}

      {settlementTarget && (
        <SettlementModal
          isOpen
          onClose={() => setSettlementTarget(null)}
          employeeId={settlementTarget.id}
          employeeName={settlementTarget.name}
          shifts={shifts}
        />
      )}

      {selectedTransactionId && (
        <TransactionDetailModal
          isOpen
          onClose={() => setSelectedTransactionId(null)}
          selectedTransaction={selectedTransaction}
          transactionShifts={transactionShifts}
          events={events}
          locations={locations}
        />
      )}

      <PayrollMonthPickerModal
        isOpen={isMonthPickerOpen}
        onClose={() => setIsMonthPickerOpen(false)}
        filterDate={filterDate}
        setFilterDate={handleFilterDateChange}
        viewYear={viewYear}
        setViewYear={setViewYear}
      />
    </div>
  );
};

export default memo(PayrollView);
