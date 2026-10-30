import React, { memo, useMemo } from 'react';
import { Employee } from '@/types/index';
import Checkbox from '@/components/ui/Checkbox';
import { Tag } from '@/components/ui/Tag';
import { cn } from '@/lib/utils';

interface EmployeeAssignmentListProps {
  employees: Employee[];
  shiftCounts: Record<string, number>;
  assignments: Record<string, boolean>;
  initialSelectedIds: Set<string>;
  searchTerm: string;
  countsLoaded?: boolean;
  onToggle: (employeeId: string) => void;
}

const EmployeeAssignmentList: React.FC<EmployeeAssignmentListProps> = ({
  employees,
  shiftCounts,
  assignments,
  initialSelectedIds,
  searchTerm,
  countsLoaded = false,
  onToggle,
}) => {
  const sortedEmployees = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return employees
      .filter((employee) => employee.name.toLowerCase().includes(term))
      .sort((a, b) => {
        const aInitial = initialSelectedIds.has(a.id) ? 1 : 0;
        const bInitial = initialSelectedIds.has(b.id) ? 1 : 0;
        if (aInitial !== bInitial) return bInitial - aInitial;

        const countDiff = (shiftCounts[b.id] || 0) - (shiftCounts[a.id] || 0);
        if (countDiff !== 0) return countDiff;

        return a.name.localeCompare(b.name, 'vi');
      });
  }, [employees, searchTerm, initialSelectedIds, shiftCounts]);

  if (employees.length === 0) {
    return (
      <div className="border border-line px-3 py-4 text-center text-label text-ink-muted">
        Chưa có nhân viên.
      </div>
    );
  }

  if (sortedEmployees.length === 0) {
    return (
      <div className="border border-line px-3 py-4 text-center text-label text-ink-muted">
        Không tìm thấy nhân viên.
      </div>
    );
  }

  return (
    <div
      role="group"
      aria-label="Chọn nhân viên"
      className="max-h-64 divide-y divide-line overflow-y-auto border border-line"
    >
      {sortedEmployees.map((employee) => {
        const shiftCount = shiftCounts[employee.id] || 0;
        const isSelected = assignments[employee.id] || false;

        return (
          <div key={employee.id} className={cn('px-3', isSelected && 'bg-surface-2')}>
            <Checkbox
              id={`employee-${employee.id}`}
              checked={isSelected}
              onChange={() => onToggle(employee.id)}
            >
              <span className="flex min-w-0 items-center justify-between gap-2">
                <span className="truncate text-body-sm text-ink">{employee.name}</span>
                {countsLoaded && shiftCount > 0 && (
                  <Tag className="shrink-0">{shiftCount} ca chưa trả</Tag>
                )}
              </span>
            </Checkbox>
          </div>
        );
      })}
    </div>
  );
};

export default memo(EmployeeAssignmentList);
