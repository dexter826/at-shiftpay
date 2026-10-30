import React, { memo } from 'react';
import { MapPin } from 'lucide-react';
import Button from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoadMore } from '@/components/ui/LoadMore';
import { Skeleton } from '@/components/ui/Skeleton';
import LocationRow from '@/features/location/components/LocationRow';
import { Location } from '@/types/index';

interface LocationListProps {
  loading: boolean;
  locations: Location[];
  totalLocations: number;
  hasActiveFilters: boolean;
  visibleCount: number;
  onLoadMore: () => void;
  eventCounts: Record<string, number>;
  onEdit: (location: Location) => void;
  onDelete: (locationId: string) => void;
  onViewDetail: (location: Location) => void;
  onResetFilters: () => void;
}

const GRID_CLASSES = 'lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1.2fr)_120px_96px_96px]';

const LocationList: React.FC<LocationListProps> = ({
  loading,
  locations,
  totalLocations,
  hasActiveFilters,
  visibleCount,
  onLoadMore,
  eventCounts,
  onEdit,
  onDelete,
  onViewDetail,
  onResetFilters,
}) => {
  const hasMore = locations.length > visibleCount;

  return (
    <section className="border border-line bg-surface">
      <div
        className={`hidden gap-3 border-b border-line bg-surface-2 px-4 py-2 lg:grid ${GRID_CLASSES}`}
      >
        <span className="font-mono text-mono-label text-ink-muted">Địa điểm</span>
        <span className="font-mono text-mono-label text-ink-muted">Địa chỉ</span>
        <span className="font-mono text-mono-label text-ink-muted">Đánh giá</span>
        <span className="font-mono text-mono-label text-ink-muted">Sự kiện</span>
        <span className="sr-only">Thao tác</span>
      </div>

      {loading ? (
        <div aria-busy="true" aria-label="Đang tải địa điểm">
          {Array.from({ length: 8 }, (_, index) => (
            <div
              key={index}
              className={`grid gap-2 border-b border-line px-4 py-3 last:border-b-0 ${GRID_CLASSES}`}
            >
              <Skeleton width="70%" height={16} />
              <Skeleton width="80%" height={14} />
              <div className="hidden lg:block">
                <Skeleton width={56} height={22} />
              </div>
              <div className="hidden lg:block">
                <Skeleton width={54} height={14} />
              </div>
              <div className="hidden lg:block">
                <Skeleton width={72} height={16} />
              </div>
            </div>
          ))}
        </div>
      ) : locations.length === 0 ? (
        totalLocations === 0 ? (
          <EmptyState
            icon={<MapPin size={24} aria-hidden="true" />}
            title="Chưa có địa điểm"
            description="Thêm địa điểm để gắn sự kiện và lưu đánh giá."
            className="min-h-[280px]"
          />
        ) : (
          <EmptyState
            icon={<MapPin size={24} aria-hidden="true" />}
            title="Không tìm thấy địa điểm"
            description="Thử từ khóa khác hoặc bỏ bộ lọc."
            className="min-h-[280px]"
            action={
              hasActiveFilters ? (
                <Button variant="outline" onClick={onResetFilters}>
                  Xóa bộ lọc
                </Button>
              ) : undefined
            }
          />
        )
      ) : (
        <>
          {locations.slice(0, visibleCount).map((location) => (
            <LocationRow
              key={location.id}
              location={location}
              eventCount={eventCounts[location.id] || 0}
              onEdit={onEdit}
              onDelete={onDelete}
              onViewDetail={onViewDetail}
            />
          ))}
          {hasMore && (
            <div className="border-t border-line p-3">
              <LoadMore
                currentCount={visibleCount}
                totalCount={locations.length}
                onLoadMore={onLoadMore}
                unit="địa điểm"
              />
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default memo(LocationList);
