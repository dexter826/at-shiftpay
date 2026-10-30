import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { DURATION_BASE, EASE_STANDARD } from '@/lib/motion';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'rectangular' | 'circular';
  width?: string | number;
  height?: string | number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'text',
  width,
  height,
}) => {
  // Nền cơ bản
  const baseClasses = `relative overflow-hidden bg-surface-2`;

  const variantClasses = {
    text: 'rounded-xs',
    rectangular: 'rounded-md',
    circular: 'rounded-full',
  };

  const prefersReducedMotion = useReducedMotion();

  const style = {
    width: width,
    height: height,
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: prefersReducedMotion ? 0 : DURATION_BASE,
        ease: EASE_STANDARD,
      }}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={style}
    >
      <div className="absolute inset-0 bg-ink/5 animate-shimmer" />
    </motion.div>
  );
};
