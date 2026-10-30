import React from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { DURATION_BASE, EASE_STANDARD } from '@/lib/motion';

interface ValidationErrorProps {
  message: string;
}

export const ValidationError: React.FC<ValidationErrorProps> = ({ message }) => {
  const shouldReduceMotion = useReducedMotion();
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ height: 0, opacity: 0, marginTop: 0 }}
          animate={{ height: 'auto', opacity: 1, marginTop: 4 }}
          exit={{ height: 0, opacity: 0, marginTop: 0 }}
          transition={{ duration: shouldReduceMotion ? 0 : DURATION_BASE, ease: EASE_STANDARD }}
          className="overflow-hidden"
        >
          <p role="alert" className="text-danger text-body-sm ml-1">
            {message}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
