import React, { memo } from 'react';
import { MapPin, MessageSquare, ExternalLink, Pencil, Trash2 } from 'lucide-react';
import { Location } from '@/types/index';
import { focusRingClasses, focusRingOnSurfaceClasses } from '@/lib/utils';

const LOCATIONIQ_API_KEY = import.meta.env.VITE_LOCATIONIQ_API_KEY || 'free_key_placeholder';

interface LocationCardProps {
  location: Location;
  stats: {
    workCount: number;
  };
  onEdit: (loc: Location) => void;
  onDelete: (id: string) => void;
  onViewDetail: (loc: Location) => void;
  theme: string;
}

const LocationCard: React.FC<LocationCardProps> = ({
  location,
  stats,
  onEdit,
  onDelete,
  onViewDetail,
}) => {
  const hasCoords = location.latitude && location.longitude;
  const mapUrl = hasCoords
    ? `https://maps.locationiq.com/v3/staticmap?key=${LOCATIONIQ_API_KEY}&center=${location.latitude},${location.longitude}&zoom=17&size=600x400&markers=icon:large-blue-cutout|${location.latitude},${location.longitude}`
    : `https://maps.locationiq.com/v3/staticmap?key=${LOCATIONIQ_API_KEY}&center=21.02776,105.83416&zoom=12&size=600x400`;

  const handleOpenInGoogleMaps = () => {
    const { latitude, longitude, address } = location;
    let url = '';

    if (latitude && longitude) {
      url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    } else if (address && address.trim()) {
      url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address.trim())}`;
    }

    if (url) {
      window.open(url, '_blank');
    }
  };

  return (
    <div className="relative flex flex-col rounded-md bg-surface border border-line">
      {/* Phần hình ảnh */}
      <div className="relative h-50 overflow-hidden rounded-t-md">
        <img
          src={mapUrl}
          alt={location.name}
          decoding="async"
          className="w-full h-full object-cover"
        />

        {!hasCoords && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span
              className={`px-2 py-1 rounded-xs text-label font-medium bg-surface border border-line text-ink-soft pointer-events-none`}
            >
              Chưa có địa chỉ chính xác
            </span>
          </div>
        )}
      </div>

      {/* Vùng bấm mở chi tiết */}
      <button
        type="button"
        onClick={() => onViewDetail(location)}
        aria-label={`Xem chi tiết ${location.name}`}
        className={`absolute inset-0 cursor-pointer rounded-md transition-colors duration-fast ease-standard hover:bg-surface-2/70 ${focusRingClasses}`}
      />

      {/* Nút thao tác */}
      <div className="absolute top-2 right-2 flex items-center gap-1.5">
        <button
          type="button"
          onClick={handleOpenInGoogleMaps}
          className={`flex h-10 w-10 items-center justify-center rounded-sm bg-surface border border-line text-ink-muted hover:text-ink hover:bg-surface-2 transition-colors duration-fast ease-standard ${focusRingOnSurfaceClasses}`}
          aria-label={`Mở ${location.name} trong Google Maps`}
          title="Xem trên Google Maps"
        >
          <ExternalLink size={14} />
        </button>
        <button
          type="button"
          onClick={() => onEdit(location)}
          className={`flex h-10 w-10 items-center justify-center rounded-sm bg-surface border border-line text-ink-muted hover:text-ink hover:bg-surface-2 transition-colors duration-fast ease-standard ${focusRingOnSurfaceClasses}`}
          aria-label={`Sửa địa điểm ${location.name}`}
          title="Sửa địa điểm"
        >
          <Pencil size={14} />
        </button>
        <button
          type="button"
          onClick={() => onDelete(location.id)}
          className={`flex h-10 w-10 items-center justify-center rounded-sm bg-surface border border-line text-ink-muted hover:text-danger hover:bg-surface-2 transition-colors duration-fast ease-standard ${focusRingOnSurfaceClasses}`}
          aria-label={`Xóa địa điểm ${location.name}`}
          title="Xóa địa điểm"
        >
          <Trash2 size={14} />
        </button>
      </div>

      {/* Phần thông tin */}
      <div className="relative flex-1 p-5 pointer-events-none">
        <div className="space-y-1.5">
          <h3 className={`text-title font-semibold text-ink leading-tight line-clamp-1`}>
            {location.name}
          </h3>
          <div className="flex items-center gap-1.5">
            <MapPin size={14} className="text-ink-muted shrink-0" />
            <span className={`text-body-sm text-ink-soft line-clamp-1`}>
              {location.address || 'Địa chỉ chưa xác định'}
            </span>
          </div>

          <div className="flex items-start gap-1.5 mt-2">
            <MessageSquare size={14} className="text-ink-muted shrink-0 mt-0.5" />
            <p className={`text-body-sm text-ink-muted italic line-clamp-2`}>
              {location.reviewNote ? `"${location.reviewNote}"` : 'Chưa có ghi chú'}
            </p>
          </div>

          <div className={`flex items-center gap-4 pt-3 mt-auto border-t border-line`}>
            <div className="flex flex-col">
              <span className={`text-label font-medium text-ink-muted`}>Lịch sử</span>
              <span className={`text-body-sm font-semibold text-ink tabular-nums`}>
                {stats.workCount} ca làm
              </span>
            </div>
            <div className="flex flex-col">
              <span className={`text-label font-medium text-ink-muted`}>Đánh giá</span>
              {location.review ? (
                <span
                  className={`text-body-sm font-semibold ${location.review === 'high' ? 'text-success' : 'text-danger'}`}
                >
                  {location.review === 'high' ? 'Tốt' : 'Kém'}
                </span>
              ) : (
                <span className={`text-body-sm font-semibold text-ink-muted`}>Thường</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(LocationCard);
