import React, { memo } from 'react';
import { focusRingOnSurfaceClasses } from '@/lib/utils';
import { motion } from 'framer-motion';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { Event, Location } from '@/types/index';
/* removed unused import from @/stores/themeStore */

interface CalendarDayProps {
  date: Date;
  events: Event[];
  locations: Location[];
  isSelected: boolean;
  isToday: boolean;
  isCurrentMonth: boolean;
  onClick: (date: Date) => void;
}

const CalendarDay: React.FC<CalendarDayProps> = ({
  date,
  events,
  locations,
  isSelected,
  isToday,
  isCurrentMonth,
  onClick,
}) => {
  // Using dateStr for key prop happens in parent

  return (
    <motion.button
      onClick={() => onClick(date)}
      whileHover={{ zIndex: 10 }}
      whileTap={{ scale: 0.95 }}
      className={`aspect-square lg:aspect-auto flex flex-col items-center justify-center rounded-sm text-body-sm transition-colors duration-fast ease-standard relative overflow-hidden ${focusRingOnSurfaceClasses} ${
        isSelected
          ? 'bg-accent text-on-accent'
          : isToday
            ? 'bg-surface-2 text-accent-ink font-semibold ring-2 ring-line'
            : `${isCurrentMonth ? 'text-ink' : 'text-ink-muted opacity-40'} hover:bg-surface-2`
      }`}
    >
      <span className="relative z-10">{date.getDate()}</span>

      {events.length > 0 && (
        <div className="absolute top-1 right-1 flex flex-col gap-0.5 pointer-events-none">
          {events.length > 1 && (
            <div
              className={`w-4 h-4 rounded-xs flex items-center justify-center text-label font-semibold ${isSelected ? 'bg-on-accent text-accent' : 'bg-accent text-on-accent'}`}
            >
              {events.length}
            </div>
          )}
        </div>
      )}

      {events.length > 0 && (
        <div className="flex flex-wrap justify-center gap-1 mt-1 px-1">
          {events.slice(0, 3).map((evt, i) => {
            const loc = locations.find((l) => l.id === evt.locationId);
            return (
              <div key={i} className="flex items-center">
                {loc?.review === 'high' ? (
                  <ThumbsUp size={10} className={isSelected ? 'text-on-accent' : 'text-success'} />
                ) : loc?.review === 'low' ? (
                  <ThumbsDown size={10} className={isSelected ? 'text-on-accent' : 'text-danger'} />
                ) : (
                  <div
                    className={`w-1.5 h-1.5 rounded-xs ${isSelected ? 'bg-on-accent/60' : 'bg-accent/60'}`}
                  />
                )}
              </div>
            );
          })}
          {events.length > 3 && (
            <div
              className={`w-1 h-1 rounded-xs ${isSelected ? 'bg-on-accent/40' : 'bg-ink-muted'}`}
            />
          )}
        </div>
      )}
    </motion.button>
  );
};

export default memo(CalendarDay);
