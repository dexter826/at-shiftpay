import React, { memo, useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { Employee } from '@/types/index';
import { Calendar, CreditCard, Pencil, Phone } from 'lucide-react';
import { focusRingOnSurfaceClasses } from '@/lib/utils';
import BankCard from '@/features/employee/components/BankCard';

interface EmployeeDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee | null;
  onEditClick: (employee: Employee) => void;
}

const Avatar: React.FC<{ name: string; imageUrl?: string }> = ({ name, imageUrl }) => {
  const [imgError, setImgError] = useState(false);

  if (imageUrl && !imgError) {
    return (
      <img
        src={imageUrl}
        alt={name}
        className="w-24 h-24 rounded-full object-cover border border-line"
        onError={() => setImgError(true)}
      />
    );
  }

  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="w-24 h-24 rounded-full bg-surface-2 flex items-center justify-center text-data font-semibold text-ink-soft">
      {initials}
    </div>
  );
};

const EmployeeDetailModal: React.FC<EmployeeDetailModalProps> = ({
  isOpen,
  onClose,
  employee,
  onEditClick,
}) => {
  if (!employee) return null;

  const joinedDate = employee.createdAt
    ? new Date(employee.createdAt).toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
    : '---';

  return (
    <Modal
      title="Hồ sơ nhân viên"
      isOpen={isOpen}
      onClose={onClose}
      footer={
        <Button
          variant="primary"
          onClick={() => {
            onClose();
            onEditClick(employee);
          }}
          fullWidth
          className="flex justify-center items-center gap-2"
        >
          <Pencil size={18} color="currentColor" />
          Chỉnh sửa hồ sơ
        </Button>
      }
    >
      <div className="space-y-6">
        <div className="flex flex-col items-center pt-2">
          <div className="relative mb-4">
            <Avatar key={employee.id} name={employee.name} imageUrl={employee.imageUrl} />
          </div>

          <div className="text-center space-y-3">
            <h3 className="text-display font-semibold text-ink">{employee.name}</h3>

            <div className="flex flex-wrap justify-center gap-2">
              <div className="inline-flex items-center gap-1.5 px-1.5 py-0.5 rounded-xs text-label font-medium bg-surface-2 text-ink-soft">
                <Calendar size={12} className="text-accent-ink" />
                <span className="tabular-nums">Tham gia {joinedDate}</span>
              </div>

              {employee.phone && (
                <a
                  href={`tel:${employee.phone}`}
                  className={`inline-flex min-h-10 items-center gap-1.5 px-3 rounded-sm text-body-sm font-semibold bg-surface border border-line text-accent-ink hover:brightness-110 transition-colors duration-fast ease-standard ${focusRingOnSurfaceClasses}`}
                >
                  <Phone size={14} />
                  <span className="tabular-nums">{employee.phone}</span>
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3 px-1">
            <div className="h-px flex-1 bg-line" />
            <h4 className="text-label font-medium text-ink-muted">Thông tin thanh toán</h4>
            <div className="h-px flex-1 bg-line" />
          </div>

          <div className="flex flex-col items-center">
            {employee.bankAccount ? (
              <BankCard
                bankName={employee.bankAccount.bankName}
                accountNumber={employee.bankAccount.accountNumber}
                accountName={employee.bankAccount.accountName}
              />
            ) : (
              <div className="w-full max-w-[320px] aspect-[1.586/1] rounded-md border border-dashed border-line flex flex-col items-center justify-center p-6 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-surface-2 flex items-center justify-center text-ink-muted">
                  <CreditCard size={24} />
                </div>
                <p className="text-body-sm text-ink-muted">Chưa cập nhật thông tin ngân hàng</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default memo(EmployeeDetailModal);
