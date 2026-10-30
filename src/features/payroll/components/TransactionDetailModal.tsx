import React, { memo } from 'react';
import { Calendar, MapPin } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Tag } from '@/components/ui/Tag';
import { formatCurrency, formatDate } from '@/utils/format';
import { getPaymentTypeLabel } from '@/features/payroll/paymentType';
import { PaymentTransaction, Shift, Event, Location } from '@/types/index';

interface TransactionDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTransaction: PaymentTransaction | null | undefined;
  transactionShifts: Shift[];
  events: Event[];
  locations: Location[];
}

const TransactionDetailModal: React.FC<TransactionDetailModalProps> = ({
  isOpen,
  onClose,
  selectedTransaction,
  transactionShifts,
  events,
  locations,
}) => {
  if (!selectedTransaction) return null;
  const type = getPaymentTypeLabel(selectedTransaction.type);

  return (
    <Modal title="Giao dịch" isOpen={isOpen} onClose={onClose}>
      <div className="space-y-4">
        <div className="space-y-3 border border-line bg-surface-2 p-3">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-body font-semibold text-ink">
                {selectedTransaction.employeeName}
              </p>
              <Tag variant={type.variant} className="mt-1">
                {type.label}
              </Tag>
            </div>
            <p className="shrink-0 font-mono text-data text-ink tabular-nums">
              {formatCurrency(selectedTransaction.amount)}
            </p>
          </div>
          <div className="flex items-center gap-1.5 border-t border-line pt-2 font-mono text-label text-ink-muted">
            <Calendar size={12} aria-hidden="true" />
            {new Date(selectedTransaction.date).toLocaleString('vi-VN', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </div>
          {selectedTransaction.note && (
            <p className="border-t border-line pt-2 text-body-sm text-ink-soft">
              {selectedTransaction.note}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <p className="font-mono text-mono-label text-ink-muted">
            Ca trong giao dịch ({transactionShifts.length})
          </p>
          {transactionShifts.length === 0 ? (
            <p className="border border-line px-3 py-4 text-body-sm text-ink-muted">
              Không tìm thấy ca của giao dịch (có thể đã bị xóa).
            </p>
          ) : (
            <div className="divide-y divide-line border border-line">
              {transactionShifts.map((shift) => {
                const event = events.find((item) => item.id === shift.eventId);
                const locationName =
                  locations.find((item) => item.id === event?.locationId)?.name ??
                  'Chưa có địa điểm';

                return (
                  <div
                    key={shift.id}
                    className="flex items-start justify-between gap-3 px-3 py-2.5"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-body-sm font-medium text-ink">
                        {event?.title || 'Không rõ sự kiện'}
                      </p>
                      <p className="font-mono text-label text-ink-muted">
                        {shift.session === 'morning' ? 'Ca sáng' : 'Ca chiều'} ·{' '}
                        {formatDate(shift.date)}
                      </p>
                      <p className="mt-0.5 flex items-center gap-1 text-label text-ink-muted">
                        <MapPin size={11} aria-hidden="true" className="shrink-0" />
                        <span className="truncate">{locationName}</span>
                      </p>
                    </div>
                    <p className="shrink-0 font-mono text-body-sm text-ink tabular-nums">
                      {formatCurrency(shift.amount)}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default memo(TransactionDetailModal);
