import React, { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { History, Clock, ChevronRightIcon } from 'lucide-react';
import Button from '@/components/ui/Button';
import { formatCurrency } from '@/utils/format';
import { PaymentTransaction } from '@/types/index';
import { focusRingClasses } from '@/lib/utils';
import { DURATION_BASE } from '@/lib/motion';

interface HistoryListProps {
  loading: boolean;
  items: PaymentTransaction[];
  onSelectTransaction: (id: string) => void;
  onLoadMore?: () => void;
}

const HistoryList: React.FC<HistoryListProps> = ({
  loading,
  items,
  onSelectTransaction,
  onLoadMore,
}) => {
  return (
    <AnimatePresence mode="wait">
      {loading ? (
        <motion.div
          key="loading-list" // Reusing same key as payroll because they are conditional
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: DURATION_BASE }}
          className="space-y-2"
        >
          {/* Skeleton can be same or specific for history */}
        </motion.div>
      ) : (
        <motion.div
          key="history-list"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: DURATION_BASE }}
          className="space-y-2"
        >
          {items.length === 0 ? (
            <div className={`text-center py-10 text-ink-muted`}>
              <History size={48} className="mx-auto mb-2" />
              <p>Không tìm thấy giao dịch nào</p>
            </div>
          ) : (
            <>
              {items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onSelectTransaction(item.id)}
                  className={`w-full p-3 bg-surface border border-line rounded-md hover:border-ink-muted transition-colors duration-fast ease-standard flex justify-between items-center ${focusRingClasses}`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-sm flex items-center justify-center bg-surface-2 text-ink-soft`}
                    >
                      <History size={16} />
                    </div>
                    <div className="text-left">
                      <div className="flex items-center gap-2">
                        <p className={`text-body-sm font-medium text-ink-soft`}>
                          {item.employeeName}
                        </p>
                        {item.type === 'advance' && (
                          <span className="flex items-center gap-1.5 px-2 py-[3px] rounded-xs bg-surface-2 text-label font-medium text-ink-muted">
                            <span className="w-1.5 h-1.5 bg-info" />
                            Ứng tiền
                          </span>
                        )}
                        {item.type === 'settlement' && (
                          <span className="flex items-center gap-1.5 px-2 py-[3px] rounded-xs bg-surface-2 text-label font-medium text-ink-muted">
                            <span className="w-1.5 h-1.5 bg-accent-ink" />
                            Quyết toán
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={12} className="text-ink-muted" />
                        <p className={`text-label font-medium text-ink-muted tabular-nums`}>
                          {new Date(item.date).toLocaleDateString('vi-VN')}{' '}
                          {new Date(item.date).toLocaleTimeString('vi-VN', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`text-body-sm font-semibold text-ink tabular-nums`}>
                      {formatCurrency(item.amount)}
                    </span>
                    <ChevronRightIcon size={16} className="text-ink-muted" />
                  </div>
                </button>
              ))}

              {items.length > 0 && (
                <div className="mt-6 space-y-3">
                  <p className={`text-center text-label font-medium text-ink-muted tabular-nums`}>
                    Đang hiển thị {items.length} giao dịch
                  </p>
                  {onLoadMore && (
                    <Button variant="secondary" fullWidth onClick={onLoadMore}>
                      Tải thêm 12 tháng
                    </Button>
                  )}
                </div>
              )}
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default memo(HistoryList);
