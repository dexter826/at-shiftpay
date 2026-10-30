import React, { memo, useState } from 'react';
import { Phone, Briefcase, Pencil, Trash2, Landmark } from 'lucide-react';
import { Employee } from '@/types/index';
import { focusRingClasses } from '@/lib/utils';

interface EmployeeCardProps {
  employee: Employee;
  shiftCount: number;
  onClick: (emp: Employee) => void;
  onEdit: (emp: Employee) => void;
  onDelete: (empId: string) => void;
}

const EmployeeCard: React.FC<EmployeeCardProps> = ({
  employee,
  shiftCount,
  onClick,
  onEdit,
  onDelete,
}) => {
  const [imgError, setImgError] = useState(false);
  const hasPhoto = !!employee.imageUrl && !imgError;
  const initials = employee.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="relative bg-surface border border-line rounded-md overflow-hidden group aspect-square">
      {/* Background */}
      <div className="absolute inset-0 bg-canvas">
        {hasPhoto ? (
          <img
            src={employee.imageUrl}
            alt={employee.name}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-data font-semibold text-ink-muted">
            {initials}
          </div>
        )}

        {/* Bank badge */}
        <div className="absolute top-2 left-2 z-20">
          <span
            className={`flex items-center gap-1 px-2 py-0.5 rounded-sm border border-line bg-surface text-label font-medium text-ink-soft ${
              employee.bankAccount ? 'text-success' : 'text-warning'
            }`}
          >
            <Landmark size={12} />
            <span>Ngân hàng</span>
          </span>
        </div>

        {/* Edit/Delete buttons */}
        <div className="absolute top-2 right-2 flex flex-col gap-1.5 z-20">
          <button
            type="button"
            onClick={() => onEdit(employee)}
            className="flex h-[38px] w-[38px] items-center justify-center rounded-sm bg-surface border border-line text-ink-soft hover:text-ink hover:bg-surface-2 transition-colors duration-fast ease-standard"
            aria-label={`Sửa hồ sơ ${employee.name}`}
            title="Sửa"
          >
            <Pencil size={14} />
          </button>
          <button
            type="button"
            onClick={() => onDelete(employee.id)}
            className="flex h-[38px] w-[38px] items-center justify-center rounded-sm bg-surface border border-line text-ink-soft hover:text-danger hover:bg-surface-2 transition-colors duration-fast ease-standard"
            aria-label={`Xóa ${employee.name}`}
            title="Xóa"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Open-profile target sits under the info band and above the photo */}
      <button
        type="button"
        onClick={() => onClick(employee)}
        aria-label={`Xem hồ sơ ${employee.name}`}
        className={`absolute inset-0 z-10 cursor-pointer transition-colors duration-fast ease-standard hover:bg-scrim/10 ${focusRingClasses}`}
      />

      {/* Info at bottom */}
      <div className="absolute bottom-0 left-0 right-0 z-30 bg-surface px-2.5 py-2 pointer-events-none">
        <h3 className="text-body-sm font-semibold text-ink truncate leading-tight">
          {employee.name}
        </h3>
        <div className="flex items-center gap-1.5 text-label text-ink-muted mt-0.5 tabular-nums">
          <span className="flex items-center gap-1">
            <Phone size={11} />
            {employee.phone || '---'}
          </span>
          <span className="w-0.5 h-0.5 rounded-full bg-line" />
          <span className="flex items-center gap-1">
            <Briefcase size={11} />
            {shiftCount}
          </span>
        </div>
      </div>
    </div>
  );
};

export default memo(EmployeeCard);
