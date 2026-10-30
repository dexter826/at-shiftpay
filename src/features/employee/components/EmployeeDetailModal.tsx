import React, { memo, useState } from 'react';
import { Calendar, CreditCard, Pencil, Phone } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { Tag } from '@/components/ui/Tag';
import { Employee } from '@/types/index';
import { cn, focusRingOnSurfaceClasses } from '@/lib/utils';
import BankCard from '@/features/employee/components/BankCard';

interface EmployeeDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee | null;
  onEditClick: (employee: Employee) => void;
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

const Avatar: React.FC<{ name: string; imageUrl?: string }> = ({ name, imageUrl }) => {
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  const showPhoto = Boolean(imageUrl) && failedUrl !== imageUrl;

  return showPhoto ? (
    <img
      src={imageUrl}
      alt={name}
      onError={() => setFailedUrl(imageUrl ?? null)}
      className="h-24 w-24 rounded-full border border-line object-cover"
    />
  ) : (
    <span
      aria-hidden="true"
      className="flex h-24 w-24 items-center justify-center rounded-full border border-line bg-surface-2 text-data font-semibold text-ink-soft"
    >
      {getInitials(name)}
    </span>
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
      title={employee.name}
      isOpen={isOpen}
      onClose={onClose}
      footer={
        <Button
          onClick={() => {
            onClose();
            onEditClick(employee);
          }}
          fullWidth
          icon={<Pencil size={16} />}
        >
          Sửa hồ sơ
        </Button>
      }
    >
      <div className="space-y-5">
        <div className="flex flex-col items-center gap-3">
          <Avatar name={employee.name} imageUrl={employee.imageUrl} />
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="inline-flex items-center gap-1.5 font-mono text-label text-ink-muted">
              <Calendar size={12} aria-hidden="true" />
              Tham gia {joinedDate}
            </span>
            {employee.phone ? (
              <a
                href={`tel:${employee.phone}`}
                className={cn(
                  'inline-flex min-h-11 items-center gap-1.5 rounded-sm border border-line bg-surface px-3 text-body-sm font-semibold text-accent-ink transition-colors duration-fast ease-standard hover:bg-surface-2',
                  focusRingOnSurfaceClasses
                )}
              >
                <Phone size={14} aria-hidden="true" />
                <span className="tabular-nums">{employee.phone}</span>
              </a>
            ) : (
              <span className="text-label text-ink-muted">Chưa có số điện thoại</span>
            )}
          </div>
        </div>

        <div className="space-y-2 border-t border-line pt-4">
          <div className="flex items-center justify-between gap-2">
            <p className="font-mono text-mono-label text-ink-muted">Tài khoản ngân hàng</p>
            {employee.bankAccount ? (
              <Tag variant="success">Đã có</Tag>
            ) : (
              <Tag variant="warning">Chưa có</Tag>
            )}
          </div>

          {employee.bankAccount ? (
            <BankCard
              bankName={employee.bankAccount.bankName}
              accountNumber={employee.bankAccount.accountNumber}
              accountName={employee.bankAccount.accountName}
            />
          ) : (
            <div className="flex flex-col items-center justify-center gap-2 border border-dashed border-line px-6 py-8 text-center">
              <CreditCard size={24} aria-hidden="true" className="text-ink-muted" />
              <p className="text-body-sm text-ink">Chưa có tài khoản ngân hàng</p>
              <p className="text-label text-ink-muted">
                Thêm thông tin để chuyển khoản lương cho nhân viên.
              </p>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default memo(EmployeeDetailModal);
