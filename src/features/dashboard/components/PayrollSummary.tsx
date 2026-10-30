import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Tag } from '@/components/ui/Tag';
import { cn, focusRingClasses } from '@/lib/utils';
import { formatCurrency } from '@/utils/format';
import type { PayrollSummary } from '@/types/index';

interface PayrollSummaryProps {
  rows: PayrollSummary[];
  monthLabel: string;
  onOpenPayroll: () => void;
}

const getStatus = (row: PayrollSummary) => {
  if (row.totalUnpaid > 0) return { label: 'Chờ chốt', variant: 'warning' as const };
  if (row.totalAdvanced > 0) return { label: 'Đã ứng', variant: 'info' as const };
  return { label: 'Đã trả', variant: 'success' as const };
};

const PayrollSummaryPanel: React.FC<PayrollSummaryProps> = ({
  rows,
  monthLabel,
  onOpenPayroll,
}) => {
  const dueRows = rows
    .filter((row) => row.unpaidCount + row.advancedCount > 0)
    .sort((a, b) => b.totalUnpaid + b.totalAdvanced - (a.totalUnpaid + a.totalAdvanced));
  const desktopRows = dueRows.slice(0, 5);
  const mobileRows = dueRows.slice(0, 3);

  return (
    <section className="min-w-0 border border-line bg-surface">
      <div className="flex items-center justify-between gap-3 border-b border-line px-3.5 py-3">
        <h2 className="text-title text-ink">Sổ lương {monthLabel}</h2>
        <button
          type="button"
          onClick={onOpenPayroll}
          className={cn(
            'inline-flex items-center gap-1 text-label font-medium text-accent-ink hover:underline',
            focusRingClasses
          )}
        >
          Xem tất cả
          <ArrowUpRight size={12} aria-hidden="true" />
        </button>
      </div>

      {dueRows.length === 0 ? (
        <p className="px-3.5 py-8 text-center text-body-sm text-ink-muted">
          Chưa có ca nào cần thanh toán trong tháng.
        </p>
      ) : (
        <>
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="px-3.5 py-2 text-left font-mono text-mono-label font-normal text-ink-muted">
                    Nhân viên
                  </th>
                  <th className="px-2 py-2 text-right font-mono text-mono-label font-normal text-ink-muted">
                    Ca
                  </th>
                  <th className="px-2 py-2 text-right font-mono text-mono-label font-normal text-ink-muted">
                    Lương
                  </th>
                  <th className="px-2 py-2 text-right font-mono text-mono-label font-normal text-ink-muted">
                    Đã ứng
                  </th>
                  <th className="px-2 py-2 text-right font-mono text-mono-label font-normal text-ink-muted">
                    Còn lại
                  </th>
                  <th className="px-3.5 py-2 text-left font-mono text-mono-label font-normal text-ink-muted">
                    Trạng thái
                  </th>
                </tr>
              </thead>
              <tbody>
                {desktopRows.map((row) => {
                  const status = getStatus(row);
                  return (
                    <tr key={row.employeeId} className="border-t border-line">
                      <td className="px-3.5 py-2 text-body-sm font-medium text-ink">
                        {row.employeeName}
                      </td>
                      <td className="px-2 py-2 text-right font-mono text-[11px] text-ink-muted">
                        {row.unpaidCount + row.advancedCount}
                      </td>
                      <td className="px-2 py-2 text-right font-mono text-[11px] text-ink">
                        {formatCurrency(row.totalUnpaid + row.totalAdvanced)}
                      </td>
                      <td className="px-2 py-2 text-right font-mono text-[11px] text-info">
                        {formatCurrency(row.totalAdvanced)}
                      </td>
                      <td className="px-2 py-2 text-right font-mono text-[11px] text-warning">
                        {formatCurrency(row.totalUnpaid)}
                      </td>
                      <td className="px-3.5 py-2">
                        <Tag variant={status.variant}>{status.label}</Tag>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="divide-y divide-line md:hidden">
            {mobileRows.map((row) => {
              const status = getStatus(row);
              return (
                <div key={row.employeeId} className="px-3.5 py-2.5">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-body-sm font-medium text-ink">{row.employeeName}</p>
                    <Tag variant={status.variant}>{status.label}</Tag>
                  </div>
                  <div className="mt-1 flex items-center justify-between gap-3">
                    <span className="font-mono text-mono-label text-ink-muted">
                      {row.unpaidCount + row.advancedCount} ca
                    </span>
                    <span className="font-mono text-[11px] text-ink">
                      còn lại {formatCurrency(row.totalUnpaid)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </section>
  );
};

export default PayrollSummaryPanel;
