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
        className={`flex items-center gap-1.5 px-1.5 py-0.5 rounded-xs bg-surface border border-line text-label font-medium text-ink`}
      >
        <span className="sr-only">Tổng địa điểm</span>
        <MapPin size={12} className="text-accent-ink" />
        <span className="tabular-nums">{stats.total}</span>
      </div>
      <div
        className={`flex items-center gap-1.5 px-1.5 py-0.5 rounded-xs bg-surface border border-line text-label font-medium text-ink`}
      >
        <span className="sr-only">Đánh giá tốt</span>
        <ThumbsUp size={12} className="text-success" />
        <span className="tabular-nums">{stats.high}</span>
      </div>
      <div
        className={`flex items-center gap-1.5 px-1.5 py-0.5 rounded-xs bg-surface border border-line text-label font-medium text-ink`}
      >
        <span className="sr-only">Đánh giá kém</span>
        <ThumbsDown size={12} className="text-danger" />
        <span className="tabular-nums">{stats.low}</span>
      </div>
    </div>
  );
};

export default memo(LocationStats);
