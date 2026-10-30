import React, { useMemo } from 'react';
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
    <div className={`border rounded-lg divide-y max-h-48 overflow-y-auto border-line divide-line`}>
      {employees.length === 0 ? (
        <div className={`p-3 text-center text-xs text-ink-muted`}>Chưa có nhân viên</div>
      ) : sortedEmployees.length === 0 ? (
        <div className={`p-3 text-center text-xs text-ink-muted`}>Không tìm thấy nhân viên</div>
      ) : (
        sortedEmployees.map((employee) => {
          const shiftCount = shiftCounts[employee.id] || 0;
          const isSelected = assignments[employee.id] || false;

          return (
            <div
              key={employee.id}
              onClick={() => onToggle(employee.id)}
              className={`p-2.5 flex items-center justify-between cursor-pointer transition-colors hover:bg-accent/5 ${
                isSelected ? 'bg-accent/10' : ''
              }`}
            >
              <div className="flex items-center gap-2 flex-1">
                <span
                  className={`text-sm truncate text-ink-soft ${isSelected ? 'font-medium' : ''}`}
                >
                  {employee.name}
                </span>
                {shiftCount > 0 && (
                  <span className={`text-xs px-1.5 py-0.5 rounded-full bg-line text-ink-muted`}>
                    {shiftCount}
                  </span>
                )}
              </div>
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                  isSelected ? 'bg-accent border-accent' : 'border-line'
                }`}
              >
                {isSelected && <Check size={12} className="text-white" />}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default EmployeeAssignmentList;
