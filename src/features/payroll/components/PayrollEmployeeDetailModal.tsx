import React, { memo } from 'react';
import { Banknote, Calculator, Calendar, MapPin } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { PayrollSummary, Shift, Event, Location } from '@/types/index';
import { formatCurrency, formatDate } from '@/utils/format';

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

const ShiftGroup: React.FC<{
  title: string;
  shifts: Shift[];
  events: Event[];
  locations: Location[];
  tone: 'warning' | 'info';
}> = ({ title, shifts, events, locations, tone }) => {
  if (shifts.length === 0) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <p className="font-mono text-mono-label text-ink-muted">{title}</p>
        <span className="font-mono text-mono-label text-ink-muted">{shifts.length} ca</span>
      </div>
      <div className="divide-y divide-line border border-line">
        {shifts.map((shift) => {
          const event = events.find((item) => item.id === shift.eventId);
          const locationName =
            locations.find((item) => item.id === event?.locationId)?.name ?? 'Chưa có địa điểm';

          return (
            <div key={shift.id} className="flex items-start justify-between gap-3 px-3 py-2.5">
              <div className="min-w-0">
                <p className="truncate text-body-sm font-medium text-ink">
                  {event?.title || 'Không rõ sự kiện'}
                </p>
                <p className="font-mono text-label text-ink-muted">
                  {shift.session === 'morning' ? 'Ca sáng' : 'Ca chiều'} · {formatDate(shift.date)}
                </p>
                <p className="mt-0.5 flex items-center gap-1 text-label text-ink-muted">
                  <MapPin size={11} aria-hidden="true" className="shrink-0" />
                  <span className="truncate">{locationName}</span>
                </p>
              </div>
              <p
                className={`shrink-0 font-mono text-body-sm tabular-nums ${
                  tone === 'warning' ? 'text-warning' : 'text-info'
                }`}
              >
                {formatCurrency(shift.amount)}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

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
  if (!selectedEmployeeSummary) return null;

  const hasUnpaid = selectedEmployeeSummary.totalUnpaid > 0;
  const hasAdvanced = selectedEmployeeSummary.advancedCount > 0;
  const totalOpen = selectedEmployeeSummary.totalUnpaid + selectedEmployeeSummary.totalAdvanced;
  const totalShifts = selectedEmployeeSummary.unpaidCount + selectedEmployeeSummary.advancedCount;

  return (
    <Modal
      title={selectedEmployeeSummary.employeeName}
      isOpen={isOpen}
      onClose={onClose}
      footer={
        (hasUnpaid || hasAdvanced) && (
          <div className="flex gap-2">
            {hasUnpaid && (
              <Button
                onClick={onPayment}
                className="flex-1"
                variant="primary"
                icon={<Banknote size={16} />}
              >
                Thanh toán / Ứng
              </Button>
            )}
            {hasAdvanced && (
              <Button
                onClick={onSettlement}
                className="flex-1"
                variant={hasUnpaid ? 'outline' : 'primary'}
                icon={<Calculator size={16} />}
              >
                Quyết toán
              </Button>
            )}
          </div>
        )
      }
    >
      <div className="space-y-4">
        <div className="grid gap-px border border-line bg-line sm:grid-cols-3">
          <div className="bg-surface px-3 py-2.5">
            <p className="font-mono text-mono-label text-ink-muted">Còn phải trả</p>
            <p
              className={`mt-0.5 font-mono text-body-sm tabular-nums ${
                hasUnpaid ? 'text-warning' : 'text-ink-muted'
              }`}
            >
              {hasUnpaid ? formatCurrency(selectedEmployeeSummary.totalUnpaid) : '—'}
            </p>
            <p className="text-label text-ink-muted">{selectedEmployeeSummary.unpaidCount} ca</p>
          </div>
          <div className="bg-surface px-3 py-2.5">
            <p className="font-mono text-mono-label text-ink-muted">Đã ứng</p>
            <p
              className={`mt-0.5 font-mono text-body-sm tabular-nums ${
                hasAdvanced ? 'text-info' : 'text-ink-muted'
              }`}
            >
              {hasAdvanced ? formatCurrency(selectedEmployeeSummary.totalAdvanced) : '—'}
            </p>
            <p className="text-label text-ink-muted">{selectedEmployeeSummary.advancedCount} ca</p>
          </div>
          <div className="bg-surface px-3 py-2.5">
            <p className="font-mono text-mono-label text-ink-muted">Tổng lương chưa chốt</p>
            <p className="mt-0.5 font-mono text-body-sm text-ink tabular-nums">
              {formatCurrency(totalOpen)}
            </p>
            <p className="text-label text-ink-muted">{totalShifts} ca</p>
          </div>
        </div>

        <div className="space-y-4">
          <ShiftGroup
            title="Ca chưa trả"
            shifts={selectedUnpaidShifts}
            events={events}
            locations={locations}
            tone="warning"
          />
          <ShiftGroup
            title="Ca đã ứng"
            shifts={selectedAdvancedShifts}
            events={events}
            locations={locations}
            tone="info"
          />
          {selectedUnpaidShifts.length === 0 && selectedAdvancedShifts.length === 0 && (
            <div className="flex items-center gap-2 border border-line px-3 py-4 text-body-sm text-ink-muted">
              <Calendar size={16} aria-hidden="true" />
              Không còn ca nào đang mở.
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default memo(PayrollEmployeeDetailModal);
