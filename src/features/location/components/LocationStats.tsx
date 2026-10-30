import React, { memo } from 'react';
import { MapPin, ThumbsUp, ThumbsDown } from 'lucide-react';

interface LocationStatsProps {
  stats: {
    total: number;
    high: number;
    low: number;
  };
}

const LocationStats: React.FC<LocationStatsProps> = ({ stats }) => {
  return (
    <div className="flex gap-2 shrink-0">
      <div
        className={`flex items-center gap-1.5 px-1.5 py-0.5 rounded-xs bg-surface-2 text-label font-medium text-ink-soft`}
      >
        <MapPin size={12} className="text-ink-muted" />
        <span>Tổng</span>
        <span className="tabular-nums text-ink">{stats.total}</span>
      </div>
      <div
        className={`flex items-center gap-1.5 px-1.5 py-0.5 rounded-xs bg-surface-2 text-label font-medium text-ink-soft`}
      >
        <ThumbsUp size={12} className="text-success" />
        <span>Tốt</span>
        <span className="tabular-nums text-ink">{stats.high}</span>
      </div>
      <div
        className={`flex items-center gap-1.5 px-1.5 py-0.5 rounded-xs bg-surface-2 text-label font-medium text-ink-soft`}
      >
        <ThumbsDown size={12} className="text-danger" />
        <span>Kém</span>
        <span className="tabular-nums text-ink">{stats.low}</span>
      </div>
    </div>
  );
};

export default memo(LocationStats);
