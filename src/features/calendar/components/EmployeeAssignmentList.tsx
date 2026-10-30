import React, { useMemo } from 'react';
import { focusRingOnSurfaceClasses } from '@/lib/utils';
import { Check } from 'lucide-react';
import { Employee } from '@/types/index';

interface EmployeeAssignmentListProps {
  employees: Employee[];
  shiftCounts: Record<string, number>;
  assignments: Record<string, boolean>;
  initialSelectedIds: Set<string>;
  searchTerm: string;
  onToggle: (employeeId: string) => void;
}

const EmployeeAssignmentList: React.FC<EmployeeAssignmentListProps> = ({
  employees,
  shiftCounts,
  assignments,
  initialSelectedIds,
  searchTerm,
  onToggle,
}) => {
  const sortedEmployees = useMemo(() => {
    const term = searchTerm.toLowerCase();

    return employees
      .filter((employee) => employee.name.toLowerCase().includes(term))
      .sort((a, b) => {
        const aInitial = initialSelectedIds.has(a.id) ? 1 : 0;
        const bInitial = initialSelectedIds.has(b.id) ? 1 : 0;
        if (aInitial !== bInitial) return bInitial - aInitial;

        const countDiff = (shiftCounts[b.id] || 0) - (shiftCounts[a.id] || 0);
        if (countDiff !== 0) return countDiff;

        return a.name.localeCompare(b.name);
      });
  }, [employees, searchTerm, initialSelectedIds, shiftCounts]);

  return (
    <div className={`border rounded-md divide-y max-h-48 overflow-y-auto border-line divide-line`}>
      {employees.length === 0 ? (
        <div className={`p-3 text-center text-label text-ink-muted`}>Chưa có nhân viên</div>
      ) : sortedEmployees.length === 0 ? (
        <div className={`p-3 text-center text-label text-ink-muted`}>Không tìm thấy nhân viên</div>
      ) : (
        sortedEmployees.map((employee) => {
          const shiftCount = shiftCounts[employee.id] || 0;
          const isSelected = assignments[employee.id] || false;

          return (
            <button
              key={employee.id}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onToggle(employee.id)}
              className={`w-full text-left p-2.5 flex items-center justify-between transition-colors duration-fast ease-standard hover:bg-surface-2/70 ${
                isSelected ? 'bg-surface-2' : ''
              } ${focusRingOnSurfaceClasses}`}
            >
              <div className="flex items-center gap-2 flex-1">
                <span
                  className={`text-body-sm truncate text-ink-soft ${isSelected ? 'font-medium' : ''}`}
                >
                  {employee.name}
                </span>
                {shiftCount > 0 && (
                  <span
                    className={`text-label px-1.5 py-0.5 rounded-xs bg-surface-2 text-ink-muted`}
                  >
                    {shiftCount}
                  </span>
                )}
              </div>
              <div
                className={`w-5 h-5 rounded-xs border-2 flex items-center justify-center transition-colors duration-fast ease-standard ${
                  isSelected ? 'bg-accent border-accent' : 'border-line'
                }`}
              >
                {isSelected && <Check size={12} className="text-on-accent" />}
              </div>
            </button>
          );
        })
      )}
    </div>
  );
};

export default EmployeeAssignmentList;
