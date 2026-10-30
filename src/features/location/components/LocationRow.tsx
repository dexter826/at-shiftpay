import React, { memo } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { Tag } from '@/components/ui/Tag';
import { Location } from '@/types/index';
import { cn, focusRingOnSurfaceClasses } from '@/lib/utils';

interface LocationRowProps {
  location: Location;
  eventCount: number;
  onEdit: (location: Location) => void;
  onDelete: (locationId: string) => void;
  onViewDetail: (location: Location) => void;
}

const reviewTag = (review: Location['review']) => {
  if (review === 'high') return <Tag variant="success">Tốt</Tag>;
  if (review === 'low') return <Tag variant="danger">Kém</Tag>;
  return <Tag>Thường</Tag>;
};

const LocationRow: React.FC<LocationRowProps> = ({
  location,
  eventCount,
  onEdit,
  onDelete,
  onViewDetail,
}) => (
  <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-x-3 gap-y-1.5 border-b border-line px-4 py-3 last:border-b-0 hover:bg-surface-2/60 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1.2fr)_120px_96px_96px] lg:items-center lg:gap-3">
    <div className="min-w-0">
      <button
        type="button"
        onClick={() => onViewDetail(location)}
        className={cn(
          'flex min-h-11 w-full items-center rounded-sm text-left text-body-sm font-semibold text-ink transition-colors duration-fast ease-standard hover:text-accent-ink',
          focusRingOnSurfaceClasses
        )}
      >
        <span className="line-clamp-1">{location.name}</span>
      </button>
      {location.reviewNote && (
        <p className="line-clamp-1 text-label text-ink-muted">{location.reviewNote}</p>
      )}
    </div>

    <div className="flex items-center gap-1 lg:hidden">
      <button
        type="button"
        onClick={() => onEdit(location)}
        aria-label={`Sửa địa điểm ${location.name}`}
        className={cn(
          'flex h-11 w-11 items-center justify-center rounded-sm text-ink-muted transition-colors duration-fast ease-standard hover:bg-surface-2 hover:text-ink',
          focusRingOnSurfaceClasses
        )}
      >
        <Pencil size={15} aria-hidden="true" />
      </button>
      <button
        type="button"
        onClick={() => onDelete(location.id)}
        aria-label={`Xóa địa điểm ${location.name}`}
        className={cn(
          'flex h-11 w-11 items-center justify-center rounded-sm text-ink-muted transition-colors duration-fast ease-standard hover:bg-danger/10 hover:text-danger',
          focusRingOnSurfaceClasses
        )}
      >
        <Trash2 size={15} aria-hidden="true" />
      </button>
    </div>

    <p className="col-span-2 min-w-0 line-clamp-1 text-body-sm text-ink-soft lg:col-span-1">
      {location.address?.trim() || 'Chưa có địa chỉ'}
    </p>

    <div className="col-span-2 flex items-center gap-2 lg:col-span-1">
      {reviewTag(location.review)}
      <span className="font-mono text-label text-ink-muted lg:hidden">{eventCount} sự kiện</span>
    </div>

    <span className="hidden font-mono text-label text-ink-muted lg:block">
      {eventCount} sự kiện
    </span>

    <div className="hidden items-center justify-end gap-0.5 lg:flex">
      <button
        type="button"
        onClick={() => onEdit(location)}
        aria-label={`Sửa địa điểm ${location.name}`}
        className={cn(
          'flex h-11 w-11 items-center justify-center rounded-sm text-ink-muted transition-colors duration-fast ease-standard hover:bg-surface-2 hover:text-ink',
          focusRingOnSurfaceClasses
        )}
      >
        <Pencil size={15} aria-hidden="true" />
      </button>
      <button
        type="button"
        onClick={() => onDelete(location.id)}
        aria-label={`Xóa địa điểm ${location.name}`}
        className={cn(
          'flex h-11 w-11 items-center justify-center rounded-sm text-ink-muted transition-colors duration-fast ease-standard hover:bg-danger/10 hover:text-danger',
          focusRingOnSurfaceClasses
        )}
      >
        <Trash2 size={15} aria-hidden="true" />
      </button>
    </div>
  </div>
);

export default memo(LocationRow);
