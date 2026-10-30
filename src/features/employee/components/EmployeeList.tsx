import React, { memo } from 'react';
import { Users } from 'lucide-react';
import Button from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoadMore } from '@/components/ui/LoadMore';
import { Skeleton } from '@/components/ui/Skeleton';
import EmployeeRow from '@/features/employee/components/EmployeeRow';
import { Employee } from '@/types/index';

interface EmployeeListProps {
  loading: boolean;
  employees: Employee[];
  totalEmployees: number;
  searchTerm: string;
  visibleCount: number;
  onLoadMore: () => void;
  unpaidCounts: Record<string, number>;
  onEdit: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
  onDetail: (employee: Employee) => void;
  onClearSearch: () => void;
}

const GRID_CLASSES = 'lg:grid-cols-[minmax(0,1fr)_140px_120px_96px]';

const EmployeeList: React.FC<EmployeeListProps> = ({
  loading,
  employees,
  totalEmployees,
  searchTerm,
  visibleCount,
  onLoadMore,
  unpaidCounts,
  onEdit,
  onDelete,
  onDetail,
  onClearSearch,
}) => {
  const hasMore = employees.length > visibleCount;
  const hasSearch = searchTerm.trim().length > 0;

  return (
    <section className="border border-line bg-surface">
      <div
        className={`hidden gap-3 border-b border-line bg-surface-2 px-4 py-2 lg:grid ${GRID_CLASSES}`}
      >
        <span className="font-mono text-mono-label text-ink-muted">Nhân viên</span>
        <span className="font-mono text-mono-label text-ink-muted">Ngân hàng</span>
        <span className="font-mono text-mono-label text-ink-muted">Ca chưa trả</span>
        <span className="sr-only">Thao tác</span>
      </div>

      {loading ? (
        <div aria-busy="true" aria-label="Đang tải nhân viên">
          {Array.from({ length: 8 }, (_, index) => (
            <div
              key={index}
              className={`grid gap-2 border-b border-line px-4 py-3 last:border-b-0 ${GRID_CLASSES}`}
            >
              <div className="flex items-center gap-3">
                <Skeleton variant="circular" width={48} height={48} />
                <div className="space-y-1.5">
                  <Skeleton width={120} height={14} />
                  <Skeleton width={86} height={11} />
                </div>
              </div>
              <div className="hidden lg:block">
                <Skeleton width={58} height={22} />
              </div>
              <div className="hidden lg:block">
                <Skeleton width={48} height={14} />
              </div>
              <div className="hidden lg:block">
                <Skeleton width={72} height={16} />
              </div>
            </div>
          ))}
        </div>
      ) : employees.length === 0 ? (
        totalEmployees === 0 ? (
          <EmptyState
            icon={<Users size={24} aria-hidden="true" />}
            title="Chưa có nhân viên"
            description="Thêm nhân viên để bắt đầu xếp ca."
            className="min-h-[280px]"
          />
        ) : (
          <EmptyState
            icon={<Users size={24} aria-hidden="true" />}
            title="Không tìm thấy nhân viên"
            description="Thử tên hoặc số điện thoại khác."
            className="min-h-[280px]"
            action={
              hasSearch ? (
                <Button variant="outline" onClick={onClearSearch}>
                  Xóa tìm kiếm
                </Button>
              ) : undefined
            }
          />
        )
      ) : (
        <>
          {employees.slice(0, visibleCount).map((employee) => (
            <EmployeeRow
              key={employee.id}
              employee={employee}
              unpaidCount={unpaidCounts[employee.id] || 0}
              onEdit={onEdit}
              onDelete={onDelete}
              onDetail={onDetail}
            />
          ))}
          {hasMore && (
            <div className="border-t border-line p-3">
              <LoadMore
                currentCount={visibleCount}
                totalCount={employees.length}
                onLoadMore={onLoadMore}
                unit="nhân viên"
              />
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default memo(EmployeeList);
