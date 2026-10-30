import React, { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, Banknote, Loader2, Wallet } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Checkbox from '@/components/ui/Checkbox';
import { useToast } from '@/components/ui/ToastProvider';
import { Shift, PayrollSummary, Event, Employee, Location } from '@/types/index';
import { formatCurrency, formatDate } from '@/utils/format';
import { paymentService } from '@/lib/api/paymentService';
import { vietQRService } from '@/lib/api/vietqrService';
import { roundAmount, sumShiftAmounts } from '@/utils/payrollMath';
import { useAuthStore } from '@/stores/authStore';
import { cn, focusRingOnSurfaceClasses } from '@/lib/utils';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  employeeSummary: PayrollSummary | null;
  shifts: Shift[];
  events: Event[];
  employees: Employee[];
  locations: Location[];
}

const getInitials = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'NV';

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  employeeSummary,
  shifts,
  events,
  employees,
  locations,
}) => {
  const { user } = useAuthStore();
  const userId = user?.uid || '';
  const { showToast } = useToast();

  const unpaidShifts = useMemo(() => {
    if (!employeeSummary) return [];
    return shifts
      .filter(
        (shift) => shift.employeeId === employeeSummary.employeeId && shift.status === 'unpaid'
      )
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [shifts, employeeSummary]);

  const [selectedShiftIds, setSelectedShiftIds] = useState<string[]>(() =>
    unpaidShifts.map((shift) => shift.id)
  );
  const [paymentType, setPaymentType] = useState<'regular' | 'advance'>('regular');
  const [isProcessing, setIsProcessing] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [qrState, setQrState] = useState<{
    key: string;
    url?: string;
    error?: string;
  } | null>(null);
  const [qrNonce, setQrNonce] = useState(0);

  const currentEmployee = useMemo(() => {
    if (!employeeSummary) return null;
    return employees.find((employee) => employee.id === employeeSummary.employeeId) ?? null;
  }, [employees, employeeSummary]);
  const bankAccount = currentEmployee?.bankAccount;

  const selectedShifts = useMemo(
    () => unpaidShifts.filter((shift) => selectedShiftIds.includes(shift.id)),
    [unpaidShifts, selectedShiftIds]
  );
  const selectedTotal = roundAmount(sumShiftAmounts(selectedShifts));
  const allSelected = unpaidShifts.length > 0 && selectedShiftIds.length === unpaidShifts.length;
  const transferContent =
    paymentType === 'advance'
      ? `UNG LUONG ${selectedShiftIds.length} CA`
      : `THANH TOAN LUONG ${selectedShiftIds.length} CA`;
  const qrKey = `${bankAccount?.bankId ?? ''}-${bankAccount?.accountNumber ?? ''}-${selectedTotal}-${transferContent}-${qrNonce}`;
  const currentQr = qrState?.key === qrKey ? qrState : null;

  useEffect(() => {
    let cancelled = false;

    if (!bankAccount || selectedTotal === 0) return;

    const key = qrKey;
    vietQRService
      .generateQRCode({
        accountNo: bankAccount.accountNumber,
        accountName: bankAccount.accountName,
        acqId: bankAccount.bankId,
        amount: selectedTotal,
        addInfo: transferContent,
        template: 'compact',
      })
      .then((url) => {
        if (!cancelled) setQrState({ key, url });
      })
      .catch((error) => {
        if (cancelled) return;
        console.error('Generate QR error:', error);
        setQrState({ key, error: 'Không thể tạo mã QR.' });
      });

    return () => {
      cancelled = true;
    };
  }, [bankAccount, selectedTotal, transferContent, qrKey]);

  const toggleShift = (shiftId: string) => {
    setSelectedShiftIds((previous) =>
      previous.includes(shiftId) ? previous.filter((id) => id !== shiftId) : [...previous, shiftId]
    );
  };

  const toggleAll = () => {
    setSelectedShiftIds(allSelected ? [] : unpaidShifts.map((shift) => shift.id));
  };

  const handlePayment = async () => {
    if (!employeeSummary || selectedShiftIds.length === 0 || isProcessing) return;

    setIsProcessing(true);
    try {
      const paymentData = {
        employeeId: employeeSummary.employeeId,
        employeeName: employeeSummary.employeeName,
        amount: selectedTotal,
        date: Date.now(),
        shiftIds: selectedShiftIds,
        type: paymentType as 'regular' | 'advance',
        note:
          paymentType === 'advance'
            ? `Ứng lương ${selectedShiftIds.length} ca`
            : `Thanh toán ${selectedShiftIds.length} ca`,
        userId,
      };

      if (paymentType === 'advance') {
        await paymentService.createAdvancePayment(paymentData, selectedShiftIds);
        showToast('Đã ứng lương.', 'success');
      } else {
        await paymentService.createPaymentTransaction(paymentData, selectedShiftIds);
        showToast('Đã thanh toán.', 'success');
      }
      onClose();
    } catch (error) {
      console.error('Payment error:', error);
      showToast('Không thể xử lý chi trả. Thử lại.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!employeeSummary) return null;

  return (
    <Modal
      title="Chi trả lương"
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      footer={
        <div className="flex gap-2">
          <Button variant="secondary" onClick={onClose} className="flex-1" disabled={isProcessing}>
            Hủy
          </Button>
          <Button
            onClick={handlePayment}
            className="flex-1"
            loading={isProcessing}
            disabled={selectedShiftIds.length === 0}
          >
            {paymentType === 'advance' ? 'Ứng lương' : 'Thanh toán'}
          </Button>
        </div>
      }
    >
      <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_280px]">
        <div className="space-y-4">
          <div className="flex items-center gap-3 border border-line bg-surface-2 px-3 py-2.5">
            {currentEmployee?.imageUrl && !imageError ? (
              <img
                src={currentEmployee.imageUrl}
                alt={employeeSummary.employeeName}
                onError={() => setImageError(true)}
                className="h-12 w-12 shrink-0 rounded-full border border-line object-cover"
              />
            ) : (
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-line bg-surface text-body-sm font-semibold text-ink-soft">
                {getInitials(employeeSummary.employeeName)}
              </span>
            )}
            <div className="min-w-0">
              <p className="truncate text-body-sm font-semibold text-ink">
                {employeeSummary.employeeName}
              </p>
              {bankAccount ? (
                <p className="truncate font-mono text-label text-ink-muted">
                  {bankAccount.bankName} · {bankAccount.accountNumber}
                </p>
              ) : (
                <p className="text-label text-warning">Chưa có tài khoản ngân hàng</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2" role="group" aria-label="Hình thức chi trả">
            <button
              type="button"
              onClick={() => setPaymentType('regular')}
              aria-pressed={paymentType === 'regular'}
              className={cn(
                'min-h-11 rounded-sm border px-3 py-2 text-left transition-colors duration-fast ease-standard',
                paymentType === 'regular'
                  ? 'border-accent bg-accent-soft text-accent-ink'
                  : 'border-line text-ink-muted hover:border-line-strong',
                focusRingOnSurfaceClasses
              )}
            >
              <span className="flex items-center gap-1.5 text-body-sm font-semibold">
                <Banknote size={15} aria-hidden="true" />
                Thanh toán
              </span>
              <span className="mt-0.5 block text-label text-ink-muted">
                Đánh dấu các ca đã chọn là đã trả.
              </span>
            </button>
            <button
              type="button"
              onClick={() => setPaymentType('advance')}
              aria-pressed={paymentType === 'advance'}
              className={cn(
                'min-h-11 rounded-sm border px-3 py-2 text-left transition-colors duration-fast ease-standard',
                paymentType === 'advance'
                  ? 'border-info bg-info/10 text-info'
                  : 'border-line text-ink-muted hover:border-line-strong',
                focusRingOnSurfaceClasses
              )}
            >
              <span className="flex items-center gap-1.5 text-body-sm font-semibold">
                <Wallet size={15} aria-hidden="true" />
                Ứng lương
              </span>
              <span className="mt-0.5 block text-label text-ink-muted">
                Trả trước các ca đã chọn; quyết toán sau.
              </span>
            </button>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <p className="text-body-sm font-semibold text-ink">
                Ca được chọn ({selectedShiftIds.length})
              </p>
              <button
                type="button"
                onClick={toggleAll}
                className={cn(
                  'min-h-11 rounded-sm px-2 text-label font-medium text-accent-ink hover:underline',
                  focusRingOnSurfaceClasses
                )}
              >
                {allSelected ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
              </button>
            </div>

            <div className="max-h-72 overflow-y-auto border border-line">
              {unpaidShifts.map((shift) => {
                const event = events.find((item) => item.id === shift.eventId);
                const locationName =
                  locations.find((item) => item.id === event?.locationId)?.name ??
                  'Chưa có địa điểm';

                return (
                  <div key={shift.id} className="border-b border-line last:border-b-0 px-3">
                    <Checkbox
                      id={`pay-shift-${shift.id}`}
                      checked={selectedShiftIds.includes(shift.id)}
                      onChange={() => toggleShift(shift.id)}
                    >
                      <span className="flex w-full items-start justify-between gap-3">
                        <span className="min-w-0">
                          <span className="block truncate text-body-sm text-ink">
                            {event?.title || 'Không rõ sự kiện'}
                          </span>
                          <span className="block font-mono text-label text-ink-muted">
                            {shift.session === 'morning' ? 'Ca sáng' : 'Ca chiều'} ·{' '}
                            {formatDate(shift.date)}
                          </span>
                          <span className="block truncate text-label text-ink-muted">
                            {locationName}
                          </span>
                        </span>
                        <span className="shrink-0 font-mono text-body-sm text-ink tabular-nums">
                          {formatCurrency(shift.amount)}
                        </span>
                      </span>
                    </Checkbox>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {bankAccount ? (
            selectedTotal > 0 ? (
              <div className="border border-line p-3 text-center">
                <p className="font-mono text-mono-label text-ink-muted">QR chuyển khoản</p>
                <div className="mt-2 flex min-h-[180px] items-center justify-center">
                  {currentQr?.url ? (
                    <img
                      src={currentQr.url}
                      alt="Mã QR chuyển khoản"
                      className="h-44 w-44 object-contain"
                    />
                  ) : currentQr?.error ? (
                    <div className="space-y-2 text-center">
                      <AlertTriangle
                        size={26}
                        aria-hidden="true"
                        className="mx-auto text-warning"
                      />
                      <p className="text-label text-ink-soft">{currentQr.error}</p>
                      <Button variant="outline" onClick={() => setQrNonce((value) => value + 1)}>
                        Thử lại
                      </Button>
                    </div>
                  ) : (
                    <Loader2 size={28} aria-hidden="true" className="animate-spin text-ink-muted" />
                  )}
                </div>
                <p className="mt-1 font-mono text-[10px] text-ink-muted">
                  Nội dung: {transferContent}
                </p>
              </div>
            ) : (
              <div className="border border-line p-3">
                <p className="text-label text-ink-muted">Chọn ít nhất một ca để tạo mã QR.</p>
              </div>
            )
          ) : (
            <div className="border border-warning/30 bg-warning/5 p-3">
              <p className="text-label text-warning">
                Chưa có tài khoản ngân hàng. Có thể thanh toán tiền mặt; QR không khả dụng.
              </p>
            </div>
          )}

          <div className="border border-line p-3">
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-label text-ink-muted">Đang chọn</span>
              <span className="font-mono text-body-sm text-ink">{selectedShiftIds.length} ca</span>
            </div>
            <div className="mt-2 flex items-baseline justify-between gap-2 border-t border-line pt-2">
              <span className="text-body-sm font-semibold text-ink">Số tiền</span>
              <span className="font-mono text-data text-ink tabular-nums">
                {formatCurrency(selectedTotal)}
              </span>
            </div>
            <div className="mt-2 space-y-1 border-t border-line pt-2 text-label text-ink-muted">
              <div className="flex justify-between gap-2">
                <span>Chưa trả toàn bộ</span>
                <span className="font-mono text-warning tabular-nums">
                  {formatCurrency(employeeSummary.totalUnpaid)}
                </span>
              </div>
              <div className="flex justify-between gap-2">
                <span>Đã ứng</span>
                <span className="font-mono text-info tabular-nums">
                  {formatCurrency(employeeSummary.totalAdvanced)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
