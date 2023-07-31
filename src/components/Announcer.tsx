"use client"
import { motion } from 'framer-motion';
import React from 'react';
import ConfettiExplosion from 'react-confetti-explosion';

export interface AnnouncerProps {
  complete?(): void,
  value: string
}

const Announcer = ({ complete, value }: AnnouncerProps) => {
  const dur = 2;
  return (
    <motion.div className='fixed top-0 left-0 w-full h-full flex items-center justify-center z-10 text-center'
      initial={{ backgroundColor: "rgba(0, 0, 0, 0)" }}
      animate={{ backgroundColor: ["rgba(0, 0, 0, 0)", "rgba(0, 0, 0, 0.5)", "rgba(0, 0, 0, 0.5)", "rgba(0, 0, 0, 0)"] }}
      transition={{
        ease: "easeIn",
        duration: dur
      }}
    >
      <motion.div
        className='absolute hidden transform -translate-x-1/2 -translate-y-1/2 text-9xl font-concert-one codename w-full'
        initial={{ display: "block" }}
        animate={{ left: ["175%", "55%", "45%", "-75%"] }}
        transition={{
          ease: "easeOut",
          bounce: 0,
          duration: dur
        }}
        onAnimationComplete={() => complete && complete()}
      >
        {value.toLocaleUpperCase()}
      </motion.div>
      <ConfettiExplosion force={0.8} duration={2000} particleCount={150} width={1600} />
    </motion.div>
  );
};

export default Announcer;