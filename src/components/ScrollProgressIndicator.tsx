import React, { useState, useEffect } from "react";
import { motion, useScroll, useSpring } from "framer-motion";

export default function ScrollProgressIndicator() {
  const [scrollPercentage, setScrollPercentage] = useState(0);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    return scrollYProgress.onChange((latest) => {
      setScrollPercentage(Math.round(latest * 100));
    });
  }, [scrollYProgress]);

  // Dynamic gradient based on progress
  const getProgressGradient = () => {
    const progress = scrollPercentage;
    if (progress < 25) return "from-[#6C4DE6] to-[#7E57C2]";
    if (progress < 50) return "from-[#7E57C2] to-[#318FFD]";
    if (progress < 75) return "from-[#318FFD] to-[#08B150]";
    return "from-[#08B150] to-[#08B150]";
  };

  return (
    <>
      {/* Top Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 z-[100] origin-left"
        style={{ scaleX }}
      >
        <div className={`h-full bg-gradient-to-r ${getProgressGradient()} shadow-lg`} />
      </motion.div>

      {/* Circular Progress Indicator */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="fixed bottom-24 right-6 z-50 hidden md:block"
      >
        <div className="relative w-16 h-16">
          {/* Background Circle */}
          <svg className="absolute inset-0 transform -rotate-90" viewBox="0 0 64 64">
            <circle
              cx="32"
              cy="32"
              r="28"
              fill="none"
              stroke="#E4E7EB"
              strokeWidth="4"
            />
          </svg>
          
          {/* Progress Circle */}
          <svg className="absolute inset-0 transform -rotate-90" viewBox="0 0 64 64">
            <motion.circle
              cx="32"
              cy="32"
              r="28"
              fill="none"
              stroke="url(#progressGradient)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 28}`}
              style={{
                strokeDashoffset: useSpring(
                  scrollYProgress.get() === 0 
                    ? 2 * Math.PI * 28 
                    : 2 * Math.PI * 28 * (1 - scrollYProgress.get()),
                  { stiffness: 100, damping: 30 }
                )
              }}
            />
            <defs>
              <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6C4DE6" />
                <stop offset="50%" stopColor="#318FFD" />
                <stop offset="100%" stopColor="#08B150" />
              </linearGradient>
            </defs>
          </svg>

          {/* Center Content */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center">
              <motion.span
                key={scrollPercentage}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-xs font-bold text-[#6C4DE6]"
              >
                {scrollPercentage}%
              </motion.span>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}