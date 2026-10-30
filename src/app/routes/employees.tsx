import React, { useState, useMemo, useEffect, memo } from 'react';
import { Employee, Shift } from '@/types/index';
import { employeeService } from '@/lib/api/employeeService';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/components/ui/ToastProvider';
import Button from '@/components/ui/Button';
import { useAuthStore } from '@/stores/authStore';

// Import extracted components
import EmployeeToolbar from '@/features/employee/components/EmployeeToolbar';
import EmployeeList from '@/features/employee/components/EmployeeList';
import EmployeeFormModal from '@/features/employee/components/EmployeeFormModal';
import EmployeeDetailModal from '@/features/employee/components/EmployeeDetailModal';

interface EmployeeViewProps {
  employees: Employee[];
  shifts: Shift[];
  events?: { id: string; date: string }[];
  loading?: boolean;
}

const EmployeeView: React.FC<EmployeeViewProps> = ({
  employees,
  shifts,  loading = false,
}) => {
  const { showToast } = useToast();
  const { user } = useAuthStore();
  const userId = user?.uid || '';

  // Tính công nợ trong tháng
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const shiftCountByEmployee = useMemo(() => {
    const counts: Record<string, number> = {};
    shifts.forEach((s) => {
      const d = new Date(s.date);
      if (
        d.getMonth() === currentMonth &&
        d.getFullYear() === currentYear &&
        s.status === 'unpaid'
      ) {
        counts[s.employeeId] = (counts[s.employeeId] || 0) + 1;
      }
    });
    return counts;
  }, [shifts, currentMonth, currentYear]);

  // Điều kiện xóa nhân viên
  const canDeleteEmployee = (empId: string): { canDelete: boolean; reason?: string } => {
    const today = new Date().toISOString().split('T')[0];
    const unpaidShifts = shifts.filter((s) => s.employeeId === empId && s.status === 'unpaid');
    if (unpaidShifts.length > 0)
      return {
        canDelete: false,
        reason: `Nhân viên còn ${unpaidShifts.length} công chưa thanh toán`,
      };
    const futureShifts = shifts.filter((s) => s.employeeId === empId && s.date >= today);
    if (futureShifts.length > 0)
      return {
        canDelete: false,
        reason: `Nhân viên đang có ${futureShifts.length} ca làm sắp tới`,
      };
    return { canDelete: true };
  };

  // State Management
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEmp, setEditingEmp] = useState<Employee | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'shifts' | 'recent'>('name');
  const [visibleCount, setVisibleCount] = useState(18);

  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isDeletingEmployee, setIsDeletingEmployee] = useState(false);

  // Effects
  useEffect(() => {
    setVisibleCount(18);
  }, [searchTerm, sortBy]);

  // Handlers
  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + 18, filteredAndSortedEmployees.length));
  };

  const openAddModal = () => {
    setEditingEmp(null);
    setModalOpen(true);
  };

  const openEditModal = (emp: Employee) => {
    setEditingEmp(emp);
    setModalOpen(true);
  };

  const openDetailModal = (emp: Employee) => {
    setSelectedEmployee(emp);
    setDetailModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    const { canDelete, reason } = canDeleteEmployee(id);
    if (!canDelete) {
      setDeleteError(reason || 'Không thể xóa nhân viên này');
      return;
    }
    setDeleteConfirm(id);
  };

  const confirmDelete = async () => {
    if (!deleteConfirm || isDeletingEmployee) return;

    setIsDeletingEmployee(true);
    try {
      await employeeService.deleteEmployee(deleteConfirm);
      showToast('Đã xóa nhân viên', 'success');
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Delete employee failed:', error);
      showToast('Không thể xóa nhân viên. Vui lòng thử lại', 'error');
    } finally {
      setIsDeletingEmployee(false);
    }
  };

  // Filter & Sort Logic
  const filteredAndSortedEmployees = useMemo(() => {
    const filtered = employees.filter(
      (e) => e.name.toLowerCase().includes(searchTerm.toLowerCase()) || e.phone.includes(searchTerm)
    );

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name, 'vi');
        case 'shifts': {
          const aShifts = shiftCountByEmployee[a.id] || 0;
          const bShifts = shiftCountByEmployee[b.id] || 0;
          return bShifts - aShifts;
        }
        case 'recent': {
          const aCreatedAt = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const bCreatedAt = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return bCreatedAt - aCreatedAt;
        }
        default:
          return 0;
      }
    });
  }, [employees, searchTerm, sortBy, shiftCountByEmployee]);

  return (
    <div className={`pb-28 md:pb-0 bg-[var(--bg-primary)] min-h-screen`}>
      <EmployeeToolbar
        employeeCount={employees.length}
        loading={loading}
        onAdd={openAddModal}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onClearSearch={() => setSearchTerm('')}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      <EmployeeList
        employees={filteredAndSortedEmployees}
        loading={loading}
        visibleCount={visibleCount}
        onLoadMore={handleLoadMore}
        shiftCounts={shiftCountByEmployee}
        onEdit={openEditModal}
        onDelete={handleDelete}
        onDetail={openDetailModal}
        searchTerm={searchTerm}
      />

      {/* Form Modal */}
      <EmployeeFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        editingEmployee={editingEmp}
        userId={userId}
      />

      {/* Modal xóa */}
      <Modal
        title="Xác nhận xóa"
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        footer={
          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={() => setDeleteConfirm(null)}
              className="flex-1"
              disabled={isDeletingEmployee}
            >
              Hủy
            </Button>
            <Button
              variant="danger"
              onClick={confirmDelete}
              className="flex-1"
              disabled={isDeletingEmployee}
            >
              {isDeletingEmployee ? 'Đang xóa...' : 'Xóa'}
            </Button>
          </div>
        }
      >
        <p className={`text-sm text-[var(--text-secondary)]`}>
          Bạn có chắc muốn xóa nhân viên này?
        </p>
      </Modal>

      {/* Lỗi xóa */}
      <Modal
        title="Không thể xóa"
        isOpen={!!deleteError}
        onClose={() => setDeleteError(null)}
        footer={
          <Button variant="secondary" onClick={() => setDeleteError(null)} fullWidth>
            Đã hiểu
          </Button>
        }
      >
        <p className={`text-sm text-[var(--text-secondary)]`}>{deleteError}</p>
      </Modal>

      {/* Chi tiết nhân viên */}
      <EmployeeDetailModal
        isOpen={detailModalOpen}
        onClose={() => {
          setDetailModalOpen(false);
          setSelectedEmployee(null);
        }}
        employee={selectedEmployee}
        onEditClick={(emp) => openEditModal(emp)}
      />
    </div>
  );
};

export default memo(EmployeeView);
