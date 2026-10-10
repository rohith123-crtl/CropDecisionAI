import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

export function ProgressBar({ progress, className }) {
  const shouldReduceMotion = useReducedMotion();
  
  // Ensure progress is between 0 and 100
  const normalizedProgress = Math.min(100, Math.max(0, progress));

  return (
    <div className={twMerge("w-full h-2 bg-border rounded-full overflow-hidden", className)}>
      <motion.div
        className="h-full bg-primary rounded-full"
        initial={shouldReduceMotion ? { width: `${normalizedProgress}%` } : { width: 0 }}
        animate={{ width: `${normalizedProgress}%` }}
        transition={
          shouldReduceMotion 
            ? { duration: 0.1 } 
            : { type: "spring", stiffness: 120, damping: 20 }
        }
      />
    </div>
  );
}
