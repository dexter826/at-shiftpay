import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { cn, focusRingClasses } from '@/lib/utils';
import type { LocationSummaryRow } from '@/features/dashboard/dashboardData';

interface LocationSummaryProps {
  rows: LocationSummaryRow[];
  onOpenCalendar: () => void;
}

const LocationSummaryPanel: React.FC<LocationSummaryProps> = ({ rows, onOpenCalendar }) => {
  const topRows = rows.slice(0, 5);
  const maxEvents = Math.max(...topRows.map((row) => row.events), 1);

  return (
    <section className="min-w-0 border border-line bg-surface">
      <div className="flex items-center justify-between gap-3 border-b border-line px-3.5 py-3">
        <h2 className="text-title text-ink">Địa điểm tuần này</h2>
        <button
          type="button"
          onClick={onOpenCalendar}
          className={cn(
            'inline-flex items-center gap-1 text-label font-medium text-accent-ink hover:underline',
            focusRingClasses
          )}
        >
          Mở lịch
          <ArrowUpRight size={12} aria-hidden="true" />
        </button>
      </div>

      {topRows.length === 0 ? (
        <p className="px-3.5 py-8 text-center text-body-sm text-ink-muted">
          Chưa có địa điểm nào có sự kiện trong tuần.
        </p>
      ) : (
        <div>
          {topRows.map((row) => (
            <div key={row.id} className="border-b border-line px-3.5 py-2.5 last:border-b-0">
              <div className="flex items-baseline justify-between gap-3">
                <p className="truncate text-body-sm font-medium text-ink">{row.name}</p>
                <p className="shrink-0 font-mono text-mono-label text-ink-muted">
                  {row.events} sự kiện · {row.shifts} ca
                </p>
              </div>
              <div className="mt-1.5 h-1 bg-surface-2">
                <div
                  className="h-full bg-accent"
                  style={{ width: `${Math.round((row.events / maxEvents) * 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default LocationSummaryPanel;
