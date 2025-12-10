import React from "react";
import { motion, useInView } from "framer-motion";

export default function MilestoneMarker({ 
  children, 
  icon: Icon,
  gradient = "from-[#6C4DE6] to-[#7E57C2]"
}) {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { 
    once: true,
    margin: "-50px",
    amount: 0.5
  });

  return (
    <motion.div
      ref={ref}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={isInView ? { scale: 1, opacity: 1 } : {}}
      transition={{ 
        duration: 0.5,
        type: "spring",
        stiffness: 200,
        damping: 20
      }}
      className="relative"
    >
      {/* Glow Effect */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={isInView ? { 
          opacity: [0, 0.4, 0],
          scale: [0.5, 1.5, 2]
        } : {}}
        transition={{
          duration: 1.5,
          delay: 0.3,
          ease: "easeOut"
        }}
        className={`absolute inset-0 -z-10 rounded-2xl bg-gradient-to-br ${gradient} blur-2xl`}
      />

      {/* Pulse Ring */}
      {isInView && (
        <motion.div
          initial={{ scale: 1, opacity: 0.6 }}
          animate={{ 
            scale: [1, 1.2, 1.4],
            opacity: [0.6, 0.3, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeOut"
          }}
          className={`absolute inset-0 -z-10 rounded-2xl border-4 border-[#6C4DE6]`}
        />
      )}

      {/* Icon Badge */}
      {Icon && (
        <motion.div
          initial={{ rotate: -180, scale: 0 }}
          animate={isInView ? { rotate: 0, scale: 1 } : {}}
          transition={{
            delay: 0.2,
            duration: 0.6,
            type: "spring",
            stiffness: 200
          }}
          className={`absolute -top-4 -right-4 w-12 h-12 rounded-full bg-gradient-to-br ${gradient} shadow-xl flex items-center justify-center z-10`}
        >
          <Icon className="w-6 h-6 text-white" />
        </motion.div>
      )}

      {children}
    </motion.div>
  );
}