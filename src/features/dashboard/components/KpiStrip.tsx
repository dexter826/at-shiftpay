import React from 'react';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/utils/format';
import type { WeekBoard } from '@/features/dashboard/dashboardData';

const KpiStrip: React.FC<{ kpis: WeekBoard['kpis'] }> = ({ kpis }) => {
  const cards = [
    { label: 'Sự kiện tuần', value: String(kpis.events), note: 'sự kiện' },
    { label: 'Ca đã xếp', value: String(kpis.shifts), note: 'ca làm' },
    { label: 'Lương dự kiến', value: formatCurrency(kpis.amount), note: 'trong tuần' },
    {
      label: 'Cần xếp',
      value: String(kpis.unassigned),
      note: kpis.unassigned > 0 ? 'sự kiện chưa có ca' : 'đã đủ người',
      highlight: true,
    },
  ];

  return (
    <section
      aria-label="Chỉ số tuần"
      className="grid grid-cols-2 gap-px border border-line border-t-2 border-t-ink bg-line md:grid-cols-4"
    >
      {cards.map((card) => (
        <div
          key={card.label}
          className={cn(
            'bg-surface px-3.5 py-3',
            card.highlight && 'bg-highlight text-highlight-ink'
          )}
        >
          <p
            className={cn(
              'font-mono text-mono-label',
              card.highlight ? 'text-highlight-ink/70' : 'text-ink-muted'
            )}
          >
            {card.label}
          </p>
          <p className="mt-0.5 font-mono text-data text-current">{card.value}</p>
          <p
            className={cn(
              'mt-0.5 text-label',
              card.highlight ? 'text-highlight-ink/70' : 'text-ink-muted'
            )}
          >
            {card.note}
          </p>
        </div>
      ))}
    </section>
  );
};

export default KpiStrip;
