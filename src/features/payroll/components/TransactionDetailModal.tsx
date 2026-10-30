import React, { memo } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Calendar, MapPin } from 'lucide-react';
import { formatCurrency, formatDate } from '@/utils/format';
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
  return (
    <Modal title="Chi tiết thanh toán" isOpen={isOpen} onClose={onClose} footer={null}>
      <div className="space-y-3">
        {/* Thông tin chung */}
        <div className={`p-4 bg-surface border border-line rounded-md`}>
          <div className="flex justify-between items-start mb-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-label text-ink-muted`}>Loại giao dịch</span>
                {selectedTransaction?.type === 'advance' && (
                  <span className="flex items-center gap-1.5 px-1.5 py-0.5 rounded-xs bg-surface-2 text-label font-medium text-ink-soft">
                    <span className="w-1.5 h-1.5 rounded-xs bg-info" />
                    Ứng tiền
                  </span>
                )}
                {selectedTransaction?.type === 'settlement' && (
                  <span className="flex items-center gap-1.5 px-1.5 py-0.5 rounded-xs bg-surface-2 text-label font-medium text-ink-soft">
                    <span className="w-1.5 h-1.5 rounded-xs bg-accent-ink" />
                    Quyết toán
                  </span>
                )}
                {(!selectedTransaction?.type || selectedTransaction?.type === 'regular') && (
                  <span className="flex items-center gap-1.5 px-1.5 py-0.5 rounded-xs bg-surface-2 text-label font-medium text-ink-soft">
                    <span className="w-1.5 h-1.5 rounded-xs bg-success" />
                    Thanh toán thường
                  </span>
                )}
              </div>
              <span className={`text-data font-semibold text-ink tabular-nums`}>
                {formatCurrency(selectedTransaction?.amount || 0)}
              </span>
            </div>
            <div className="text-right">
              <span className={`text-label text-ink-muted`}>Thời gian</span>
              <p className={`text-body-sm font-medium text-ink-soft tabular-nums`}>
                {selectedTransaction
                  ? new Date(selectedTransaction.date).toLocaleString('vi-VN')
                  : ''}
              </p>
            </div>
          </div>

          {selectedTransaction?.note && (
            <div className={`pt-2 border-t border-line`}>
              <span className={`text-label text-ink-muted`}>Ghi chú:</span>
              <p className={`text-body-sm text-ink-soft`}>{selectedTransaction.note}</p>
            </div>
          )}
        </div>

        <p className={`text-label font-medium text-ink-muted pt-2`}>Các ca làm việc</p>
        {transactionShifts.length === 0 ? (
          <div className={`py-4 text-center text-ink-muted`}>
            <p className="text-body-sm">Không tìm thấy thông tin ca làm việc (Có thể đã bị xóa)</p>
          </div>
        ) : (
          transactionShifts.map((s) => {
            const event = events.find((e) => e.id === s.eventId);
            return (
              <div
                key={s.id}
                className={`flex justify-between items-center gap-3 p-3 border border-line rounded-md bg-surface-2`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Calendar size={16} className="text-ink-muted shrink-0" />
                  <div className="min-w-0">
                    <p className={`text-body-sm font-medium text-ink-soft truncate`}>
                      {event?.title || 'Không rõ sự kiện'}
                    </p>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-label font-medium ${
                          s.session === 'morning' ? 'text-warning' : 'text-accent-ink'
                        }`}
                      >
                        {s.session === 'morning' ? 'Tiệc Sáng' : 'Tiệc Chiều'}
                      </span>
                      <span className={`text-label text-ink-muted`}>•</span>
                      <span className={`text-label text-ink-muted tabular-nums`}>
                        {formatDate(s.date)}
                      </span>
                    </div>
                    {event?.locationId && (
                      <p className={`text-label text-ink-muted mt-0.5 flex items-center gap-1`}>
                        <MapPin size={12} className="shrink-0" />
                        {locations.find((l) => l.id === event.locationId)?.name ||
                          'Không rõ địa điểm'}
                      </p>
                    )}
                  </div>
                </div>
                <p className={`text-body-sm font-semibold text-ink tabular-nums`}>
                  {formatCurrency(s.amount)}
                </p>
              </div>
            );
          })
        )}
      </div>
    </Modal>
  );
};

export default memo(TransactionDetailModal);
