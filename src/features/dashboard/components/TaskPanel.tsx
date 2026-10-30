import React from 'react';
import { ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { cn, focusRingClasses } from '@/lib/utils';

interface TaskPanelProps {
  unassigned: number;
  unpaid: number;
  advanced: number;
  onOpenCalendar: () => void;
  onOpenPayroll: () => void;
}

const TaskPanel: React.FC<TaskPanelProps> = ({
  unassigned,
  unpaid,
  advanced,
  onOpenCalendar,
  onOpenPayroll,
}) => {
  const tasks = [
    {
      key: 'unassigned',
      count: unassigned,
      title: 'Sự kiện chưa xếp',
      description: 'Sự kiện trong tuần chưa có ca nào.',
      action: 'Mở lịch',
      onAction: onOpenCalendar,
    },
    {
      key: 'unpaid',
      count: unpaid,
      title: 'Ca chưa thanh toán',
      description: 'Ca trong tháng đang chờ chốt và trả lương.',
      action: 'Mở lương',
      onAction: onOpenPayroll,
    },
    {
      key: 'advanced',
      count: advanced,
      title: 'Ca đã ứng',
      description: 'Ca trong tháng đã ứng tiền, cần đối soát khi quyết toán.',
      action: 'Mở lương',
      onAction: onOpenPayroll,
    },
  ].filter((task) => task.count > 0);

  return (
    <aside className="border border-line bg-surface">
      <div className="border-b border-line px-3.5 py-3">
        <h2 className="text-title text-ink">Cần xử lý</h2>
      </div>

      {tasks.length === 0 ? (
        <div className="flex flex-col items-center gap-2 px-4 py-8 text-center">
          <CheckCircle2 size={24} className="text-success" aria-hidden="true" />
          <p className="text-body-sm font-medium text-ink">Không có việc cần xử lý</p>
          <p className="text-label text-ink-muted">
            Tuần này đã đủ người, tháng này không còn ca chờ thanh toán.
          </p>
        </div>
      ) : (
        <div>
          {tasks.map((task) => (
            <div key={task.key} className="border-b border-line px-3.5 py-3 last:border-b-0">
              <div className="flex items-baseline justify-between gap-3">
                <span className="font-mono text-title text-ink">{task.count}</span>
                <button
                  type="button"
                  onClick={task.onAction}
                  className={cn(
                    'inline-flex items-center gap-1 text-label font-medium text-accent-ink hover:underline',
                    focusRingClasses
                  )}
                >
                  {task.action}
                  <ArrowUpRight size={12} aria-hidden="true" />
                </button>
              </div>
              <p className="mt-1 text-body-sm font-medium text-ink">{task.title}</p>
              <p className="mt-0.5 text-label text-ink-muted">{task.description}</p>
            </div>
          ))}
        </div>
      )}
    </aside>
  );
};

export default TaskPanel;
