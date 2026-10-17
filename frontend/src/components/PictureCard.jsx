import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

export function PictureCard({ 
  imageSrc, 
  title, 
  isSelected, 
  onClick, 
  className 
}) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.button
      type="button"
      onClick={onClick}
      className={twMerge(
        clsx(
          "relative flex flex-col items-center p-4 rounded-3xl border-2 transition-colors duration-200 w-full bg-surface aspect-square",
          isSelected ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
        ),
        className
      )}
      whileHover={shouldReduceMotion ? {} : { scale: 1.03, boxShadow: '0 10px 30px -4px rgba(0, 0, 0, 0.08)' }}
      whileTap={shouldReduceMotion ? {} : { scale: 0.97 }}
      animate={isSelected ? (shouldReduceMotion ? {} : { scale: [1, 1.06, 1] }) : {}}
      transition={{ duration: 0.3 }}
    >
      {/* Checkmark Icon for Selected State */}
      {isSelected && (
        <div className="absolute top-3 right-3 bg-primary text-white rounded-full p-1 shadow-md z-10">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <motion.path
              d="M5 13L9 17L19 7"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={shouldReduceMotion ? { pathLength: 1 } : { pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          </svg>
        </div>
      )}
      
      <div className="w-full flex-1 min-h-0 rounded-2xl overflow-hidden mb-3 bg-gray-100 flex items-center justify-center">
        {imageSrc ? (
          <img src={imageSrc} alt={title} className="w-full h-full object-cover" loading="lazy" />
        ) : (
          <div className="w-16 h-16 opacity-20" />
        )}
      </div>
      
      <span className="font-semibold text-text-primary text-center">
        {title}
      </span>
    </motion.button>
  );
}
