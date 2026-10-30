'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { DURATION_BASE } from '@/lib/motion';

interface TilesProps {
  className?: string;
  rows?: number;
  cols?: number;
  tileClassName?: string;
  tileSize?: 'sm' | 'md' | 'lg';
}

const tileSizes = {
  sm: 'w-8 h-8',
  md: 'w-9 h-9 md:w-12 md:h-12',
  lg: 'w-12 h-12 md:w-16 md:h-16',
};

export const Tiles = React.memo(
  ({ className, rows = 40, cols = 30, tileClassName, tileSize = 'md' }: TilesProps) => {
    const rowsArray = new Array(rows).fill(1);
    const colsArray = new Array(cols).fill(1);
    const prefersReducedMotion = useReducedMotion();

    return (
      <div className={cn('relative z-0 flex w-full h-full justify-center', className)}>
        {rowsArray.map((_, i) => (
          <div
            key={`row-${i}`}
            className={cn(tileSizes[tileSize], 'border-l border-line relative', tileClassName)}
          >
            {colsArray.map((_, j) => (
              <motion.div
                whileHover={
                  prefersReducedMotion
                    ? undefined
                    : {
                        backgroundColor: `var(--color-accent)`,
                        transition: { duration: 0 },
                      }
                }
                animate={{
                  transition: { duration: DURATION_BASE },
                }}
                key={`col-${j}`}
                className={cn(
                  tileSizes[tileSize],
                  'border-r border-t border-line relative',
                  tileClassName
                )}
              />
            ))}
          </div>
        ))}
      </div>
    );
  }
);

Tiles.displayName = 'Tiles';
