import React, { useMemo, useState } from 'react';
import { Calendar, ExternalLink, MapPin, Pencil } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Tag } from '@/components/ui/Tag';
import { Location, Event } from '@/types/index';
import { formatCurrency, formatDate } from '@/utils/format';

const LOCATIONIQ_API_KEY = import.meta.env.VITE_LOCATIONIQ_API_KEY || 'free_key_placeholder';

interface LocationDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  location: Location | null;
  events: Event[];
  onEditClick: (location: Location) => void;
}

const reviewTag = (review: Location['review']) => {
  if (review === 'high') return <Tag variant="success">Tốt</Tag>;
  if (review === 'low') return <Tag variant="danger">Kém</Tag>;
  return <Tag>Thường</Tag>;
};

const LocationDetailModal: React.FC<LocationDetailModalProps> = ({
  isOpen,
  onClose,
  location,
  events,
  onEditClick,
}) => {
  const [failedMapId, setFailedMapId] = useState<string | null>(null);

  const locationEvents = useMemo(() => {
    if (!location) return [];
    return events
      .filter((event) => event.locationId === location.id)
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [events, location]);

  if (!location) return null;

  const hasCoords = location.latitude != null && location.longitude != null;
  const mapUrl = hasCoords
    ? `https://maps.locationiq.com/v3/staticmap?key=${LOCATIONIQ_API_KEY}&center=${location.latitude},${location.longitude}&zoom=17&size=600x400&markers=icon:large-blue-cutout|${location.latitude},${location.longitude}`
    : null;
  const mapFailed = failedMapId === location.id;
  const hasMapLink = hasCoords || Boolean(location.address?.trim());

  const handleOpenInGoogleMaps = () => {
    if (location.latitude != null && location.longitude != null) {
      window.open(
        `https://www.google.com/maps/search/?api=1&query=${location.latitude},${location.longitude}`,
        '_blank',
        'noopener,noreferrer'
      );
      return;
    }

    if (location.address?.trim()) {
      window.open(
        `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location.address.trim())}`,
        '_blank',
        'noopener,noreferrer'
      );
    }
  };

  return (
    <Modal
      title={location.name}
      isOpen={isOpen}
      onClose={onClose}
      footer={
        <Button
          onClick={() => {
            onClose();
            onEditClick(location);
          }}
          fullWidth
          icon={<Pencil size={16} />}
        >
          Sửa địa điểm
        </Button>
      }
    >
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="font-mono text-mono-label text-ink-muted">Đánh giá</span>
          {reviewTag(location.review)}
        </div>

        <div className="aspect-[16/9] overflow-hidden border border-line bg-surface-2">
          {mapUrl && !mapFailed ? (
            <img
              src={mapUrl}
              alt={`Bản đồ ${location.name}`}
              loading="lazy"
              onError={() => setFailedMapId(location.id)}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-1.5 px-6 text-center">
              <MapPin size={22} aria-hidden="true" className="text-ink-muted" />
              <p className="text-body-sm text-ink-soft">
                {mapFailed ? 'Không tải được bản đồ.' : 'Chưa có tọa độ để hiển thị bản đồ.'}
              </p>
            </div>
          )}
        </div>

        <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
          <p className="text-label text-ink-muted">
            {hasMapLink ? 'Mở vị trí bằng địa chỉ hoặc tọa độ.' : 'Cần địa chỉ hoặc tọa độ.'}
          </p>
          <Button
            variant="outline"
            onClick={handleOpenInGoogleMaps}
            disabled={!hasMapLink}
            icon={<ExternalLink size={14} />}
          >
            Mở Google Maps
          </Button>
        </div>

        <div className="flex items-start gap-2 border border-line bg-surface-2 px-3 py-2.5">
          <MapPin size={15} aria-hidden="true" className="mt-0.5 shrink-0 text-ink-muted" />
          <p className="text-body-sm leading-relaxed text-ink-soft">
            {location.address?.trim() || 'Chưa có địa chỉ'}
          </p>
        </div>

        {location.reviewNote && (
          <div className="space-y-1.5 border-t border-line pt-3">
            <p className="font-mono text-mono-label text-ink-muted">Ghi chú đánh giá</p>
            <p className="text-body-sm italic leading-relaxed text-ink-soft">
              “{location.reviewNote}”
            </p>
          </div>
        )}

        <div className="space-y-2 border-t border-line pt-3">
          <div className="flex items-center justify-between gap-2">
            <p className="font-mono text-mono-label text-ink-muted">Lịch sử sự kiện</p>
            <span className="font-mono text-mono-label text-ink-muted">
              {locationEvents.length}
            </span>
          </div>

          {locationEvents.length === 0 ? (
            <EmptyState
              icon={<Calendar size={24} aria-hidden="true" />}
              title="Chưa có sự kiện tại địa điểm này"
              description="Sự kiện gắn địa điểm sẽ hiện ở đây."
              className="py-8"
            />
          ) : (
            <div className="divide-y divide-line border border-line">
              {locationEvents.map((event) => (
                <div key={event.id} className="flex items-start justify-between gap-3 px-3 py-2.5">
                  <div className="min-w-0">
                    <p className="truncate text-body-sm font-medium text-ink">
                      {event.title || 'Tiệc'}
                    </p>
                    <p className="font-mono text-label text-ink-muted">{formatDate(event.date)}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="font-mono text-label text-ink-muted">Lương/người</p>
                    <p className="font-mono text-label text-ink">
                      {event.amount != null ? formatCurrency(event.amount) : 'Chưa có lương'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default LocationDetailModal;
