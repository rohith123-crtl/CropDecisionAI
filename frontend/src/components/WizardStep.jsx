import React from 'react';
import { motion } from 'framer-motion';

export function WizardStep({ children, direction = 1, isActive = true }) {
  const variants = {
    enter: (dir) => ({
      x: dir > 0 ? 24 : -24,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (dir) => ({
      zIndex: 0,
      x: dir < 0 ? 24 : -24,
      opacity: 0
    })
  };

  return (
    <motion.div
      custom={direction}
      variants={variants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{
        x: { type: "tween", duration: 0.3, ease: "easeOut" },
        opacity: { duration: 0.3, ease: "easeOut" }
      }}
      className="w-full flex-1 flex flex-col"
    >
      {children}
    </motion.div>
  );
}
