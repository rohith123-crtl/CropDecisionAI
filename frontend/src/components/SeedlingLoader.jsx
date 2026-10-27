import React, { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const MESSAGES = [
  'Analysing your soil profile…',
  'Checking seasonal conditions…',
  'Matching water requirements…',
  'Scoring crop suitability…',
  'Almost ready…',
];

export function SeedlingLoader({ className = 'w-28 h-28' }) {
  const shouldReduceMotion = useReducedMotion();
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex(i => (i + 1) % MESSAGES.length);
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  const stemVariants = shouldReduceMotion
    ? { initial: { pathLength: 1 }, animate: { pathLength: 1 } }
    : {
        initial: { pathLength: 0 },
        animate: {
          pathLength: 1,
          transition: { duration: 1.5, ease: 'easeInOut', repeat: Infinity, repeatType: 'reverse' },
        },
      };

  const leafLeftVariants = shouldReduceMotion
    ? { initial: { scale: 1, opacity: 1 }, animate: { scale: 1, opacity: 1 } }
    : {
        initial: { scale: 0, opacity: 0 },
        animate: {
          scale: 1,
          opacity: 1,
          transition: { delay: 0.5, duration: 1, ease: 'easeOut', repeat: Infinity, repeatType: 'reverse' },
        },
      };

  const leafRightVariants = shouldReduceMotion
    ? { initial: { scale: 1, opacity: 1 }, animate: { scale: 1, opacity: 1 } }
    : {
        initial: { scale: 0, opacity: 0 },
        animate: {
          scale: 1,
          opacity: 1,
          transition: { delay: 0.8, duration: 1, ease: 'easeOut', repeat: Infinity, repeatType: 'reverse' },
        },
      };

  return (
    <div className="flex flex-col items-center justify-center gap-6 py-12">
      {/* Animated plant */}
      <div className={`text-primary ${className}`}>
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full overflow-visible">
          {/* Glow */}
          <motion.circle
            cx="50" cy="85" r="18"
            fill="rgba(46, 125, 50, 0.08)"
            animate={shouldReduceMotion ? {} : { scale: [1, 1.3, 1], opacity: [0.5, 0.2, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
          {/* Soil */}
          <motion.line
            x1="20" y1="85" x2="80" y2="85"
            stroke="var(--color-earth)"
            strokeWidth="4"
            strokeLinecap="round"
            initial={shouldReduceMotion ? { pathLength: 1 } : { pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
          {/* Stem */}
          <motion.path
            d="M50 85 C50 60, 45 40, 50 20"
            stroke="currentColor"
            strokeWidth="6"
            strokeLinecap="round"
            fill="none"
            variants={stemVariants}
            initial="initial"
            animate="animate"
            style={{ originX: 0.5, originY: 1 }}
          />
          {/* Left Leaf */}
          <motion.path
            d="M48 50 C30 50, 20 40, 20 25 C30 25, 45 35, 48 50 Z"
            fill="currentColor"
            variants={leafLeftVariants}
            initial="initial"
            animate="animate"
            style={{ originX: 0.48, originY: 0.5 }}
          />
          {/* Right Leaf */}
          <motion.path
            d="M51 35 C70 35, 80 25, 80 10 C70 10, 55 20, 51 35 Z"
            fill="currentColor"
            variants={leafRightVariants}
            initial="initial"
            animate="animate"
            style={{ originX: 0.51, originY: 0.35 }}
          />
        </svg>
      </div>

      {/* Message */}
      <div className="text-center">
        <div className="font-bold text-text-primary text-lg mb-1">Finding best crops for you</div>
        <motion.div
          key={msgIndex}
          initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          className="text-sm text-text-secondary"
        >
          {MESSAGES[msgIndex]}
        </motion.div>
      </div>

      {/* Animated dots */}
      <div className="flex gap-2">
        {[0, 1, 2].map(i => (
          <motion.div
            key={i}
            className="w-2 h-2 rounded-full bg-primary"
            animate={shouldReduceMotion ? {} : { scale: [1, 1.5, 1], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.25, ease: 'easeInOut' }}
          />
        ))}
      </div>
    </div>
  );
}
