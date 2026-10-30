import React, { memo } from 'react';
import { Calendar, ExternalLink, MapPin, MessageSquare, Pencil } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { Location, Event } from '@/types/index';
import { focusRingOnSurfaceClasses } from '@/lib/utils';

const LOCATIONIQ_API_KEY = import.meta.env.VITE_LOCATIONIQ_API_KEY || 'free_key_placeholder';

interface LocationDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  location: Location | null;
  events: Event[];
  onEditClick: (loc: Location) => void;
}

const LocationDetailModal: React.FC<LocationDetailModalProps> = ({
  isOpen,
  onClose,
  location,
  events,
  onEditClick,
}) => {
  if (!location) return null;

  const hasCoords = location.latitude && location.longitude;
  const mapUrl = hasCoords
    ? `https://maps.locationiq.com/v3/staticmap?key=${LOCATIONIQ_API_KEY}&center=${location.latitude},${location.longitude}&zoom=17&size=600x400&markers=icon:large-blue-cutout|${location.latitude},${location.longitude}`
    : `https://maps.locationiq.com/v3/staticmap?key=${LOCATIONIQ_API_KEY}&center=21.02776,105.83416&zoom=12&size=600x400`;

  // Lọc sự kiện của địa điểm này và sắp xếp mới nhất
  const locationEvents = events
    .filter((e) => e.locationId === location.id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleOpenInGoogleMaps = () => {
    const { latitude, longitude, address } = location;
    let url = '';
    if (latitude && longitude) {
      url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    } else if (address && address.trim()) {
      url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address.trim())}`;
    }
    if (url) window.open(url, '_blank');
  };

  const renderReviewBadge = () => {
    if (location.review === 'high') {
      return (
        <div className="flex items-center gap-1.5 px-1.5 py-0.5 rounded-xs bg-surface-2 text-label font-medium text-ink-soft">
          <span className="w-1.5 h-1.5 rounded-xs bg-success" />
          <span>Tốt</span>
        </div>
      );
    }
    if (location.review === 'low') {
      return (
        <div className="flex items-center gap-1.5 px-1.5 py-0.5 rounded-xs bg-surface-2 text-label font-medium text-ink-soft">
          <span className="w-1.5 h-1.5 rounded-xs bg-danger" />
          <span>Kém</span>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-1.5 px-1.5 py-0.5 rounded-xs bg-surface-2 text-label font-medium text-ink-soft">
        <span className="w-1.5 h-1.5 rounded-xs bg-ink-muted" />
        <span>Thường</span>
      </div>
    );
  };

  return (
    <Modal
      title="Chi tiết địa điểm"
      isOpen={isOpen}
      onClose={onClose}
      footer={
        <Button
          variant="primary"
          onClick={() => {
            onClose();
            onEditClick(location);
          }}
          fullWidth
          className="flex justify-center items-center gap-2"
        >
          <Pencil size={18} color="currentColor" />
          Chỉnh sửa địa điểm
        </Button>
      }
    >
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-start gap-4">
            <h3 className={`text-display font-semibold text-ink leading-tight`}>{location.name}</h3>
            {renderReviewBadge()}
          </div>

          <div className="relative aspect-[16/9] rounded-md overflow-hidden border border-line">
            <img src={mapUrl} alt={location.name} className="w-full h-full object-cover" />
            {!hasCoords && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span
                  className={`px-2 py-1 rounded-xs text-label font-medium bg-surface border border-line text-ink-soft`}
                >
                  Chưa có tọa độ chính xác
                </span>
              </div>
            )}
            <button
              type="button"
              onClick={handleOpenInGoogleMaps}
              aria-label="Mở trong Google Maps"
              title="Mở trong Google Maps"
              className={`absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-sm bg-surface border border-line text-ink-soft hover:text-ink hover:bg-surface-2 transition-colors duration-fast ease-standard ${focusRingOnSurfaceClasses}`}
            >
              <ExternalLink size={16} />
            </button>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-md bg-surface-2 border border-line">
            <MapPin size={16} className="text-accent-ink shrink-0 mt-0.5" />
            <span className={`text-body-sm leading-relaxed text-ink-soft`}>
              {location.address || 'Địa chỉ chưa xác định'}
            </span>
          </div>

          {location.reviewNote && (
            <div className="flex items-start gap-3 p-4 rounded-md bg-surface-2 border border-line">
              <MessageSquare size={16} className="text-ink-muted shrink-0 mt-0.5" />
              <p className={`text-body-sm text-ink-soft leading-relaxed italic`}>
                "{location.reviewNote}"
              </p>
            </div>
          )}
        </div>

        {/* History Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 px-1">
            <div className="h-px flex-1 bg-line" />
            <h4 className={`text-label font-medium text-ink-muted`}>Lịch sử công việc</h4>
            <div className="h-px flex-1 bg-line" />
          </div>

          <div className="space-y-2 max-h-75 overflow-y-auto pr-1">
            {locationEvents.length > 0 ? (
              locationEvents.map((event) => {
                const eventDate = new Date(event.date).toLocaleDateString('vi-VN', {
                  weekday: 'short',
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                });
                return (
                  <div
                    key={event.id}
                    className={`flex items-center justify-between gap-3 p-3 rounded-md border border-line bg-surface-2`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xs bg-surface border border-line text-ink-muted">
                        <Calendar size={16} />
                      </div>
                      <div className="min-w-0">
                        <div className={`text-body-sm font-semibold text-ink truncate`}>
                          {event.title}
                        </div>
                        <div className={`text-label text-ink-soft tabular-nums`}>{eventDate}</div>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className={`text-body-sm font-semibold text-ink tabular-nums`}>
                        {event.amount?.toLocaleString('vi-VN')}đ
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-ink-muted">
                <Calendar size={32} className="mx-auto mb-2" />
                <p className="text-body-sm font-medium">Chưa có lịch sử làm việc tại đây</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default memo(LocationDetailModal);
