import React, { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, Calculator, Loader2 } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { useToast } from '@/components/ui/ToastProvider';
import { Shift, PaymentTransaction } from '@/types/index';
import { formatCurrency } from '@/utils/format';
import { paymentService } from '@/lib/api/paymentService';
import { roundAmount, sumShiftAmounts } from '@/utils/payrollMath';
import { useAuthStore } from '@/stores/authStore';
import { cn } from '@/lib/utils';

interface SettlementModalProps {
  isOpen: boolean;
  onClose: () => void;
  employeeId: string;
  employeeName: string;
  shifts: Shift[];
}

export const SettlementModal: React.FC<SettlementModalProps> = ({
  isOpen,
  onClose,
  employeeId,
  employeeName,
  shifts,
}) => {
  const { user } = useAuthStore();
  const userId = user?.uid || '';
  const { showToast } = useToast();

  const [advances, setAdvances] = useState<PaymentTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [retryNonce, setRetryNonce] = useState(0);

  useEffect(() => {
    let active = true;

    paymentService
      .getUnsettledAdvances(employeeId, userId)
      .then((data) => {
        if (active) setAdvances(data);
      })
      .catch((error) => {
        if (!active) return;
        console.error('Failed to fetch advances:', error);
        setLoadError('Không thể tải khoản ứng lương.');
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [employeeId, userId, retryNonce]);

  const advancedShifts = useMemo(
    () => shifts.filter((shift) => shift.employeeId === employeeId && shift.status === 'advanced'),
    [shifts, employeeId]
  );
  const unpaidShifts = useMemo(
    () => shifts.filter((shift) => shift.employeeId === employeeId && shift.status === 'unpaid'),
    [shifts, employeeId]
  );
  const settleableShifts = useMemo(
    () => [...advancedShifts, ...unpaidShifts],
    [advancedShifts, unpaidShifts]
  );

  const totalAdvanced = advances.reduce((sum, payment) => sum + payment.amount, 0);
  const totalEarned = roundAmount(sumShiftAmounts(settleableShifts));
  const balance = totalEarned - totalAdvanced;
  const canSettle =
    !isLoading && !loadError && advances.length > 0 && settleableShifts.length > 0 && balance >= 0;

  const handleRetry = () => {
    setAdvances([]);
    setLoadError(null);
    setIsLoading(true);
    setRetryNonce((value) => value + 1);
  };

  const handleSettlement = async () => {
    if (!canSettle || isProcessing) return;

    setIsProcessing(true);
    try {
      await paymentService.settleAdvancePayment(
        employeeId,
        employeeName,
        advances.map((payment) => payment.id),
        settleableShifts.map((shift) => shift.id),
        balance,
        userId
      );
      showToast('Đã quyết toán.', 'success');
      onClose();
    } catch (error) {
      console.error('Settlement error:', error);
      showToast('Không thể quyết toán. Thử lại.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Modal
      title="Quyết toán ứng lương"
      isOpen={isOpen}
      onClose={onClose}
      footer={
        <div className="flex gap-2">
          <Button variant="secondary" onClick={onClose} className="flex-1" disabled={isProcessing}>
            Hủy
          </Button>
          <Button
            onClick={handleSettlement}
            className="flex-1"
            loading={isProcessing}
            disabled={!canSettle}
          >
            Quyết toán
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <div className="flex items-center gap-2 border border-line bg-surface-2 px-3 py-2.5">
          <Calculator size={16} aria-hidden="true" className="text-ink-muted" />
          <p className="text-body-sm font-semibold text-ink">{employeeName}</p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center gap-2 border border-line px-3 py-10 text-body-sm text-ink-muted">
            <Loader2 size={18} aria-hidden="true" className="animate-spin" />
            Đang tải khoản ứng…
          </div>
        ) : loadError ? (
          <div className="space-y-3 border border-danger/30 bg-danger/5 px-3 py-4 text-center">
            <AlertTriangle size={24} aria-hidden="true" className="mx-auto text-danger" />
            <p className="text-body-sm text-danger">{loadError}</p>
            <Button variant="outline" onClick={handleRetry}>
              Thử lại
            </Button>
          </div>
        ) : advances.length === 0 ? (
          <div className="border border-line px-3 py-6 text-center text-body-sm text-ink-muted">
            Không có khoản ứng chưa chốt.
          </div>
        ) : (
          <>
            <div className="grid gap-px border border-line bg-line sm:grid-cols-2">
              <div className="bg-surface px-3 py-2.5">
                <p className="font-mono text-mono-label text-ink-muted">Khoản ứng chưa chốt</p>
                <p className="mt-0.5 font-mono text-body-sm text-info tabular-nums">
                  {formatCurrency(totalAdvanced)}
                </p>
                <p className="text-label text-ink-muted">{advances.length} lần ứng</p>
              </div>
              <div className="bg-surface px-3 py-2.5">
                <p className="font-mono text-mono-label text-ink-muted">Chênh lệch</p>
                <p
                  className={cn(
                    'mt-0.5 font-mono text-body-sm tabular-nums',
                    balance < 0 ? 'text-danger' : balance > 0 ? 'text-warning' : 'text-success'
                  )}
                >
                  {formatCurrency(balance)}
                </p>
                <p className="text-label text-ink-muted">
                  {balance < 0
                    ? 'Ứng vượt lương hiện có'
                    : balance > 0
                      ? 'Còn phải trả khi chốt'
                      : 'Không còn tiền cần trả'}
                </p>
              </div>
              <div className="bg-surface px-3 py-2.5">
                <p className="font-mono text-mono-label text-ink-muted">Ca đã ứng</p>
                <p className="mt-0.5 font-mono text-body-sm text-ink">{advancedShifts.length} ca</p>
              </div>
              <div className="bg-surface px-3 py-2.5">
                <p className="font-mono text-mono-label text-ink-muted">Ca chưa trả</p>
                <p className="mt-0.5 font-mono text-body-sm text-ink">{unpaidShifts.length} ca</p>
              </div>
            </div>

            {balance < 0 ? (
              <div className="border border-danger/30 bg-danger/5 px-3 py-3">
                <p className="text-body-sm text-danger">
                  Đã ứng vượt lương hiện có {formatCurrency(Math.abs(balance))}. Cần thu hồi trước
                  khi quyết toán.
                </p>
              </div>
            ) : (
              <p className="text-body-sm leading-relaxed text-ink-soft">
                Quyết toán sẽ đánh dấu các khoản ứng là đã chốt và toàn bộ ca đang mở là đã trả. Số
                tiền còn lại sẽ được ghi vào lịch sử.
              </p>
            )}
          </>
        )}
      </div>
    </Modal>
  );
};
