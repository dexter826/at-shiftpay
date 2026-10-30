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
        className={`bg-surface border border-line px-3 py-1.5 rounded-lg flex items-center gap-2`}
        title="Tổng địa điểm"
      >
        <MapPin size={14} className="text-accent-ink" />
        <span className={`text-xs font-medium text-ink`}>{stats.total}</span>
      </div>
      <div
        className={`bg-surface border border-line px-3 py-1.5 rounded-lg flex items-center gap-2`}
        title="Đánh giá tốt"
      >
        <ThumbsUp size={14} className="text-green-500" />
        <span className={`text-xs font-medium text-ink`}>{stats.high}</span>
      </div>
      <div
        className={`bg-surface border border-line px-3 py-1.5 rounded-lg flex items-center gap-2`}
        title="Đánh giá kém"
      >
        <ThumbsDown size={14} className="text-red-500" />
        <span className={`text-xs font-medium text-ink`}>{stats.low}</span>
      </div>
    </div>
  );
};

export default memo(LocationStats);
