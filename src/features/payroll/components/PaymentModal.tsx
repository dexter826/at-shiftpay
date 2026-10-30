import React, { useState, useMemo, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { useToast } from '@/components/ui/ToastProvider';
/* removed unused import from @/stores/themeStore */
import { Shift, PayrollSummary, Event, Employee, Location } from '@/types/index';
import { formatCurrency } from '@/utils/format';
import { paymentService } from '@/lib/api/paymentService';
import { vietQRService } from '@/lib/api/vietqrService';
import { shiftBreakdown, roundAmount, sumShiftAmounts } from '@/utils/payrollMath';
import {
  Banknote,
  AlertTriangle,
  Check,
  QrCode,
  Building2,
  User,
  MapPin,
  Wallet,
} from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { focusRingOnSurfaceClasses } from '@/lib/utils';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  employeeSummary: PayrollSummary | null;
  shifts: Shift[];
  selectedShiftIds: string[];
  onShiftSelect: (shiftId: string) => void;
  onSelectAll: () => void;
  events: Event[];
  employees: Employee[];
  locations: Location[];
  onSuccess?: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  employeeSummary,
  shifts,
  selectedShiftIds,
  onShiftSelect,
  onSelectAll,
  events,
  employees,
  locations,
  onSuccess,
}) => {
  const [paymentType, setPaymentType] = useState<'regular' | 'advance'>('regular');
  const [isProcessing, setIsProcessing] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [qrError, setQrError] = useState<string | null>(null);

  const { user } = useAuthStore();
  const userId = user?.uid || '';
  const { showToast } = useToast();

  const selectedShifts = useMemo(() => {
    return shifts.filter((s) => selectedShiftIds.includes(s.id));
  }, [shifts, selectedShiftIds]);

  const selectedTotal = roundAmount(sumShiftAmounts(selectedShifts));

  const currentEmployee = useMemo(() => {
    if (!employeeSummary) return null;
    return employees.find((e) => e.id === employeeSummary.employeeId);
  }, [employees, employeeSummary]);

  useEffect(() => {
    const generateQR = async () => {
      if (!currentEmployee?.bankAccount || selectedTotal === 0) {
        setQrCodeUrl(null);
        setQrError(null);
        return;
      }

      try {
        setQrError(null);
        const transferContent = `THANH TOAN TIEN LUONG ${selectedShiftIds.length} CONG`;
        const qrUrl = await vietQRService.generateQRCode({
          accountNo: currentEmployee.bankAccount.accountNumber,
          accountName: currentEmployee.bankAccount.accountName,
          acqId: currentEmployee.bankAccount.bankId,
          amount: selectedTotal,
          addInfo: transferContent,
          template: 'compact',
        });
        setQrCodeUrl(qrUrl);
      } catch (error) {
        console.error('Generate QR error:', error);
        setQrError('Không thể tạo mã QR');
        setQrCodeUrl(null);
      }
    };

    generateQR();
  }, [currentEmployee, selectedTotal, selectedShiftIds.length]);

  const unpaidShifts = useMemo(() => {
    if (!employeeSummary) return [];
    return shifts.filter(
      (s) => s.employeeId === employeeSummary.employeeId && s.status === 'unpaid'
    );
  }, [shifts, employeeSummary]);

  // Tách lương cơ bản và phụ phí
  const getShiftBreakdown = (shift: Shift) => {
    const event = events.find((e) => e.id === shift.eventId);
    return shiftBreakdown(shift, event);
  };

  // Format ngày giờ ca làm
  const formatShiftDate = (dateStr: string, session: 'morning' | 'afternoon') => {
    const date = new Date(dateStr);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const sessionText = session === 'morning' ? 'Tiệc sáng' : 'Tiệc chiều';
    return `${sessionText} - ${day}/${month}/${year}`;
  };

  const handlePayment = async () => {
    if (!employeeSummary || selectedShiftIds.length === 0) return;

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
            ? `Ứng tiền ${selectedShiftIds.length} ca làm việc`
            : `Thanh toán ${selectedShiftIds.length} ca làm việc`,
        userId: userId,
      };

      if (paymentType === 'advance') {
        await paymentService.createAdvancePayment(paymentData, selectedShiftIds);
        showToast('Đã ứng tiền thành công', 'success');
      } else {
        await paymentService.createPaymentTransaction(paymentData, selectedShiftIds);
        showToast('Đã thanh toán thành công', 'success');
      }

      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Payment error:', error);
      showToast('Có lỗi xảy ra khi xử lý thanh toán', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!employeeSummary) return null;

  return (
    <Modal title="Thanh toán lương" isOpen={isOpen} onClose={onClose}>
      <div className="space-y-5">
        {/* Thông tin nhân viên & Ngân hàng */}
        <div className={`p-4 bg-surface border border-line rounded-md`}>
          <div className="flex items-center gap-4">
            <div className="relative shrink-0">
              {currentEmployee?.imageUrl ? (
                <img
                  src={currentEmployee.imageUrl}
                  alt={employeeSummary.employeeName}
                  className="w-16 h-16 rounded-md object-cover border border-line"
                />
              ) : (
                <div className="w-16 h-16 rounded-md bg-surface-2 flex items-center justify-center text-ink-soft">
                  <User size={32} />
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1 space-y-0.5">
              <h3 className={`text-title font-semibold text-ink leading-tight truncate`}>
                {employeeSummary.employeeName}
              </h3>
              {currentEmployee?.bankAccount ? (
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <Building2 size={12} className="text-accent-ink shrink-0" />
                    <p className={`text-label font-medium text-accent-ink truncate`}>
                      {currentEmployee.bankAccount.bankName}
                    </p>
                  </div>
                  <p className={`text-label font-medium text-ink-soft tabular-nums`}>
                    {currentEmployee.bankAccount.accountNumber}
                  </p>
                  <p className={`text-label font-medium text-ink-soft truncate`}>
                    {currentEmployee.bankAccount.accountName}
                  </p>
                </div>
              ) : (
                <p className={`text-label font-medium text-ink-soft italic`}>
                  Chưa cập nhật ngân hàng
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Loại thanh toán */}
        <div className="space-y-3">
          <h4 className={`text-body-sm font-semibold text-ink px-1`}>Loại thanh toán:</h4>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setPaymentType('regular')}
              aria-pressed={paymentType === 'regular'}
              className={`p-3 rounded-md border transition-colors duration-fast ease-standard relative text-center ${focusRingOnSurfaceClasses} ${
                paymentType === 'regular' ? 'border-success bg-surface-2' : 'border-line bg-surface'
              }`}
            >
              {paymentType === 'regular' && (
                <div className="absolute top-2 right-2 w-5 h-5 bg-success rounded-xs flex items-center justify-center">
                  <Check size={12} className="text-on-accent" strokeWidth={3} />
                </div>
              )}
              <div className="flex items-center justify-center gap-2 mb-1">
                <Banknote
                  size={16}
                  className={paymentType === 'regular' ? 'text-success' : 'text-ink-muted'}
                />
                <span className={`text-body-sm font-semibold text-ink`}>Thanh toán</span>
              </div>
              <p className={`text-label font-medium leading-tight text-ink-soft`}>
                Nguồn tiền tiệc
              </p>
            </button>

            <button
              type="button"
              onClick={() => setPaymentType('advance')}
              aria-pressed={paymentType === 'advance'}
              className={`p-3 rounded-md border transition-colors duration-fast ease-standard relative text-center ${focusRingOnSurfaceClasses} ${
                paymentType === 'advance' ? 'border-info bg-surface-2' : 'border-line bg-surface'
              }`}
            >
              {paymentType === 'advance' && (
                <div className="absolute top-2 right-2 w-5 h-5 bg-info rounded-xs flex items-center justify-center">
                  <Check size={12} className="text-on-accent" strokeWidth={3} />
                </div>
              )}
              <div className="flex items-center justify-center gap-2 mb-1">
                <Wallet
                  size={16}
                  className={paymentType === 'advance' ? 'text-info' : 'text-ink-muted'}
                />
                <span className={`text-body-sm font-semibold text-ink`}>Ứng tiền</span>
              </div>
              <p className={`text-label font-medium leading-tight text-ink-soft`}>Nguồn cá nhân</p>
            </button>
          </div>
        </div>

        {/* Mã QR */}
        {currentEmployee?.bankAccount && selectedTotal > 0 && (
          <div
            className={`p-4 bg-surface border border-line rounded-md flex flex-col items-center justify-center space-y-3`}
          >
            <div className="flex items-center gap-2">
              <QrCode size={18} className="text-ink-soft" />
              <h4 className={`text-body-sm font-semibold text-ink`}>Quét mã chuyển khoản</h4>
            </div>

            {qrCodeUrl && !qrError ? (
              <div className={`bg-surface-2 p-3 rounded-md`}>
                <img
                  src={qrCodeUrl}
                  alt="Mã QR chuyển khoản"
                  className="w-48 h-48 object-contain"
                />
              </div>
            ) : (
              <div
                className={`w-48 h-48 flex items-center justify-center bg-surface-2 border border-line rounded-md`}
              >
                <div className="text-center p-4">
                  {qrError ? (
                    <>
                      <AlertTriangle size={32} className="mx-auto mb-2 text-warning" />
                      <p className={`text-label font-medium text-ink-soft`}>{qrError}</p>
                    </>
                  ) : (
                    <>
                      <QrCode size={32} className="mx-auto mb-2 text-ink-muted" />
                      <p className={`text-label font-medium text-ink-soft`}>Đang tạo mã QR...</p>
                    </>
                  )}
                </div>
              </div>
            )}

            <p className={`text-label font-medium text-ink-soft text-center italic`}>
              Nội dung: THANH TOAN TIEN LUONG {selectedShiftIds.length} CONG
            </p>
          </div>
        )}

        {/* Cảnh báo thiếu ngân hàng */}
        {!currentEmployee?.bankAccount && selectedTotal > 0 && (
          <div className="p-3 bg-danger/5 border border-danger/20 rounded-md flex items-center justify-center">
            <div className="flex items-center gap-2">
              <Building2 size={16} className="text-danger flex-shrink-0" />
              <p className="text-body-sm font-medium text-danger">
                Nhân viên không có thông tin ngân hàng
              </p>
            </div>
          </div>
        )}

        {/* Danh sách ca chọn */}
        <div className="space-y-3">
          <div className="flex justify-between items-center px-1">
            <h4 className={`text-body-sm font-semibold text-ink tabular-nums`}>
              Ca được chọn ({selectedShiftIds.length})
            </h4>
            <button
              type="button"
              onClick={onSelectAll}
              className={`inline-flex min-h-10 items-center px-1 rounded-sm text-label font-medium text-accent-ink hover:underline ${focusRingOnSurfaceClasses}`}
            >
              {selectedShiftIds.length === unpaidShifts.length ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
            </button>
          </div>

          <div className={`max-h-64 overflow-y-auto border border-line rounded-md`}>
            {unpaidShifts.map((shift) => {
              const breakdown = getShiftBreakdown(shift);
              const event = events.find((e) => e.id === shift.eventId);
              return (
                <button
                  key={shift.id}
                  type="button"
                  onClick={() => onShiftSelect(shift.id)}
                  aria-pressed={selectedShiftIds.includes(shift.id)}
                  className={`w-full flex items-center gap-3 p-3 border-b border-line last:border-b-0 text-left transition-colors duration-fast ease-standard hover:bg-surface-2 ${focusRingOnSurfaceClasses}`}
                >
                  <div
                    className={`w-5 h-5 shrink-0 rounded-xs border-2 flex items-center justify-center transition-colors duration-fast ease-standard ${
                      selectedShiftIds.includes(shift.id)
                        ? 'bg-accent border-accent'
                        : 'border-line'
                    }`}
                  >
                    {selectedShiftIds.includes(shift.id) && (
                      <Check size={12} className="text-on-accent" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-body-sm font-medium text-ink truncate`}>
                      {event?.title || 'Không rõ'}
                    </p>
                    <div
                      className={`text-label font-medium text-ink-soft flex items-center gap-1 truncate`}
                    >
                      <MapPin size={12} className="shrink-0" />
                      <span className="truncate">
                        {locations.find((l) => l.id === event?.locationId)?.name ||
                          'Không rõ địa điểm'}
                      </span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className={`text-body-sm font-semibold text-ink tabular-nums`}>
                      {formatCurrency(shift.amount)}
                    </div>
                    <div className={`text-label font-medium text-ink-soft mt-0.5 tabular-nums`}>
                      {formatShiftDate(shift.date, shift.session)}
                    </div>
                    {breakdown.surcharge > 0 && (
                      <div className={`text-label font-medium text-ink-soft tabular-nums`}>
                        {formatCurrency(breakdown.base)} + {formatCurrency(breakdown.surcharge)}
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tổng hợp thanh toán */}
        <div className={`p-4 bg-surface border border-line rounded-md space-y-4`}>
          <div className="flex justify-between items-center">
            <div>
              <span className={`text-label font-medium text-ink-soft block`}>
                Tổng chưa thanh toán
              </span>
              <span className={`text-label font-medium text-warning tabular-nums`}>
                {employeeSummary.unpaidCount} ca làm việc
              </span>
            </div>
            <span className={`text-body-sm font-semibold text-warning tabular-nums`}>
              {formatCurrency(employeeSummary.totalUnpaid)}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <div>
              <span className={`text-label font-medium text-ink-soft block`}>Tổng đã ứng</span>
              <span className={`text-label font-medium text-info tabular-nums`}>
                {employeeSummary.advancedCount} ca làm việc
              </span>
            </div>
            <span className={`text-body-sm font-semibold text-info tabular-nums`}>
              {formatCurrency(employeeSummary.totalAdvanced)}
            </span>
          </div>

          <div className="pt-4 border-t border-dashed border-line flex justify-between items-center">
            <div>
              <span className={`text-body-sm font-semibold text-ink block`}>
                Thanh toán đang chọn
              </span>
              <span className={`text-label font-medium text-ink-soft tabular-nums`}>
                {selectedShiftIds.length} ca làm việc
              </span>
            </div>
            <span className={`text-data font-semibold text-ink tabular-nums`}>
              {formatCurrency(selectedTotal)}
            </span>
          </div>
        </div>

        {/* Thao tác */}
        <div className="flex gap-3">
          <Button variant="secondary" onClick={onClose} className="flex-1" disabled={isProcessing}>
            Hủy
          </Button>
          <Button
            onClick={handlePayment}
            className="flex-1"
            disabled={selectedShiftIds.length === 0 || isProcessing}
          >
            {isProcessing ? 'Đang xử lý...' : paymentType === 'advance' ? 'Ứng tiền' : 'Thanh toán'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
