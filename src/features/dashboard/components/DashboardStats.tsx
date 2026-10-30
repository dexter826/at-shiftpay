import React, { memo } from 'react';
import { Calendar, TrendingUp, Users, Wallet, type LucideIcon } from 'lucide-react';
import { formatCurrency } from '@/utils/format';

interface DashboardStatsProps {
  stats: {
    totalEvents: number;
    todayEvents: number;
    weekEvents: number;
    totalShifts: number;
    morningShifts: number;
    afternoonShifts: number;
    totalEmployees: number;
    activeEmployees: number;
    totalEarned: number;
    advancedAmount: number;
    unpaidAmount: number;
  };
}

type StatKey = keyof DashboardStatsProps['stats'];

interface StatRow {
  label: string;
  key: StatKey | null;
  subtract?: boolean;
  currency?: boolean;
  color?: string;
}

interface StatCard {
  label: string;
  value: StatKey;
  icon: LucideIcon;
  isCurrency?: boolean;
  rows: StatRow[];
}

const cards: StatCard[] = [
  {
    label: 'Sự kiện',
    value: 'totalEvents',
    icon: Calendar,
    rows: [
      { label: 'Hôm nay', key: 'todayEvents' },
      { label: 'Tuần này', key: 'weekEvents' },
    ],
  },
  {
    label: 'Công',
    value: 'totalShifts',
    icon: TrendingUp,
    rows: [
      { label: 'Sáng', key: 'morningShifts' },
      { label: 'Chiều', key: 'afternoonShifts' },
    ],
  },
  {
    label: 'Nhân viên',
    value: 'totalEmployees',
    icon: Users,
    rows: [
      { label: 'Đã làm', key: 'activeEmployees' },
      { label: 'Chưa làm', key: null, subtract: true },
    ],
  },
  {
    label: 'Lương',
    value: 'totalEarned',
    icon: Wallet,
    isCurrency: true,
    rows: [
      { label: 'Đã ứng', key: 'advancedAmount', currency: true },
      { label: 'Cần trả', key: 'unpaidAmount', currency: true },
    ],
  },
];

const DashboardStats: React.FC<DashboardStatsProps> = memo(({ stats }) => (
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
    {cards.map((card) => {
      const Icon = card.icon;
      const mainValue = stats[card.value];
      return (
        <div key={card.label} className="p-3.5 bg-surface border border-line rounded-lg">
          <div className="flex items-center gap-2 mb-2.5">
            <div className="p-1.5 rounded-md bg-accent/10 text-accent-ink">
              <Icon size={14} />
            </div>
            <span className="text-[11px] font-medium text-ink-muted uppercase tracking-wider">
              {card.label}
            </span>
          </div>
          <p
            className={`text-xl font-bold text-ink tabular-nums mb-2.5 ${card.isCurrency ? 'text-accent-ink' : ''}`}
          >
            {card.isCurrency ? formatCurrency(mainValue) : mainValue}
          </p>
          <div className="pt-2 border-t border-line space-y-1">
            {card.rows.map((row) => {
              const val = row.subtract
                ? stats.totalEmployees - stats.activeEmployees
                : row.key
                  ? stats[row.key]
                  : 0;
              return (
                <div key={row.label} className="flex justify-between text-[11px]">
                  <span className="text-ink-soft">{row.label}</span>
                  <span className={`font-semibold tabular-nums ${row.color || 'text-ink'}`}>
                    {row.currency ? formatCurrency(val) : val}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      );
    })}
  </div>
));

export default DashboardStats;
