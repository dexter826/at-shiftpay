import React, { useMemo } from 'react';
import { Calendar, Clock, MapPin, Pencil, StickyNote, Trash2 } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { Tag } from '@/components/ui/Tag';
import { Event, Shift, Location } from '@/types/index';
import { formatDate, formatCurrency } from '@/utils/format';
import { shiftBreakdown } from '@/utils/payrollMath';
import { cn } from '@/lib/utils';

interface EventDetailModalProps {
  event: Event | null;
  shifts: Shift[];
  locations: Location[];
  isOpen: boolean;
  onClose: () => void;
  onEdit: (event: Event) => void;
  onDelete: (eventId: string) => void;
}

export const EventDetailModal: React.FC<EventDetailModalProps> = ({
  event,
  shifts,
  locations,
  isOpen,
  onClose,
  onEdit,
  onDelete,
}) => {
  const eventShifts = useMemo(() => {
    if (!event) return [];
    return shifts.filter((shift) => shift.eventId === event.id);
  }, [event, shifts]);

  const locationInfo = useMemo(() => {
    if (!event) return null;
    return locations.find((location) => location.id === event.locationId) ?? null;
  }, [event, locations]);

  if (!event) return null;

  const total = eventShifts.reduce((sum, shift) => sum + shift.amount, 0);
  const baseTotal = eventShifts.reduce((sum, shift) => sum + shiftBreakdown(shift, event).base, 0);
  const surchargeTotal = eventShifts.reduce(
    (sum, shift) => sum + shiftBreakdown(shift, event).surcharge,
    0
  );

  return (
    <Modal
      title={event.title || 'Chi tiết sự kiện'}
      isOpen={isOpen}
      onClose={onClose}
      footer={
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => {
              onDelete(event.id);
              onClose();
            }}
            className="flex-1 text-danger"
            icon={<Trash2 size={15} />}
          >
            Xóa
          </Button>
          <Button
            onClick={() => {
              onEdit(event);
              onClose();
            }}
            className="flex-1"
            icon={<Pencil size={15} />}
          >
            Sửa
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <div className="space-y-2 border border-line bg-surface-2 p-3">
          <div className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-2 text-body-sm font-medium text-ink">
              <Calendar size={15} aria-hidden="true" className="text-accent-ink" />
              {formatDate(event.date)}
            </span>
            <span className="flex items-center gap-2 font-mono text-label text-ink-soft">
              <Clock size={14} aria-hidden="true" className="text-accent-ink" />
              {event.time || '--:--'}
            </span>
          </div>
          <div className="flex items-start gap-2 border-t border-dashed border-line pt-2">
            <MapPin size={14} aria-hidden="true" className="mt-0.5 shrink-0 text-accent-ink" />
            <span className="text-body-sm text-ink-soft">
              {locationInfo?.name ?? 'Chưa có địa điểm'}
            </span>
          </div>
        </div>

        <div className="flex items-start justify-between gap-3 border border-line p-3">
          <div>
            <p className="font-mono text-mono-label text-ink-muted">Tổng chi</p>
            <p className="mt-1 text-data font-semibold tabular-nums text-ink">
              {formatCurrency(total)}
            </p>
          </div>
          <div className="space-y-1 text-right">
            <div className="flex items-center justify-end gap-1.5 text-label">
              <span className="text-ink-muted">Lương</span>
              <span className="font-semibold text-ink">{formatCurrency(baseTotal)}</span>
            </div>
            {surchargeTotal > 0 && (
              <div className="flex items-center justify-end gap-1.5 text-label">
                <span className="text-ink-muted">Phụ phí</span>
                <span className="font-semibold text-ink">+{formatCurrency(surchargeTotal)}</span>
              </div>
            )}
            {event.surchargeDistribution && surchargeTotal > 0 && (
              <p className="font-mono text-label text-ink-muted">
                {event.surchargeDistribution.type === 'equal'
                  ? 'Chia đều'
                  : `Chia cho ${event.surchargeDistribution.selectedEmployeeIds?.length ?? 0} người`}
              </p>
            )}
          </div>
        </div>

        {locationInfo?.review && (
          <div
            className={cn(
              'space-y-2 border p-3',
              locationInfo.review === 'high'
                ? 'border-success/30 bg-success/10'
                : 'border-danger/30 bg-danger/10'
            )}
          >
            <div className="flex items-center justify-between gap-2">
              <p className="text-label font-semibold text-ink-soft">Đánh giá địa điểm</p>
              <Tag variant={locationInfo.review === 'high' ? 'success' : 'danger'}>
                {locationInfo.review === 'high' ? 'Tốt' : 'Kém'}
              </Tag>
            </div>
            {locationInfo.reviewNote && (
              <p className="text-label italic leading-relaxed text-ink-soft">
                “{locationInfo.reviewNote}”
              </p>
            )}
          </div>
        )}

        {event.note && (
          <div className="space-y-1.5 border-t border-line pt-3">
            <p className="flex items-center gap-1.5 font-mono text-mono-label text-ink-muted">
              <StickyNote size={12} aria-hidden="true" />
              Ghi chú
            </p>
            <p className="text-body-sm leading-relaxed text-ink-soft">{event.note}</p>
          </div>
        )}

        <div className="space-y-2 border-t border-line pt-3">
          <p className="font-mono text-mono-label text-ink-muted">
            Nhân viên ({eventShifts.length})
          </p>
          {eventShifts.length === 0 ? (
            <p className="text-label text-ink-muted">Chưa phân công ca nào.</p>
          ) : (
            (['morning', 'afternoon'] as const).map((session) => {
              const sessionShifts = eventShifts.filter((shift) => shift.session === session);
              if (sessionShifts.length === 0) return null;

              return (
                <div key={session} className="space-y-1.5">
                  <p className="font-mono text-mono-label text-ink-muted">
                    {session === 'morning' ? 'Sáng' : 'Chiều'} · {sessionShifts.length} ca
                  </p>
                  <ul className="divide-y divide-line border border-line">
                    {sessionShifts.map((shift) => (
                      <li key={shift.id} className="px-3 py-2 text-body-sm text-ink">
                        {shift.employeeName}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })
          )}
        </div>
      </div>
    </Modal>
  );
};
