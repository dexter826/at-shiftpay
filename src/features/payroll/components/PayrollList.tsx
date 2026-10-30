import React, { memo, useState } from 'react';
import { ChevronRight, Wallet } from 'lucide-react';
import Button from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoadMore } from '@/components/ui/LoadMore';
import { Skeleton } from '@/components/ui/Skeleton';
import { Tag } from '@/components/ui/Tag';
import { formatCurrency } from '@/utils/format';
import { Employee, PayrollSummary } from '@/types/index';
import { cn, focusRingOnSurfaceClasses } from '@/lib/utils';
import { getInitials } from '@/utils/initials';

interface PayrollListProps {
  loading: boolean;
  items: PayrollSummary[];
  employees: Employee[];
  visibleCount: number;
  onLoadMore: () => void;
  onSelectEmployee: (employeeId: string) => void;
  searchTerm: string;
  onClearSearch: () => void;
}

const GRID_CLASSES = 'lg:grid-cols-[minmax(0,1fr)_170px_170px_40px]';

const Avatar: React.FC<{ name: string; imageUrl?: string }> = ({ name, imageUrl }) => {
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  const showPhoto = Boolean(imageUrl) && failedUrl !== imageUrl;

  return showPhoto ? (
    <img
      src={imageUrl}
      alt={name}
      onError={() => setFailedUrl(imageUrl ?? null)}
      className="h-10 w-10 shrink-0 rounded-full border border-line object-cover"
    />
  ) : (
    <span
      aria-hidden="true"
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line bg-surface-2 text-label font-semibold text-ink-soft"
    >
      {getInitials(name, 'NV')}
    </span>
  );
};

const AmountCell: React.FC<{
  label: string;
  amount: number;
  count: number;
  tone: 'warning' | 'info';
}> = ({ label, amount, count, tone }) => (
  <div className="flex items-center justify-between gap-2 lg:block">
    <span className="font-mono text-label text-ink-muted lg:hidden">{label}</span>
    <div className="text-right lg:text-left">
      <p
        className={cn(
          'font-mono text-body-sm tabular-nums',
          amount > 0 ? (tone === 'warning' ? 'text-warning' : 'text-info') : 'text-ink-muted'
        )}
      >
        {amount > 0 ? formatCurrency(amount) : '—'}
      </p>
      <p className="text-label text-ink-muted">{count > 0 ? `${count} ca` : 'Không có'}</p>
    </div>
  </div>
);

const PayrollList: React.FC<PayrollListProps> = ({
  loading,
  items,
  employees,
  visibleCount,
  onLoadMore,
  onSelectEmployee,
  searchTerm,
  onClearSearch,
}) => {
  const hasMore = items.length > visibleCount;
  const hasSearch = searchTerm.trim().length > 0;

  return (
    <section className="border border-line bg-surface">
      <div
        className={`hidden gap-3 border-b border-line bg-surface-2 px-4 py-2 lg:grid ${GRID_CLASSES}`}
      >
        <span className="font-mono text-mono-label text-ink-muted">Nhân viên</span>
        <span className="font-mono text-mono-label text-ink-muted">Chưa trả</span>
        <span className="font-mono text-mono-label text-ink-muted">Đã ứng</span>
        <span className="sr-only">Chi tiết</span>
      </div>

      {loading ? (
        <div aria-busy="true" aria-label="Đang tải công nợ">
          {Array.from({ length: 6 }, (_, index) => (
            <div
              key={index}
              className={`grid gap-2 border-b border-line px-4 py-3 last:border-b-0 ${GRID_CLASSES}`}
            >
              <div className="flex items-center gap-3">
                <Skeleton variant="circular" width={40} height={40} />
                <div className="space-y-1.5">
                  <Skeleton width={120} height={14} />
                  <Skeleton width={80} height={11} />
                </div>
              </div>
              <div className="hidden lg:block">
                <Skeleton width={100} height={14} />
                <Skeleton width={40} height={10} className="mt-1" />
              </div>
              <div className="hidden lg:block">
                <Skeleton width={100} height={14} />
                <Skeleton width={40} height={10} className="mt-1" />
              </div>
              <div className="hidden lg:block">
                <Skeleton width={16} height={16} />
              </div>
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        hasSearch ? (
          <EmptyState
            icon={<Wallet size={24} aria-hidden="true" />}
            title="Không tìm thấy nhân viên"
            description="Thử tên hoặc số điện thoại khác."
            className="min-h-[280px]"
            action={
              <Button variant="outline" onClick={onClearSearch}>
                Xóa tìm kiếm
              </Button>
            }
          />
        ) : (
          <EmptyState
            icon={<Wallet size={24} aria-hidden="true" />}
            title="Không có công nợ"
            description="Các ca đã trả sẽ nằm trong lịch sử."
            className="min-h-[280px]"
          />
        )
      ) : (
        <>
          {items.slice(0, visibleCount).map((item) => {
            const employee = employees.find((entry) => entry.id === item.employeeId);

            return (
              <button
                key={item.employeeId}
                type="button"
                onClick={() => onSelectEmployee(item.employeeId)}
                className={cn(
                  'grid w-full grid-cols-[minmax(0,1fr)_auto] items-start gap-x-3 gap-y-2 border-b border-line px-4 py-3 text-left last:border-b-0 hover:bg-surface-2/60 lg:grid-cols-[minmax(0,1fr)_170px_170px_40px] lg:items-center lg:gap-3',
                  focusRingOnSurfaceClasses
                )}
              >
                <div className="flex min-w-0 items-center gap-3">
                  <Avatar name={item.employeeName} imageUrl={employee?.imageUrl} />
                  <div className="min-w-0">
                    <span className="block max-w-full truncate text-body-sm font-semibold text-ink">
                      {item.employeeName}
                    </span>
                    <div className="flex flex-wrap items-center gap-1.5">
                      {employee?.phone && (
                        <span className="font-mono text-label text-ink-muted">
                          {employee.phone}
                        </span>
                      )}
                      {!employee?.bankAccount && <Tag variant="warning">Chưa có TK</Tag>}
                    </div>
                  </div>
                </div>

                <div className="col-span-2 lg:col-span-1">
                  <AmountCell
                    label="Chưa trả"
                    amount={item.totalUnpaid}
                    count={item.unpaidCount}
                    tone="warning"
                  />
                </div>

                <div className="col-span-2 lg:col-span-1">
                  <AmountCell
                    label="Đã ứng"
                    amount={item.totalAdvanced}
                    count={item.advancedCount}
                    tone="info"
                  />
                </div>

                <div className="hidden justify-end lg:flex">
                  <ChevronRight size={16} aria-hidden="true" className="text-ink-muted" />
                </div>
              </button>
            );
          })}
          {hasMore && (
            <div className="border-t border-line p-3">
              <LoadMore
                currentCount={visibleCount}
                totalCount={items.length}
                onLoadMore={onLoadMore}
                unit="nhân viên"
              />
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default memo(PayrollList);
