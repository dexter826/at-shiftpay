import React, { memo, useState } from 'react';
import { Phone, Briefcase, Pencil, Trash2, Landmark } from 'lucide-react';
import { Employee } from '@/types/index';
import { focusRingClasses, focusRingOnSurfaceClasses } from '@/lib/utils';

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
    <div className="relative bg-surface border border-line rounded-md aspect-square">
      {/* Photo layer: clipped here so the card's focus ring is never cut off */}
      <div className="absolute inset-0 overflow-hidden rounded-md bg-canvas">
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
      </div>

      {/* Open-profile target: transparent, painted under the layers that follow */}
      <button
        type="button"
        onClick={() => onClick(employee)}
        aria-label={`Xem hồ sơ ${employee.name}`}
        className={`absolute inset-0 cursor-pointer rounded-md transition-colors duration-fast ease-standard hover:bg-canvas/30 ${focusRingClasses}`}
      />

      {/* Bank status chip: the dot carries the status color */}
      <div className="absolute top-2 left-2 flex items-center gap-1.5 px-1.5 py-0.5 rounded-xs bg-surface-2 text-label font-medium text-ink-soft pointer-events-none">
        <span
          className={`w-1.5 h-1.5 rounded-xs ${employee.bankAccount ? 'bg-success' : 'bg-warning'}`}
        />
        <Landmark size={12} className="text-ink-muted" />
        <span>Ngân hàng</span>
      </div>

      <div className="absolute top-2 right-2 flex flex-col gap-1.5">
        <button
          type="button"
          onClick={() => onEdit(employee)}
          className={`flex h-10 w-10 items-center justify-center rounded-sm bg-surface border border-line text-ink-muted hover:text-ink hover:bg-surface-2 transition-colors duration-fast ease-standard ${focusRingOnSurfaceClasses}`}
          aria-label={`Sửa hồ sơ ${employee.name}`}
          title="Sửa"
        >
          <Pencil size={14} />
        </button>
        <button
          type="button"
          onClick={() => onDelete(employee.id)}
          className={`flex h-10 w-10 items-center justify-center rounded-sm bg-surface border border-line text-ink-muted hover:text-danger hover:bg-surface-2 transition-colors duration-fast ease-standard ${focusRingOnSurfaceClasses}`}
          aria-label={`Xóa ${employee.name}`}
          title="Xóa"
        >
          <Trash2 size={14} />
        </button>
      </div>

      {/* Info band: solid surface keeps the figures legible over any photo, in both themes */}
      <div className="absolute bottom-0 left-0 right-0 bg-surface rounded-b-md px-2.5 py-2 pointer-events-none">
        <h3 className="text-body-sm font-medium text-ink truncate leading-tight">
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
