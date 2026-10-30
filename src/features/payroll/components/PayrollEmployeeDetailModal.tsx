import React, { memo } from 'react';
import { Modal } from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { Banknote, Calculator, Calendar, CheckCircle, MapPin } from 'lucide-react';
import { formatCurrency, formatDate } from '@/utils/format';
import { PayrollSummary, Shift, Event, Location } from '@/types/index';

interface EmployeeDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedEmployeeSummary: PayrollSummary | null | undefined;
  selectedUnpaidShifts: Shift[];
  selectedAdvancedShifts: Shift[];
  onPayment: () => void;
  onSettlement: () => void;
  events: Event[];
  locations: Location[];
}

const PayrollEmployeeDetailModal: React.FC<EmployeeDetailModalProps> = ({
  isOpen,
  onClose,
  selectedEmployeeSummary,
  selectedUnpaidShifts,
  selectedAdvancedShifts,
  onPayment,
  onSettlement,
  events,
  locations,
}) => {
  return (
    <Modal
      title={selectedEmployeeSummary?.employeeName || 'Chi tiết'}
      isOpen={isOpen}
      onClose={onClose}
      footer={
        <div className="flex gap-2 w-full">
          {selectedEmployeeSummary && selectedEmployeeSummary.totalUnpaid > 0 && (
            <Button
              onClick={onPayment}
              className="flex-1"
              variant={selectedEmployeeSummary.advancedCount > 0 ? 'warning' : 'primary'}
            >
              <Banknote size={16} />
              Thanh toán / Ứng
            </Button>
          )}
          {selectedEmployeeSummary && selectedEmployeeSummary.advancedCount > 0 && (
            <Button onClick={onSettlement} className="flex-1">
              <Calculator size={16} className="text-on-accent" />
              Quyết toán
            </Button>
          )}
        </div>
      }
    >
      <div className="space-y-4">
        {/* Tổng quan */}
        {selectedEmployeeSummary && (
          <div className={`p-4 bg-surface border border-line rounded-md`}>
            <div className="space-y-3">
              <div>
                <span className="text-ink-muted">Tổng tiền đã làm:</span>
                <p className={`text-data font-semibold text-ink tabular-nums`}>
                  {formatCurrency(
                    selectedEmployeeSummary.totalUnpaid + selectedEmployeeSummary.totalAdvanced
                  )}
                </p>
              </div>

              <div className="space-y-1 text-body-sm border-t border-dashed border-line pt-2 tabular-nums">
                <div className="flex justify-between">
                  <span className="text-ink-muted">Đã nhận (ứng):</span>
                  <span className="text-info font-medium">
                    {formatCurrency(selectedEmployeeSummary.totalAdvanced)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-muted">Còn lại cần trả:</span>
                  <span className="text-warning font-semibold">
                    {formatCurrency(selectedEmployeeSummary.totalUnpaid)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Thông tin tạm ứng */}
        {selectedUnpaidShifts.length === 0 ? (
          selectedAdvancedShifts.length > 0 ? (
            <>
              <div className="flex justify-between items-center mb-2">
                <p className={`text-label font-medium text-ink-muted`}>Ca đã ứng tiền</p>
              </div>
              {selectedAdvancedShifts.map((s) => {
                const event = events.find((e) => e.id === s.eventId);
                return (
                  <div
                    key={s.id}
                    className={`flex justify-between items-center gap-3 p-3 border rounded-md border-line bg-surface-2`}
                  >
                    <div className="flex items-center gap-3">
                      <Calendar size={16} className="text-info" />
                      <div>
                        <p className={`text-body-sm font-medium text-ink-soft`}>
                          {event?.title || 'Không rõ sự kiện'}
                        </p>
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-label font-medium ${s.session === 'morning' ? 'text-warning' : 'text-accent-ink'}`}
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
                            <MapPin size={12} />
                            {locations.find((l) => l.id === event.locationId)?.name ||
                              'Không rõ địa điểm'}
                          </p>
                        )}
                      </div>
                    </div>
                    <p className={`text-body-sm font-medium text-info tabular-nums`}>
                      {formatCurrency(s.amount)}
                    </p>
                  </div>
                );
              })}
            </>
          ) : (
            <div className={`py-8 flex flex-col items-center justify-center text-ink-muted gap-2`}>
              <CheckCircle size={32} className="text-success" />
              <p className="text-body-sm">Không còn ca chưa thanh toán</p>
            </div>
          )
        ) : (
          <>
            <div className="flex justify-between items-center mb-2">
              <p className={`text-label font-medium text-ink-muted`}>Công chưa trả</p>
            </div>
            {selectedUnpaidShifts.map((s) => {
              const event = events.find((e) => e.id === s.eventId);
              return (
                <div
                  key={s.id}
                  className={`flex justify-between items-center gap-3 p-3 border rounded-md border-line bg-surface-2`}
                >
                  <div className="flex items-center gap-3">
                    <Calendar size={16} className="text-ink-muted" />
                    <div>
                      <p className={`text-body-sm font-medium text-ink-soft`}>
                        {event?.title || 'Không rõ sự kiện'}
                      </p>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-label font-medium ${s.session === 'morning' ? 'text-warning' : 'text-accent-ink'}`}
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
                          <MapPin size={12} />
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
            })}
          </>
        )}
      </div>
    </Modal>
  );
};

export default memo(PayrollEmployeeDetailModal);
