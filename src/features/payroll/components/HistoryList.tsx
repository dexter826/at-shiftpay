import React, { memo } from 'react';
import { History } from 'lucide-react';
import Button from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';
import { Tag } from '@/components/ui/Tag';
import { PaymentTransaction } from '@/types/index';
import { formatCurrency } from '@/utils/format';
import { cn, focusRingOnSurfaceClasses } from '@/lib/utils';

interface HistoryListProps {
  loading: boolean;
  items: PaymentTransaction[];
  onSelectTransaction: (id: string) => void;
  onLoadMore: () => void;
  hasSearch: boolean;
  hasDateFilter: boolean;
  onClearSearch: () => void;
}

const GRID_CLASSES = 'lg:grid-cols-[minmax(0,1fr)_120px_180px_140px]';

const typeLabel = (type: PaymentTransaction['type']) => {
  if (type === 'advance') return { label: 'Ứng lương', variant: 'info' as const };
  if (type === 'settlement') return { label: 'Quyết toán', variant: 'highlight' as const };
  return { label: 'Thanh toán', variant: 'neutral' as const };
};

const formatDateTime = (timestamp: number) =>
  new Date(timestamp).toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

const HistoryList: React.FC<HistoryListProps> = ({
  loading,
  items,
  onSelectTransaction,
  onLoadMore,
  hasSearch,
  hasDateFilter,
  onClearSearch,
}) => (
  <section className="border border-line bg-surface">
    <div
      className={`hidden gap-3 border-b border-line bg-surface-2 px-4 py-2 lg:grid ${GRID_CLASSES}`}
    >
      <span className="font-mono text-mono-label text-ink-muted">Nhân viên</span>
      <span className="font-mono text-mono-label text-ink-muted">Loại</span>
      <span className="font-mono text-mono-label text-ink-muted">Thời gian</span>
      <span className="font-mono text-mono-label text-ink-muted">Số tiền</span>
    </div>

    {loading ? (
      <div aria-busy="true" aria-label="Đang tải giao dịch">
        {Array.from({ length: 6 }, (_, index) => (
          <div
            key={index}
            className={`grid gap-2 border-b border-line px-4 py-3 last:border-b-0 ${GRID_CLASSES}`}
          >
            <Skeleton width="50%" height={14} />
            <div className="hidden lg:block">
              <Skeleton width={72} height={22} />
            </div>
            <div className="hidden lg:block">
              <Skeleton width={110} height={12} />
            </div>
            <div className="hidden lg:block">
              <Skeleton width={90} height={14} />
            </div>
          </div>
        ))}
      </div>
    ) : items.length === 0 ? (
      hasSearch ? (
        <EmptyState
          icon={<History size={24} aria-hidden="true" />}
          title="Không tìm thấy giao dịch"
          description="Thử tên nhân viên khác."
          className="min-h-[280px]"
          action={
            <Button variant="outline" onClick={onClearSearch}>
              Xóa tìm kiếm
            </Button>
          }
        />
      ) : hasDateFilter ? (
        <EmptyState
          icon={<History size={24} aria-hidden="true" />}
          title="Chưa có giao dịch trong tháng này"
          description="Chọn tháng khác hoặc bỏ lọc thời gian."
          className="min-h-[280px]"
        />
      ) : (
        <EmptyState
          icon={<History size={24} aria-hidden="true" />}
          title="Chưa có giao dịch trong khoảng này"
          description="Giao dịch mới sẽ hiện ở đây."
          className="min-h-[280px]"
        />
      )
    ) : (
      <>
        {items.map((item) => {
          const type = typeLabel(item.type);

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectTransaction(item.id)}
              className={cn(
                'grid w-full grid-cols-[minmax(0,1fr)_auto] items-start gap-x-3 gap-y-1.5 border-b border-line px-4 py-3 text-left last:border-b-0 hover:bg-surface-2/60 lg:grid-cols-[minmax(0,1fr)_120px_180px_140px] lg:items-center lg:gap-3',
                focusRingOnSurfaceClasses
              )}
            >
              <span className="min-w-0 text-body-sm font-semibold text-ink">
                <span className="line-clamp-1">{item.employeeName}</span>
                {item.note && (
                  <span className="mt-0.5 line-clamp-1 block text-label font-normal text-ink-muted">
                    {item.note}
                  </span>
                )}
              </span>
              <span className="lg:block">
                <Tag variant={type.variant}>{type.label}</Tag>
              </span>
              <span className="col-span-2 font-mono text-label text-ink-muted lg:col-span-1">
                {formatDateTime(item.date)}
              </span>
              <span className="col-start-2 row-start-1 text-right font-mono text-body-sm text-ink tabular-nums lg:col-auto lg:row-auto lg:text-left">
                {formatCurrency(item.amount)}
              </span>
            </button>
          );
        })}
        <div className="flex flex-col items-center gap-2 border-t border-line p-3">
          <p className="font-mono text-label text-ink-muted">
            Đang hiển thị {items.length} giao dịch
          </p>
          <Button variant="outline" onClick={onLoadMore}>
            Tải thêm 12 tháng
          </Button>
        </div>
      </>
    )}
  </section>
);

export default memo(HistoryList);
