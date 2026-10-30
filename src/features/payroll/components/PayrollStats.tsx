import React, { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Skeleton } from '@/components/ui/Skeleton';
import { formatCurrency } from '@/utils/format';
import { Wallet } from 'lucide-react';
import { DURATION_BASE } from '@/lib/motion';

interface PayrollStatsProps {
  loading: boolean;
  totalEarned: number;
  totalDebt: number;
  totalAdvanced: number;
  totalShifts: number;
  totalFees: number;
  totalUnpaidShifts: number;
  totalAdvancedShifts: number;
}

const PayrollStats: React.FC<PayrollStatsProps> = ({
  loading,
  totalEarned,
  totalDebt,
  totalAdvanced,
  totalShifts,
  totalFees,
  totalUnpaidShifts,
  totalAdvancedShifts,
}) => {
  return (
    <div className="p-4 bg-surface border border-line rounded-md">
      {/* Mobile UI */}
      <div className="block md:hidden">
        {/* Tổng đã làm - Lên trên */}
        <div className="text-center mb-4">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Wallet size={16} className="text-ink-soft" />
            <p className="text-label font-medium text-ink-muted">Tổng đã làm</p>
            <span className="w-1.5 h-1.5 bg-accent-ink" />
          </div>
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading-total"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: DURATION_BASE }}
              >
                <Skeleton width={120} height={36} className="mx-auto" />
              </motion.div>
            ) : (
              <motion.p
                key="content-total"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: DURATION_BASE }}
                className="text-data font-semibold text-accent-ink tabular-nums"
              >
                {formatCurrency(totalEarned)}
              </motion.p>
            )}
          </AnimatePresence>
          <p className="text-body-sm text-ink-soft mt-1 tabular-nums">
            {totalShifts} công{totalFees > 0 ? ` (+ ${formatCurrency(totalFees)} phụ phí)` : ''}
          </p>
        </div>

        {/* Tình hình lương + Đã ứng (2 cột) */}
        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-line">
          <div className="text-center flex flex-col items-center">
            <p className="text-label font-medium text-ink-muted flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-warning" />
              Tình hình lương
            </p>
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  key="loading-debt"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: DURATION_BASE }}
                  className="mt-1"
                >
                  <Skeleton width={80} height={24} />
                </motion.div>
              ) : (
                <motion.p
                  key="content-debt"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: DURATION_BASE }}
                  className="text-title font-semibold text-ink mt-1 tabular-nums"
                >
                  {formatCurrency(totalDebt)}
                </motion.p>
              )}
            </AnimatePresence>
            <p className="text-label font-medium text-ink-soft tabular-nums">
              {totalUnpaidShifts} công
            </p>
          </div>

          <div className="text-center flex flex-col items-center">
            <p className="text-label font-medium text-ink-muted flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-info" />
              Đã ứng
            </p>
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  key="loading-advanced"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: DURATION_BASE }}
                  className="mt-1"
                >
                  <Skeleton width={80} height={24} />
                </motion.div>
              ) : (
                <motion.p
                  key="content-advanced"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: DURATION_BASE }}
                  className={`text-title font-semibold mt-1 tabular-nums ${totalAdvanced > 0 ? 'text-ink' : 'text-ink-muted'}`}
                >
                  {formatCurrency(totalAdvanced)}
                </motion.p>
              )}
            </AnimatePresence>
            <p
              className={`text-label font-medium tabular-nums ${totalAdvanced > 0 ? 'text-ink-soft' : 'text-ink-muted'}`}
            >
              {totalAdvancedShifts} công
            </p>
          </div>
        </div>
      </div>

      {/* Desktop UI */}
      <div className="hidden md:flex justify-between items-start">
        <div className="flex-1">
          <div className="grid grid-cols-3 gap-6">
            {/* Tình hình lương */}
            <div>
              <p className="text-label font-medium text-ink-muted flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-warning" />
                Tình hình lương
              </p>
              <AnimatePresence mode="wait">
                {loading ? (
                  <motion.div
                    key="loading-debt-dt"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: DURATION_BASE }}
                    className="mt-1"
                  >
                    <Skeleton width={100} height={32} />
                  </motion.div>
                ) : (
                  <motion.p
                    key="content-debt-dt"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: DURATION_BASE }}
                    className="text-data font-semibold text-ink mt-1 tabular-nums"
                  >
                    {formatCurrency(totalDebt)}
                  </motion.p>
                )}
              </AnimatePresence>
              <p className="text-label font-medium text-ink-soft mt-1 tabular-nums">
                {totalUnpaidShifts} công
              </p>
            </div>

            {/* Đã ứng */}
            <div>
              <p className="text-label font-medium text-ink-muted flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-info" />
                Đã ứng
              </p>
              <AnimatePresence mode="wait">
                {loading ? (
                  <motion.div
                    key="loading-advanced-dt"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: DURATION_BASE }}
                    className="mt-1"
                  >
                    <Skeleton width={100} height={28} />
                  </motion.div>
                ) : (
                  <motion.p
                    key="content-advanced-dt"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: DURATION_BASE }}
                    className={`text-data font-semibold mt-1 tabular-nums ${totalAdvanced > 0 ? 'text-ink' : 'text-ink-muted'}`}
                  >
                    {formatCurrency(totalAdvanced)}
                  </motion.p>
                )}
              </AnimatePresence>
              <p
                className={`text-label font-medium mt-1 tabular-nums ${totalAdvanced > 0 ? 'text-ink-soft' : 'text-ink-muted'}`}
              >
                {totalAdvancedShifts} công
              </p>
            </div>

            {/* Tổng đã làm */}
            <div>
              <p className="text-label font-medium text-ink-muted flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-accent-ink" />
                Tổng đã làm
              </p>
              <AnimatePresence mode="wait">
                {loading ? (
                  <motion.div
                    key="loading-total-dt"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: DURATION_BASE }}
                    className="mt-1"
                  >
                    <Skeleton width={100} height={28} />
                  </motion.div>
                ) : (
                  <motion.p
                    key="content-total-dt"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: DURATION_BASE }}
                    className="text-data font-semibold text-accent-ink mt-1 tabular-nums"
                  >
                    {formatCurrency(totalEarned)}
                  </motion.p>
                )}
              </AnimatePresence>
              <p className="text-label font-medium text-ink-soft mt-1 tabular-nums">
                {totalShifts} công{totalFees > 0 ? ` (+ ${formatCurrency(totalFees)} phụ phí)` : ''}
              </p>
            </div>
          </div>
        </div>
        <Wallet size={24} className="text-ink-muted" />
      </div>
    </div>
  );
};

export default memo(PayrollStats);
