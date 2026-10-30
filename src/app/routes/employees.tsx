import React, { memo, useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import { Employee, Shift } from '@/types/index';
import { employeeService } from '@/lib/api/employeeService';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/components/ui/ToastProvider';
import Button from '@/components/ui/Button';
import { useAuthStore } from '@/stores/authStore';
import { toDateKey } from '@/utils/format';
import EmployeeToolbar, { type EmployeeSort } from '@/features/employee/components/EmployeeToolbar';
import EmployeeList from '@/features/employee/components/EmployeeList';
import EmployeeFormModal from '@/features/employee/components/EmployeeFormModal';
import EmployeeDetailModal from '@/features/employee/components/EmployeeDetailModal';

interface EmployeeViewProps {
  employees: Employee[];
  shifts: Shift[];
  loading?: boolean;
}

const EmployeeView: React.FC<EmployeeViewProps> = ({ employees, shifts, loading = false }) => {
  const { showToast } = useToast();
  const { user } = useAuthStore();
  const userId = user?.uid || '';

  const now = new Date();
  const monthPrefix = toDateKey(now).slice(0, 7);
  const monthLabel = `Tháng ${now.getMonth() + 1}`;

  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<EmployeeSort>('name');
  const [visibleCount, setVisibleCount] = useState(12);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Employee | null>(null);
  const [blockedDelete, setBlockedDelete] = useState<{ reason: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const resetPagination = () => setVisibleCount(12);

  const unpaidCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    shifts.forEach((shift) => {
      if (shift.status === 'unpaid' && shift.date.startsWith(monthPrefix)) {
        counts[shift.employeeId] = (counts[shift.employeeId] || 0) + 1;
      }
    });
    return counts;
  }, [shifts, monthPrefix]);

  const filteredEmployees = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return employees
      .filter(
        (employee) =>
          !term ||
          employee.name.toLowerCase().includes(term) ||
          employee.phone.toLowerCase().includes(term)
      )
      .sort((a, b) => {
        if (sortBy === 'name') return a.name.localeCompare(b.name, 'vi');
        if (sortBy === 'recent') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }

        const countDiff = (unpaidCounts[b.id] || 0) - (unpaidCounts[a.id] || 0);
        return countDiff !== 0 ? countDiff : a.name.localeCompare(b.name, 'vi');
      });
  }, [employees, searchTerm, sortBy, unpaidCounts]);

  const stats = useMemo(() => {
    const missingBank = employees.filter((employee) => !employee.bankAccount).length;
    return { total: employees.length, missingBank };
  }, [employees]);

  const summary = useMemo(() => {
    const parts = [`${monthLabel}`, `${stats.total} nhân viên`];
    if (stats.missingBank > 0) parts.push(`${stats.missingBank} chưa có tài khoản`);
    return parts.join(' · ');
  }, [monthLabel, stats]);

  const canDeleteEmployee = (employee: Employee): { canDelete: boolean; reason?: string } => {
    const unpaidShifts = shifts.filter(
      (shift) => shift.employeeId === employee.id && shift.status === 'unpaid'
    );
    if (unpaidShifts.length > 0) {
      return {
        canDelete: false,
        reason: `“${employee.name}” còn ${unpaidShifts.length} ca chưa thanh toán.`,
      };
    }

    const todayKey = toDateKey(new Date());
    const upcomingShifts = shifts.filter(
      (shift) => shift.employeeId === employee.id && shift.date >= todayKey
    );
    if (upcomingShifts.length > 0) {
      return {
        canDelete: false,
        reason: `“${employee.name}” đang có ${upcomingShifts.length} ca từ hôm nay trở đi.`,
      };
    }

    return { canDelete: true };
  };

  const handleDelete = (employee: Employee) => {
    const check = canDeleteEmployee(employee);
    if (!check.canDelete) {
      setBlockedDelete({ reason: check.reason ?? '' });
      return;
    }
    setDeleteTarget(employee);
  };

  const confirmDelete = async () => {
    if (!deleteTarget || isDeleting) return;

    setIsDeleting(true);
    try {
      await employeeService.deleteEmployee(deleteTarget.id);
      showToast('Đã xóa nhân viên.', 'success');
      setDeleteTarget(null);
    } catch (error) {
      console.error('Delete employee failed:', error);
      showToast('Không thể xóa nhân viên. Thử lại.', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingEmployee(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (employee: Employee) => {
    setEditingEmployee(employee);
    setIsFormOpen(true);
  };

  return (
    <div className="min-h-dynamic bg-canvas">
      <div className="mx-auto max-w-[1400px] px-4 py-5 md:px-6 md:py-6">
        <header className="flex flex-col gap-4 border-b border-line pb-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-mono text-mono-label text-ink-muted">
              {loading ? 'Đang tải nhân sự' : summary}
            </p>
            <h1 className="mt-1 text-display text-ink">Sổ nhân sự</h1>
          </div>
          <Button onClick={handleOpenAdd} icon={<Plus size={16} />}>
            Thêm nhân viên
          </Button>
        </header>

        <div className="mt-4 space-y-3">
          <EmployeeToolbar
            searchTerm={searchTerm}
            onSearchChange={(value) => {
              setSearchTerm(value);
              resetPagination();
            }}
            onClearSearch={() => {
              setSearchTerm('');
              resetPagination();
            }}
            sortBy={sortBy}
            onSortChange={(value) => {
              setSortBy(value);
              resetPagination();
            }}
            loading={loading}
          />

          <EmployeeList
            loading={loading}
            employees={filteredEmployees}
            totalEmployees={employees.length}
            searchTerm={searchTerm}
            visibleCount={visibleCount}
            onLoadMore={() =>
              setVisibleCount((current) => Math.min(current + 12, filteredEmployees.length))
            }
            unpaidCounts={unpaidCounts}
            onEdit={handleOpenEdit}
            onDelete={handleDelete}
            onDetail={setSelectedEmployee}
            onClearSearch={() => {
              setSearchTerm('');
              resetPagination();
            }}
          />
        </div>
      </div>

      {isFormOpen && (
        <EmployeeFormModal
          isOpen
          onClose={() => {
            setIsFormOpen(false);
            setEditingEmployee(null);
          }}
          editingEmployee={editingEmployee}
          employees={employees}
          userId={userId}
        />
      )}

      {selectedEmployee && (
        <EmployeeDetailModal
          isOpen
          onClose={() => setSelectedEmployee(null)}
          employee={selectedEmployee}
          onEditClick={handleOpenEdit}
        />
      )}

      <Modal
        title="Xóa nhân viên?"
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        footer={
          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={() => setDeleteTarget(null)}
              className="flex-1"
              disabled={isDeleting}
            >
              Hủy
            </Button>
            <Button
              variant="danger"
              onClick={confirmDelete}
              className="flex-1"
              loading={isDeleting}
            >
              Xóa nhân viên
            </Button>
          </div>
        }
      >
        {deleteTarget && (
          <p className="text-body-sm text-ink-soft">
            “{deleteTarget.name}” sẽ bị xóa khỏi sổ. Các ca cũ vẫn giữ tên trong sổ lương. Không thể
            hoàn tác.
          </p>
        )}
      </Modal>

      <Modal
        title="Không thể xóa nhân viên"
        isOpen={!!blockedDelete}
        onClose={() => setBlockedDelete(null)}
        footer={
          <Button variant="secondary" onClick={() => setBlockedDelete(null)} fullWidth>
            Đã hiểu
          </Button>
        }
      >
        {blockedDelete && (
          <div className="space-y-2 text-body-sm text-ink-soft">
            <p>{blockedDelete.reason}</p>
            <p className="text-label text-ink-muted">Thanh toán hoặc gỡ ca trước khi xóa.</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default memo(EmployeeView);
