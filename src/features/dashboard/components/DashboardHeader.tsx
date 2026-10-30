import React from 'react';
import { ChevronLeft, ChevronRight, Download, Plus } from 'lucide-react';
import Button from '@/components/ui/Button';

interface DashboardHeaderProps {
  weekLabel: string;
  onPrevWeek: () => void;
  onNextWeek: () => void;
  onToday: () => void;
  onOpenExport: () => void;
  onOpenCalendar: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  weekLabel,
  onPrevWeek,
  onNextWeek,
  onToday,
  onOpenExport,
  onOpenCalendar,
}) => (
  <header className="flex flex-col gap-4 border-b border-line pb-4 md:flex-row md:items-end md:justify-between">
    <div>
      <p className="font-mono text-mono-label text-ink-muted">{weekLabel}</p>
      <h1 className="mt-1 text-display text-ink">Bảng ca</h1>
    </div>
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          className="w-11 px-0"
          onClick={onPrevWeek}
          aria-label="Tuần trước"
        >
          <ChevronLeft size={16} aria-hidden="true" />
        </Button>
        <Button variant="outline" onClick={onToday}>
          Tuần này
        </Button>
        <Button variant="outline" className="w-11 px-0" onClick={onNextWeek} aria-label="Tuần sau">
          <ChevronRight size={16} aria-hidden="true" />
        </Button>
      </div>
      <Button variant="outline" onClick={onOpenExport} icon={<Download size={16} />}>
        Xuất báo cáo
      </Button>
      <Button onClick={onOpenCalendar} icon={<Plus size={16} />}>
        Xếp ca
      </Button>
    </div>
  </header>
);

export default DashboardHeader;
