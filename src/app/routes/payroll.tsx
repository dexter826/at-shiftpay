import React, { useMemo, useState, useEffect, memo } from 'react';
import { Shift, Employee, PaymentTransaction, Event, Location } from '@/types/index';
import { paymentService } from '@/lib/api/paymentService';

/* removed unused import from @/components/ui/ToastProvider */
import { PaymentModal } from '@/features/payroll/components/PaymentModal';
import { SettlementModal } from '@/features/payroll/components/SettlementModal';
import { useAuthStore } from '@/stores/authStore';
/* removed unused import from @/components/ui/Dropdown */

// Import extracted components
import PayrollStats from '@/features/payroll/components/PayrollStats';
import PayrollFilters from '@/features/payroll/components/PayrollFilters';
import PayrollList from '@/features/payroll/components/PayrollList';
import HistoryList from '@/features/payroll/components/HistoryList';
import EmployeeDetailModal from '@/features/payroll/components/PayrollEmployeeDetailModal';
import TransactionDetailModal from '@/features/payroll/components/TransactionDetailModal';
import PayrollMonthPickerModal from '@/features/payroll/components/PayrollMonthPickerModal';
import { usePayrollData } from '@/features/payroll/hooks/usePayrollData';

interface PayrollViewProps {
  shifts: Shift[];
  employees: Employee[];
  events: Event[];
  locations: Location[];
  loading?: boolean;
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
}) => {
  const [activeTab, setActiveTab] = useState<'payroll' | 'history'>('payroll');
  const [paymentHistory, setPaymentHistory] = useState<PaymentTransaction[]>([]);
  const [paymentSince, setPaymentSince] = useState(() => startOfWindowMonthsAgo(11));

  const [selectedEmpId, setSelectedEmpId] = useState<string | null>(null);
  const [selectedTransactionId, setSelectedTransactionId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [viewYear, setViewYear] = useState(new Date().getFullYear());
  const [selectedShiftIds, setSelectedShiftIds] = useState<string[]>([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showSettlementModal, setShowSettlementModal] = useState(false);
  const [payrollVisibleCount, setPayrollVisibleCount] = useState(15);
  const { user } = useAuthStore();
  const userId = user?.uid || '';

  const {
    summary,
    filteredAndSortedSummary,
    stats,
    searchTerm: payrollSearchTerm,
    setSearchTerm: setPayrollSearchTerm,
    sortBy: payrollSortBy,
    setSortBy: setPayrollSortBy,
  } = usePayrollData({ shifts, employees, events });

  const {
    totalDebt,
    totalAdvanced,
    totalEarned,
    totalShifts,
    totalUnpaidShifts,
    totalAdvancedShifts,
    totalFees,
  } = stats;

  // Reset phan trang khi doi tim kiem
  const handlePayrollSearchChange = (value: string) => {
    setPayrollSearchTerm(value);
    setPayrollVisibleCount(15);
  };

  const handlePayrollSortChange = (value: 'amount' | 'shifts' | 'name') => {
    setPayrollSortBy(value);
    setPayrollVisibleCount(15);
  };

  useEffect(() => {
    if (!userId) return;

    const unsubscribe = paymentService.subscribePayments(userId, paymentSince, (payments) => {
      setPaymentHistory(payments);
    });

    return () => unsubscribe();
  }, [userId, paymentSince]);

  // Chọn tháng cũ hơn cửa sổ hiện tại thì mở rộng cửa sổ để lịch sử có dữ liệu
  const handleFilterDateChange = (value: string) => {
    setFilterDate(value);
    if (!value) return;
    const monthStart = parseMonthStart(value);
    setPaymentSince((prev) => (monthStart < prev ? monthStart : prev));
  };

  // Hook style đồng bộ theme

  // Preload avatar nhân viên
  useEffect(() => {
    if (employees.length > 0) {
      employees.forEach((emp) => {
        const empImage = emp.imageUrl;
        if (empImage) {
          const img = new Image();
          img.src = empImage;
        }
      });
    }
  }, [employees]);
  // Chọn/Bỏ chọn
  const handleSelectAll = () => {
    if (selectedShiftIds.length === selectedUnpaidShifts.length) {
      setSelectedShiftIds([]);
    } else {
      setSelectedShiftIds(selectedUnpaidShifts.map((shift) => shift.id));
    }
  };

  // Chọn/Bỏ chọn từng ca
  const handleSelectShift = (shiftId: string) => {
    setSelectedShiftIds((prev) =>
      prev.includes(shiftId) ? prev.filter((id) => id !== shiftId) : [...prev, shiftId]
    );
  };

  const selectedEmployeeSummary =
    (selectedEmpId ? summary.find((s) => s.employeeId === selectedEmpId) : null) ?? null;
  // eslint-disable-next-line react-hooks/preserve-manual-memoization -- React Compiler is not enabled; memoization stays manual
  const selectedUnpaidShifts = useMemo(() => {
    if (!selectedEmpId) return [];
    return [...shifts.filter((s) => s.employeeId === selectedEmpId && s.status === 'unpaid')].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }, [selectedEmpId, shifts]);

  const selectedAdvancedShifts = useMemo(() => {
    if (!selectedEmpId) return [];
    return [
      ...shifts.filter((s) => s.employeeId === selectedEmpId && s.status === 'advanced'),
    ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [selectedEmpId, shifts]);

  const selectedTransaction = useMemo(() => {
    if (!selectedTransactionId) return null;
    return paymentHistory.find((p) => p.id === selectedTransactionId);
  }, [selectedTransactionId, paymentHistory]);

  // Chọn nhân viên và mặc định chọn mọi ca chưa trả
  const selectEmployee = (id: string) => {
    setSelectedEmpId(id);
    setSelectedShiftIds(
      shifts.filter((s) => s.employeeId === id && s.status === 'unpaid').map((s) => s.id)
    );
  };

  const transactionShifts = useMemo(() => {
    if (!selectedTransaction) return [];
    return (
      selectedTransaction.shiftIds
        ?.map((shiftId) => shifts.find((s) => s.id === shiftId))
        .filter((s): s is Shift => s !== undefined) || []
    );
  }, [selectedTransaction, shifts]);

  // Lịch sử giao dịch
  const filteredHistory = useMemo(() => {
    return paymentHistory.filter((payment) => {
      const matchesSearch = payment.employeeName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDate = filterDate
        ? payment.date >= parseMonthStart(filterDate) && payment.date < nextMonthStart(filterDate)
        : true;
      return matchesSearch && matchesDate;
    });
  }, [paymentHistory, searchTerm, filterDate]);

  const handleLoadMorePayments = () => {
    setPaymentSince((prev) => {
      const current = new Date(prev);
      return new Date(current.getFullYear(), current.getMonth() - 12, 1).getTime();
    });
  };

  return (
    <div className={`pb-28 md:pb-0 bg-canvas min-h-screen`}>
      {/* Tiêu đề & Stats */}
      <div className={`py-4 px-4 md:px-6 border-b border-line`}>
        <div className="flex justify-between items-center">
          {activeTab === 'payroll' && summary.length > 0 && null}
        </div>
        <PayrollStats
          loading={loading}
          totalEarned={totalEarned}
          totalDebt={totalDebt}
          totalAdvanced={totalAdvanced}
          totalShifts={totalShifts}
          totalFees={totalFees}
          totalUnpaidShifts={totalUnpaidShifts}
          totalAdvancedShifts={totalAdvancedShifts}
        />
      </div>

      {/* Tabs chuyển đổi */}
      <div className="flex px-4 md:px-6 pt-5 md:pt-6 pb-2 gap-4">
        <button
          onClick={() => setActiveTab('payroll')}
          className={`pb-2 text-sm font-medium transition-colors border-b-2 ${activeTab === 'payroll' ? 'border-accent text-accent-ink' : 'border-transparent text-ink-muted hover:text-ink-soft'}`}
        >
          Chưa thanh toán
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`pb-2 text-sm font-medium transition-colors border-b-2 ${activeTab === 'history' ? 'border-accent text-accent-ink' : 'border-transparent text-ink-muted hover:text-ink-soft'}`}
        >
          Lịch sử
        </button>
      </div>

      {/* Bộ lọc */}
      <PayrollFilters
        activeTab={activeTab}
        payrollSearchTerm={payrollSearchTerm}
        setPayrollSearchTerm={handlePayrollSearchChange}
        payrollSortBy={payrollSortBy}
        setPayrollSortBy={handlePayrollSortChange}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterDate={filterDate}
        onOpenFilterModal={() => setIsFilterModalOpen(true)}
        setViewYear={setViewYear}
        currentYear={viewYear}
      />

      {/* Danh sách */}
      <div className="px-4 md:px-6 pt-2 pb-4 md:pb-6 space-y-2">
        {activeTab === 'payroll' ? (
          <PayrollList
            loading={loading}
            items={filteredAndSortedSummary}
            employees={employees}
            visibleCount={payrollVisibleCount}
            setVisibleCount={setPayrollVisibleCount}
            onSelectEmployee={selectEmployee}
            onPaymentClick={(id) => {
              selectEmployee(id);
              setShowPaymentModal(true);
            }}
            searchTerm={payrollSearchTerm}
          />
        ) : (
          <HistoryList
            loading={loading}
            items={filteredHistory}
            onSelectTransaction={setSelectedTransactionId}
            onLoadMore={handleLoadMorePayments}
          />
        )}
      </div>

      {/* Modal chi tiết nhân viên */}
      <EmployeeDetailModal
        isOpen={!!selectedEmpId}
        onClose={() => setSelectedEmpId(null)}
        selectedEmployeeSummary={selectedEmployeeSummary}
        selectedUnpaidShifts={selectedUnpaidShifts}
        selectedAdvancedShifts={selectedAdvancedShifts}
        onPayment={() => {
          setSelectedShiftIds(selectedUnpaidShifts.map((s) => s.id));
          setShowPaymentModal(true);
        }}
        onSettlement={() => setShowSettlementModal(true)}
        events={events}
        locations={locations}
      />

      {/* Chi tiết giao dịch */}
      <TransactionDetailModal
        isOpen={!!selectedTransactionId}
        onClose={() => setSelectedTransactionId(null)}
        selectedTransaction={selectedTransaction}
        transactionShifts={transactionShifts}
        events={events}
        locations={locations}
      />

      {/* Chọn tháng */}
      <PayrollMonthPickerModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        filterDate={filterDate}
        setFilterDate={handleFilterDateChange}
        viewYear={viewYear}
        setViewYear={setViewYear}
      />

      {/* Modal thanh toán */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => {
          setShowPaymentModal(false);
          setShowPaymentModal(false);
          setSelectedEmpId(null);
          setSelectedShiftIds([]);
        }}
        employeeSummary={selectedEmployeeSummary}
        shifts={shifts}
        selectedShiftIds={selectedShiftIds}
        onShiftSelect={handleSelectShift}
        onSelectAll={handleSelectAll}
        events={events}
        employees={employees}
        locations={locations}
        onSuccess={() => {}}
      />

      {/* Modal quyết toán */}
      {selectedEmpId && (
        <SettlementModal
          isOpen={showSettlementModal}
          onClose={() => setShowSettlementModal(false)}
          employeeId={selectedEmpId}
          employeeName={selectedEmployeeSummary?.employeeName || ''}
          shifts={shifts}
          paymentHistory={paymentHistory}
          events={events}
          locations={locations}
          onSuccess={() => {}}
        />
      )}
    </div>
  );
};

export default memo(PayrollView);
