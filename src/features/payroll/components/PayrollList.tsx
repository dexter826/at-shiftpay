import React, { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, ChevronRightIcon } from 'lucide-react';
import { Skeleton } from '@/components/ui/Skeleton';
import { LoadMore } from '@/components/ui/LoadMore';
import { formatCurrency } from '@/utils/format';
import { PayrollSummary, Employee } from '@/types/index';
import { focusRingClasses } from '@/lib/utils';
import { DURATION_BASE } from '@/lib/motion';

interface PayrollListProps {
  loading: boolean;
  items: PayrollSummary[];
  employees: Employee[];
  visibleCount: number;
  setVisibleCount: React.Dispatch<React.SetStateAction<number>>;
  onSelectEmployee: (id: string) => void;
  onPaymentClick: (id: string) => void;
  searchTerm: string;
}

const PayrollList: React.FC<PayrollListProps> = ({
  loading,
  items,
  employees,
  visibleCount,
  setVisibleCount,
  onSelectEmployee,
  onPaymentClick,
  searchTerm,
}) => {
  return (
    <AnimatePresence mode="wait">
      {loading ? (
        <motion.div
          key="loading-list"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: DURATION_BASE }}
          className="space-y-2"
        >
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className={`w-full p-3 bg-surface border border-line rounded-md flex justify-between items-center`}
            >
              <div className="flex items-center gap-3 w-full">
                <Skeleton variant="circular" width={36} height={36} />
                <div className="flex-1 space-y-2">
                  <Skeleton width="40%" height={16} />
                  <Skeleton width="30%" height={12} />
                </div>
                <Skeleton width={80} height={20} />
              </div>
            </div>
          ))}
        </motion.div>
      ) : (
        <motion.div
          key="payroll-list"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: DURATION_BASE }}
          className="space-y-2"
        >
          {items.length === 0 ? (
            <div className={`text-center py-10 text-ink-muted`}>
              <CheckCircle size={48} className="mx-auto mb-2" />
              <p>{searchTerm ? 'Không tìm thấy nhân viên nào' : 'Không có khoản nợ nào'}</p>
            </div>
          ) : (
            <>
              {items.slice(0, visibleCount).map((item) => {
                const employee = employees.find((e) => e.id === item.employeeId);
                const employeeImage = employee?.imageUrl;
                const itemWithFees = item as typeof item & { totalFees?: number };

                return (
                  <button
                    key={item.employeeId}
                    onClick={() => {
                      onSelectEmployee(item.employeeId);
                      // Tự động mở thanh toán nếu sạch nợ (Moved logic to parent or handle here? Parent handles logic usually, but here we just trigger)
                      // Logic in original was:
                      // setSelectedEmpId(item.employeeId);
                      // if (item.totalUnpaid > 0 && item.totalAdvanced === 0) {
                      //   setShowPaymentModal(true);
                      // }
                      // We will delegate to onPaymentClick which might handle the check or we pass the check result
                      if (item.totalUnpaid > 0 && item.totalAdvanced === 0) {
                        onPaymentClick(item.employeeId);
                      }
                    }}
                    className={`w-full p-3 bg-surface border border-line rounded-md hover:border-ink-muted transition-colors duration-fast ease-standard flex justify-between items-center ${focusRingClasses}`}
                  >
                    <div className="flex items-center gap-3">
                      {employeeImage ? (
                        <img
                          src={employeeImage}
                          alt={item.employeeName}
                          decoding="async"
                          className={`w-9 h-9 rounded-full object-cover border ${item.totalUnpaid > 0 ? 'border-warning' : 'border-line'}`}
                        />
                      ) : (
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center text-body-sm font-medium text-ink-soft bg-surface-2`}
                        >
                          {item.employeeName.charAt(0)}
                        </div>
                      )}
                      <div className="text-left">
                        <div className="flex items-center gap-2">
                          <p className={`text-body-sm font-medium text-ink-soft`}>
                            {item.employeeName}
                          </p>
                          {itemWithFees.totalFees && itemWithFees.totalFees > 0 && (
                            <span className="flex items-center gap-1.5 px-1.5 py-0.5 rounded-xs bg-surface-2 text-label font-medium text-ink-soft">
                              <span className="w-1.5 h-1.5 rounded-xs bg-info" />
                              Có phụ phí
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-label tabular-nums">
                          {item.unpaidCount > 0 && (
                            <span className="text-warning">{item.unpaidCount} công chưa trả</span>
                          )}
                          {item.advancedCount > 0 && (
                            <span className="text-info">{item.advancedCount} công đã ứng</span>
                          )}
                          {item.unpaidCount === 0 && item.advancedCount === 0 && (
                            <span className="text-ink-muted">Không có công nợ</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <span
                          className={`text-body-sm font-semibold tabular-nums ${item.totalUnpaid > 0 ? 'text-warning' : 'text-ink-muted'}`}
                        >
                          {formatCurrency(item.totalUnpaid)}
                        </span>
                        {item.totalAdvanced > 0 && (
                          <p className="text-label text-info">
                            Đã ứng: {formatCurrency(item.totalAdvanced)}
                          </p>
                        )}
                      </div>
                      <ChevronRightIcon size={16} className="text-ink-muted" />
                    </div>
                  </button>
                );
              })}
              <LoadMore
                currentCount={visibleCount}
                totalCount={items.length}
                onLoadMore={() => setVisibleCount((prev) => prev + 15)}
                unit="nhân viên"
                className="pt-2 pb-4"
              />
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default memo(PayrollList);
