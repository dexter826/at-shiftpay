import React, { memo, useState } from 'react';
import { Pencil, Phone, Trash2 } from 'lucide-react';
import { Tag } from '@/components/ui/Tag';
import { Employee } from '@/types/index';
import { cn, focusRingOnSurfaceClasses } from '@/lib/utils';

interface EmployeeRowProps {
  employee: Employee;
  unpaidCount: number;
  onEdit: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
  onDetail: (employee: Employee) => void;
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
      className="h-12 w-12 shrink-0 rounded-full border border-line object-cover"
    />
  ) : (
    <span
      aria-hidden="true"
      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-line bg-surface-2 text-body-sm font-semibold text-ink-soft"
    >
      {getInitials(name)}
    </span>
  );
};

const EmployeeRow: React.FC<EmployeeRowProps> = ({
  employee,
  unpaidCount,
  onEdit,
  onDelete,
  onDetail,
}) => (
  <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-x-3 gap-y-2 border-b border-line px-4 py-3 last:border-b-0 hover:bg-surface-2/60 lg:grid-cols-[minmax(0,1fr)_140px_120px_96px] lg:items-center lg:gap-3">
    <div className="flex min-w-0 items-center gap-3">
      <Avatar name={employee.name} imageUrl={employee.imageUrl} />
      <div className="min-w-0">
        <button
          type="button"
          onClick={() => onDetail(employee)}
          className={cn(
            'flex min-h-11 max-w-full items-center rounded-sm text-left text-body-sm font-semibold text-ink transition-colors duration-fast ease-standard hover:text-accent-ink',
            focusRingOnSurfaceClasses
          )}
        >
          <span className="line-clamp-1">{employee.name}</span>
        </button>
        <p className="flex min-w-0 items-center gap-1.5 text-label text-ink-muted">
          <Phone size={11} aria-hidden="true" className="shrink-0" />
          <span className="truncate">{employee.phone || 'Chưa có SĐT'}</span>
        </p>
      </div>
    </div>

    <div className="flex items-center gap-1 lg:hidden">
      <button
        type="button"
        onClick={() => onEdit(employee)}
        aria-label={`Sửa hồ sơ ${employee.name}`}
        className={cn(
          'flex h-11 w-11 items-center justify-center rounded-sm text-ink-muted transition-colors duration-fast ease-standard hover:bg-surface-2 hover:text-ink',
          focusRingOnSurfaceClasses
        )}
      >
        <Pencil size={15} aria-hidden="true" />
      </button>
      <button
        type="button"
        onClick={() => onDelete(employee)}
        aria-label={`Xóa nhân viên ${employee.name}`}
        className={cn(
          'flex h-11 w-11 items-center justify-center rounded-sm text-ink-muted transition-colors duration-fast ease-standard hover:bg-danger/10 hover:text-danger',
          focusRingOnSurfaceClasses
        )}
      >
        <Trash2 size={15} aria-hidden="true" />
      </button>
    </div>

    <div className="col-span-2 flex items-center justify-between gap-2 lg:col-span-1 lg:justify-start">
      <span className="font-mono text-label text-ink-muted lg:hidden">Ngân hàng</span>
      {employee.bankAccount ? (
        <Tag variant="success">Đã có</Tag>
      ) : (
        <Tag variant="warning">Chưa có</Tag>
      )}
    </div>

    <div className="col-span-2 flex items-center justify-between gap-2 lg:col-span-1 lg:justify-start">
      <span className="font-mono text-label text-ink-muted lg:hidden">Ca chưa trả</span>
      {unpaidCount > 0 ? (
        <span className="font-mono text-body-sm text-ink">{unpaidCount} ca</span>
      ) : (
        <span aria-label="Không có ca chưa trả" className="font-mono text-body-sm text-ink-muted">
          —
        </span>
      )}
    </div>

    <div className="hidden items-center justify-end gap-0.5 lg:flex">
      <button
        type="button"
        onClick={() => onEdit(employee)}
        aria-label={`Sửa hồ sơ ${employee.name}`}
        className={cn(
          'flex h-11 w-11 items-center justify-center rounded-sm text-ink-muted transition-colors duration-fast ease-standard hover:bg-surface-2 hover:text-ink',
          focusRingOnSurfaceClasses
        )}
      >
        <Pencil size={15} aria-hidden="true" />
      </button>
      <button
        type="button"
        onClick={() => onDelete(employee)}
        aria-label={`Xóa nhân viên ${employee.name}`}
        className={cn(
          'flex h-11 w-11 items-center justify-center rounded-sm text-ink-muted transition-colors duration-fast ease-standard hover:bg-danger/10 hover:text-danger',
          focusRingOnSurfaceClasses
        )}
      >
        <Trash2 size={15} aria-hidden="true" />
      </button>
    </div>
  </div>
);

export default memo(EmployeeRow);
