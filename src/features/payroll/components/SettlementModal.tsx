import React, { useState, useMemo, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { useToast } from '@/components/ui/ToastProvider';
/* removed unused import from @/stores/themeStore */
import { Shift, PaymentTransaction, AdvanceBalance, Event, Location } from '@/types/index';
import { formatCurrency } from '@/utils/format';
import { paymentService } from '@/lib/api/paymentService';
import { Calculator, Loader2, AlertTriangle } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';

interface SettlementModalProps {
  isOpen: boolean;
  onClose: () => void;
  employeeId: string;
  employeeName: string;
  shifts: Shift[];
  paymentHistory: PaymentTransaction[];
  events: Event[];
  locations: Location[];
  onSuccess?: () => void;
}

export const SettlementModal: React.FC<SettlementModalProps> = ({
  isOpen,
  onClose,
  employeeId,
  employeeName,
  shifts,
  onSuccess,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { showToast } = useToast();

  const { user } = useAuthStore();
  const userId = user?.uid || '';

  const [localAdvances, setLocalAdvances] = useState<PaymentTransaction[]>([]);
  const [isLoadingAdvances, setIsLoadingAdvances] = useState(true); // Trạng thái loading mặc định
  const [advancesError, setAdvancesError] = useState<string | null>(null);

  useEffect(() => {
    // Reset state mỗi khi mở modal
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- reset the fetch state for each opening
      setIsLoadingAdvances(true);
      setAdvancesError(null);
      setLocalAdvances([]);

      const fetchAdvances = async () => {
        try {
          const data = await paymentService.getUnsettledAdvances(employeeId, userId);
          setLocalAdvances(data);
        } catch (error) {
          console.error('Failed to fetch advances:', error);
          setAdvancesError('Không thể tải khoản ứng lương. Vui lòng đóng và thử lại.');
          showToast('Không thể tải khoản ứng lương', 'error');
        } finally {
          setIsLoadingAdvances(false);
        }
      };
      fetchAdvances();
    } else {
      // Xóa data cũ khi đóng
      setIsLoadingAdvances(true);
      setLocalAdvances([]);
    }
  }, [isOpen, employeeId, userId, showToast]);

  // Tính số dư nợ
  const advanceBalance = useMemo((): AdvanceBalance => {
    const employeeShifts = shifts.filter((s) => s.employeeId === employeeId);

    // Dùng data thực tế từ DB
    const totalAdvanced = localAdvances.reduce((sum, p) => sum + p.amount, 0);

    const totalEarned = employeeShifts
      .filter((s) => s.status === 'unpaid' || s.status === 'advanced')
      .reduce((sum, s) => sum + s.amount, 0);

    const balance = totalEarned - totalAdvanced;

    return {
      employeeId,
      employeeName,
      totalAdvanced,
      totalEarned,
      balance,
    };
  }, [employeeId, employeeName, shifts, localAdvances]);

  // Tiền ứng chưa chốt
  const unsettledAdvances = useMemo(() => {
    return localAdvances;
  }, [localAdvances]);

  // Gộp ca chưa trả để bù trừ công nợ
  const settleableShifts = useMemo(() => {
    return shifts.filter(
      (s) => s.employeeId === employeeId && (s.status === 'advanced' || s.status === 'unpaid')
    );
  }, [shifts, employeeId]);

  const handleSettlement = async () => {
    if (advancesError) {
      showToast('Chưa tải được khoản ứng, không thể quyết toán', 'error');
      return;
    }
    if (unsettledAdvances.length === 0 || settleableShifts.length === 0) {
      showToast('Không có dữ liệu công hoặc tiền ứng để quyết toán', 'warning');
      return;
    }

    setIsProcessing(true);
    try {
      // Chốt sổ theo số dư thực
      const settlementAmount = Math.round(advanceBalance.balance);

      await paymentService.settleAdvancePayment(
        employeeId,
        employeeName,
        unsettledAdvances.map((p) => p.id),
        settleableShifts.map((s) => s.id),
        settlementAmount,
        userId
      );

      showToast('Quyết toán tiền ứng thành công', 'success');
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Settlement error:', error);
      showToast('Có lỗi xảy ra khi quyết toán', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Modal title="Xác nhận quyết toán" isOpen={isOpen} onClose={onClose}>
      <div className="space-y-6">
        <div
          className={`p-6 bg-surface border border-line rounded-md flex flex-col items-center text-center`}
        >
          {isLoadingAdvances ? (
            <div className="py-4 space-y-3">
              <Loader2 size={32} className="animate-spin text-accent-ink mx-auto" />
              <p className={`text-body-sm text-ink-soft`}>Đang kiểm tra dữ liệu...</p>
            </div>
          ) : advancesError ? (
            <div className="py-4 space-y-3 text-danger">
              <AlertTriangle size={32} className="mx-auto" />
              <p className="text-body-sm">{advancesError}</p>
            </div>
          ) : (
            <>
              <div className="mb-4 p-3 bg-surface-2 rounded-md">
                <Calculator size={32} className="text-accent-ink" />
              </div>

              <h3 className={`text-title font-semibold text-ink mb-2`}>
                Quyết toán cho {employeeName}?
              </h3>

              <div className="my-4">
                <p className={`text-label text-ink-muted mb-1 font-medium`}>Số tiền cần trả thêm</p>
                <p
                  className={`text-data font-semibold tabular-nums ${advanceBalance.balance >= 0 ? 'text-warning' : 'text-info'}`}
                >
                  {formatCurrency(advanceBalance.balance)}
                </p>
              </div>

              <p className={`text-body-sm text-ink-soft max-w-xs mx-auto`}>
                Hành động này sẽ gạch nợ tất cả các khoản ứng và xác nhận thanh toán các ca làm việc
                hiện tại.
              </p>
            </>
          )}
        </div>

        <div className="flex gap-3">
          <Button variant="secondary" onClick={onClose} className="flex-1" disabled={isProcessing}>
            Hủy bỏ
          </Button>
          <Button
            onClick={handleSettlement}
            className="flex-1"
            disabled={
              isProcessing || isLoadingAdvances || !!advancesError || settleableShifts.length === 0
            }
          >
            {isProcessing ? 'Đang xử lý...' : 'Xác nhận quyết toán'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
