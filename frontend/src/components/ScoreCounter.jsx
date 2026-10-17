import React, { useEffect, useState } from 'react';
import { motion, useReducedMotion, animate } from 'framer-motion';

export function ScoreCounter({ value, className }) {
  const shouldReduceMotion = useReducedMotion();
  const [displayValue, setDisplayValue] = useState(shouldReduceMotion ? value : 0);

  useEffect(() => {
    if (shouldReduceMotion) {
      setDisplayValue(value);
      return;
    }

    const controls = animate(0, value, {
      duration: 0.9,
      ease: "easeOut",
      onUpdate: (latest) => {
        setDisplayValue(Math.round(latest));
      }
    });

    return () => controls.stop();
  }, [value, shouldReduceMotion]);

  return (
    <motion.span 
      className={className}
      initial={shouldReduceMotion ? { opacity: 0 } : {}}
      animate={shouldReduceMotion ? { opacity: 1 } : {}}
    >
      {displayValue}
    </motion.span>
  );
}
