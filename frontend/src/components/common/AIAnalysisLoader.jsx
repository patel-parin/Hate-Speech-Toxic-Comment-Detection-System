import React, { useState, useEffect } from "react";
import { motion, useCycle } from "framer-motion";

const AIAnalysisLoader = () => {
  const [progress, setProgress] = useState(0);
  const [showStars, toggleStars] = useCycle(false, true);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 0 : prev + 2));
    }, 100);

    return () => clearInterval(interval);
  }, []);

  // Trigger star appearance every time brain pulses
  useEffect(() => {
    const pulseInterval = setInterval(() => {
      toggleStars();
    }, 1500);

    return () => clearInterval(pulseInterval);
  }, [toggleStars]);

  return (
    <div className="relative w-full h-80 flex flex-col items-center justify-center rounded-xl overflow-hidden">

      {/* CLEAN AI GRADIENT BACKGROUND */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0d1224] via-[#141a31] to-[#0d1224]" />

      {/* SOFT PARTICLE FIELD */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{ opacity: showStars ? 0.4 : 0.1 }}
        transition={{ duration: 1 }}
        style={{
          backgroundImage:
            "radial-gradient(white 1px, transparent 1px), radial-gradient(white 1px, transparent 1px)",
          backgroundSize: "5px 5px",
          backgroundPosition: "0 0, 2px 2px",
          filter: "blur(0.5px)",
        }}
      />

      {/* CENTER LOADER */}
      <div className="relative z-10 mb-8">
        <div className="relative w-28 h-28">

          {/* Subtle rotating ring */}
          <motion.div
            className="absolute inset-0 w-28 h-28 rounded-full border border-white/10"
            animate={{ rotate: 360 }}
            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
          />

          {/* Progress ring */}
          <svg className="w-28 h-28 transform -rotate-90" viewBox="0 0 128 128">
            <circle cx="64" cy="64" r="54" stroke="#2a3557" strokeWidth="6" fill="none" />
            <motion.circle
              cx="64"
              cy="64"
              r="54"
              stroke="#6ea8fe"
              strokeWidth="6"
              fill="none"
              strokeLinecap="round"
              animate={{ strokeDasharray: `${(progress / 100) * 339} 339` }}
              transition={{ duration: 0.12 }}
            />
          </svg>

          {/* Brain pulse + synchronized star fade */}
          <motion.div
  className="absolute inset-5 rounded-full bg-[#182033] flex items-center justify-center"
  animate={{
    scale: showStars ? 1.15 : 1,
  }}
  transition={{
    duration: 1.2,
    repeat: Infinity,
    ease: "easeInOut",
  }}
>

  {/* 🔵 Single Premium Loading Ring */}
 {[0, 1, 2].map((i) => (
    <motion.div
      key={i}
      className="absolute w-28 h-28 rounded-full border-2 border-blue-400/30"
      animate={{
        scale: [1, 1.4, 1.8],
        opacity: [0.8, 0.4, 0],
      }}
      transition={{
        duration: 2.2,
        repeat: Infinity,
        delay: i * 0.45, // stagger effect
        ease: "easeOut",
      }}
    />
  ))}

  {/* 🧠 Brain Icon */}
  <motion.span
    className="text-3xl relative z-10"
    animate={{
      scale: showStars ? [1, 1.15, 1] : [1, 0.95, 1],
      opacity: showStars ? 1 : 0.85,
    }}
    transition={{
      duration: 1.2,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  >
    🧠
  </motion.span>
</motion.div>

        </div>
      </div>

      {/* TEXT */}
      <div className="relative z-10 text-center">
        <motion.h2
          className="text-xl font-medium text-blue-300 mb-2"
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Analyzing...
        </motion.h2>

        <p className="text-gray-400 text-sm">This may take a few seconds</p>
      </div>
    </div>
  );
};

export default AIAnalysisLoader;
