import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export function SeedlingLoader({ className = "w-24 h-24" }) {
  const shouldReduceMotion = useReducedMotion();

  // Simple fade for reduced motion, growing and swaying for normal motion
  const stemVariants = shouldReduceMotion 
    ? { initial: { pathLength: 1 }, animate: { pathLength: 1 } }
    : {
        initial: { pathLength: 0 },
        animate: { 
          pathLength: 1, 
          transition: { duration: 1.5, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" } 
        }
      };

  const leafLeftVariants = shouldReduceMotion 
    ? { initial: { scale: 1, opacity: 1 }, animate: { scale: 1, opacity: 1 } }
    : {
        initial: { scale: 0, opacity: 0 },
        animate: { 
          scale: 1, 
          opacity: 1, 
          transition: { delay: 0.5, duration: 1, ease: "easeOut", repeat: Infinity, repeatType: "reverse" } 
        }
      };
      
  const leafRightVariants = shouldReduceMotion 
    ? { initial: { scale: 1, opacity: 1 }, animate: { scale: 1, opacity: 1 } }
    : {
        initial: { scale: 0, opacity: 0 },
        animate: { 
          scale: 1, 
          opacity: 1, 
          transition: { delay: 0.8, duration: 1, ease: "easeOut", repeat: Infinity, repeatType: "reverse" } 
        }
      };

  return (
    <div className={`flex flex-col items-center justify-center text-primary ${className}`}>
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full overflow-visible">
        {/* Soil line */}
        <motion.line 
          x1="20" y1="85" x2="80" y2="85" 
          stroke="var(--color-earth)" 
          strokeWidth="4" 
          strokeLinecap="round"
          initial={shouldReduceMotion ? { pathLength: 1 } : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
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
      <motion.div 
        className="mt-4 font-medium text-text-secondary"
        animate={shouldReduceMotion ? {} : { opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        Finding best crops...
      </motion.div>
    </div>
  );
}
