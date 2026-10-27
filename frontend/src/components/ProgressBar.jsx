import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export function ProgressBar({ progress, className }) {
  const shouldReduceMotion = useReducedMotion();
  const normalizedProgress = Math.min(100, Math.max(0, progress));

  return (
    <div className={`w-full rounded-full overflow-hidden bg-border h-2 ${className || ''}`}>
      <motion.div
        className="h-full rounded-full bg-gradient-to-r from-primary to-emerald-400"
        initial={shouldReduceMotion ? { width: `${normalizedProgress}%` } : { width: 0 }}
        animate={{ width: `${normalizedProgress}%` }}
        transition={
          shouldReduceMotion
            ? { duration: 0.1 }
            : { type: 'spring', stiffness: 120, damping: 20 }
        }
      />
    </div>
  );
}
