import React, { useMemo } from 'react';
import { Modal } from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { Event, Shift, UserSettings, Location } from '@/types/index';
import { formatDate, formatCurrency } from '@/utils/format';
import { shiftBreakdown } from '@/utils/payrollMath';
import {
  Calendar,
  Clock,
  MapPin,
  Pencil,
  StickyNote,
  ThumbsDown,
  ThumbsUp,
  Trash2,
} from 'lucide-react';

interface EventDetailModalProps {
  event: Event | null;
  shifts: Shift[];
  locations: Location[];
  isOpen: boolean;
  onClose: () => void;
  onEdit: (event: Event) => void;
  onDelete: (eventId: string) => void;
  settings: UserSettings;
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
    return shifts.filter((s) => s.eventId === event.id);
  }, [event, shifts]);

  const locationInfo = useMemo(() => {
    if (!event) return null;
    return locations.find((l) => l.id === event.locationId);
  }, [event, locations]);

  if (!event) return null;

  return (
    <Modal
      title={event.title || 'Chi tiết sự kiện'}
      isOpen={isOpen}
      onClose={onClose}
      footer={
        <div className="flex gap-2">
          <Button
            variant="secondary"
            onClick={() => {
              onEdit(event);
              onClose();
            }}
            className="flex-1 hover:text-info"
          >
            <Pencil size={14} />
            Sửa
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              onDelete(event.id);
              onClose();
            }}
            className="flex-1"
          >
            <Trash2 size={14} />
            Xóa
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        {/* 1. Thời gian & Địa điểm */}
        <div className={`p-3 rounded-md border border-line bg-surface-2 space-y-3`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar size={15} className="text-accent-ink" />
              <span className={`text-sm font-medium text-ink`}>{formatDate(event.date)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={15} className="text-accent-ink" />
              <span className={`text-sm font-medium text-ink`}>{event.time || '--:--'}</span>
            </div>
          </div>

          {locationInfo && (
            <div className={`flex items-start gap-2 pt-2 border-t border-dashed border-line`}>
              <MapPin size={15} className="text-accent-ink mt-0.5 flex-shrink-0" />
              <span className={`text-sm font-medium text-ink-soft leading-tight`}>
                {locationInfo.name}
              </span>
            </div>
          )}
        </div>

        {/* 2. Tài chính */}
        <div
          className={`p-3.5 bg-surface-2 border border-line rounded-sm flex items-center justify-between`}
        >
          <div>
            <p className={`text-label text-ink-muted font-semibold mb-1`}>Tổng tiền sự kiện</p>
            <p className={`text-2xl font-black text-accent-ink`}>
              {formatCurrency(eventShifts.reduce((sum, shift) => sum + shift.amount, 0))}
            </p>
          </div>
          <div className="text-right space-y-1">
            <div className="flex items-center justify-end gap-1.5">
              <span className={`text-label text-ink-muted`}>Lương:</span>
              <span className={`text-xs font-semibold text-ink`}>
                {formatCurrency(
                  eventShifts.reduce((sum, shift) => sum + shiftBreakdown(shift, event).base, 0)
                )}
              </span>
            </div>
            {(event.surcharge ?? 0) > 0 && (
              <div className="flex items-center justify-end gap-1.5 text-info">
                <span className="text-label font-medium">Phụ phí:</span>
                <span className="text-xs font-semibold">
                  +
                  {formatCurrency(
                    eventShifts.reduce(
                      (sum, shift) => sum + shiftBreakdown(shift, event).surcharge,
                      0
                    )
                  )}
                </span>
              </div>
            )}
            {event.surchargeDistribution && (event.surcharge ?? 0) > 0 && (
              <p className={`text-label text-ink-muted italic`}>
                (
                {event.surchargeDistribution.type === 'equal'
                  ? 'Chia đều'
                  : `Chia cho ${event.surchargeDistribution.selectedEmployeeIds?.length || 0} người`}
                )
              </p>
            )}
          </div>
        </div>

        {/* 3. Đánh giá & Ghi chú */}
        {(locationInfo?.review || event.note) && (
          <div className="space-y-3">
            {locationInfo?.review && (
              <div
                className={`p-4 rounded-md border ${locationInfo.review === 'high' ? 'border-success/20 bg-success/5' : 'border-danger/20 bg-danger/5'}`}
              >
                <div className="flex items-center gap-2 mb-2.5">
                  {locationInfo.review === 'high' ? (
                    <div className="flex items-center gap-2 text-success font-semibold text-sm">
                      <ThumbsUp size={16} fill="currentColor" />
                      <span>Đánh giá địa điểm: Tốt</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-danger font-semibold text-sm">
                      <ThumbsDown size={16} fill="currentColor" />
                      <span>Đánh giá địa điểm: Kém</span>
                    </div>
                  )}
                </div>
                {locationInfo.reviewNote && (
                  <div
                    className={`text-xs italic leading-relaxed font-medium ${locationInfo.review === 'high' ? 'text-success' : 'text-danger'}`}
                  >
                    "{locationInfo.reviewNote}"
                  </div>
                )}
              </div>
            )}

            {event.note && (
              <div className={`p-3 rounded-md border border-line bg-surface-2`}>
                <p
                  className={`text-label text-ink-muted font-semibold mb-1.5 flex items-center gap-1.5`}
                >
                  <StickyNote size={12} />
                  Ghi chú sự kiện
                </p>
                <p className={`text-sm text-ink-soft leading-relaxed`}>{event.note}</p>
              </div>
            )}
          </div>
        )}

        {/* 4. Danh sách nhân sự */}
        {eventShifts.length > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between items-center px-1">
              <p className={`text-label text-ink-muted font-semibold`}>
                Nhân viên ({eventShifts.length})
              </p>
            </div>
            <div
              className={`grid grid-cols-2 gap-2 max-h-[180px] overflow-y-auto pr-1 custom-scrollbar`}
            >
              {eventShifts.map((shift) => (
                <div
                  key={shift.id}
                  className={`flex flex-col gap-0.5 p-2 bg-surface-2 border-line border rounded-sm`}
                >
                  <span className={`text-xs font-semibold text-ink truncate`}>
                    {shift.employeeName}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`w-1.5 h-1.5 rounded-xs ${shift.session === 'morning' ? 'bg-warning' : 'bg-accent'}`}
                    ></span>
                    <span className={`text-label font-medium text-ink-muted`}>
                      {shift.session === 'morning' ? 'Sáng' : 'Chiều'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
