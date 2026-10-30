import React, { memo } from 'react';

interface ChartTooltipEntry {
  name?: string;
  value?: number | string;
  color?: string;
  fill?: string;
  payload?: { fill?: string };
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: ChartTooltipEntry[];
  label?: string;
}

const ChartTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const isPieChart = !label;
    return (
      <div className="bg-surface-2 border border-line p-3 rounded-md z-50">
        {!isPieChart && <p className="text-label font-medium text-ink-soft mb-2">Ngày {label}</p>}
        <div className="space-y-1.5">
          {payload.map((entry: ChartTooltipEntry, index: number) => (
            <div key={index} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div
                  className="w-1.5 h-1.5 rounded-xs"
                  style={{ backgroundColor: entry.payload?.fill || entry.color || entry.fill }}
                />
                <span className="text-label font-medium text-ink">{entry.name}</span>
              </div>
              <span className="text-label font-semibold text-ink">
                {entry.value} {isPieChart ? 'công' : ''}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export default memo(ChartTooltip);
