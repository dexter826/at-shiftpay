import React, { memo } from 'react';
import { Skeleton } from '@/components/ui/Skeleton';
import { formatCurrency } from '@/utils/format';
import { cn } from '@/lib/utils';

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
  const cells = [
    {
      label: 'Chưa thanh toán',
      value: formatCurrency(totalDebt),
      note: `${totalUnpaidShifts} ca`,
      valueClass: totalDebt > 0 ? 'text-warning' : 'text-ink-muted',
    },
    {
      label: 'Đã ứng',
      value: formatCurrency(totalAdvanced),
      note: `${totalAdvancedShifts} ca`,
      valueClass: totalAdvanced > 0 ? 'text-info' : 'text-ink-muted',
    },
    {
      label: 'Tổng lương chưa chốt',
      value: formatCurrency(totalEarned),
      note: `${totalShifts} ca${totalFees > 0 ? ` · gồm ${formatCurrency(totalFees)} phụ phí` : ''}`,
      valueClass: 'text-ink',
    },
  ];

  return (
    <section
      aria-label="Công nợ hiện tại"
      className="grid gap-px border border-line border-t-2 border-t-ink bg-line sm:grid-cols-3"
    >
      {cells.map((cell) => (
        <div key={cell.label} className="bg-surface px-3.5 py-3">
          <p className="font-mono text-mono-label text-ink-muted">{cell.label}</p>
          {loading ? (
            <>
              <Skeleton width={110} height={24} className="mt-1" />
              <Skeleton width={54} height={11} className="mt-1.5" />
            </>
          ) : (
            <>
              <p className={cn('mt-0.5 font-mono text-data tabular-nums', cell.valueClass)}>
                {cell.value}
              </p>
              <p className="mt-0.5 text-label text-ink-muted">{cell.note}</p>
            </>
          )}
        </div>
      ))}
    </section>
  );
};

export default memo(PayrollStats);
