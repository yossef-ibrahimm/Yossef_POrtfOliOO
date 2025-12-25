import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";


const LoadingScreen = ({ onLoadingComplete }) => {
  const [loadingStage, setLoadingStage] = useState("loading"); // "loading", "blocks", "complete"
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setLoadingStage("blocks"), 500);
          return 100;
        }
        return prev + Math.random() * 12;
      });
    }, 300);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (loadingStage === "blocks") {
      setTimeout(() => {
        setLoadingStage("complete");
        setTimeout(() => onLoadingComplete?.(), 500);
      }, 2000);
    }
  }, [loadingStage, onLoadingComplete]);

  const name = "Youssef";

  const letterVariants = {
    hidden: {
      opacity: 0,
      scale: 0,
      rotateY: -90,
      rotateX: 90,
      z: -200,
      filter: "blur(10px)",
    },
    visible: (i) => ({
      opacity: 1,
      scale: 1,
      rotateY: 0,
      rotateX: 0,
      z: 0,
      filter: "blur(0px)",
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
        delay: i * 0.1,
        duration: 1,
      },
    }),
    hover: {
      scale: 1.3,
      rotateY: 360,
      z: 50,
      textShadow:
        "0 0 30px rgba(139, 92, 246, 0.8), 0 0 60px rgba(139, 92, 246, 0.5)",
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
    code: (i) => ({
      opacity: [1, 0.3, 1],
      scale: [1, 0.95, 1.05, 1],
      rotateY: [0, 5, -5, 0],
      textShadow: [
        "0 0 10px rgba(59, 130, 246, 0.5), 0 0 20px rgba(139, 92, 246, 0.3)",
        "0 0 20px rgba(139, 92, 246, 0.7), 0 0 40px rgba(236, 72, 153, 0.5)",
        "0 0 10px rgba(59, 130, 246, 0.5), 0 0 20px rgba(139, 92, 246, 0.3)",
      ],
      transition: {
        delay: i * 0.15,
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      },
    }),
  };

  return (
    <AnimatePresence mode="wait">
      {loadingStage !== "complete" && (
        <motion.div
          key="loading-wrapper"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden z-50"
        >
          <GlowingOrbs />

          <AnimatePresence mode="wait">
            {loadingStage === "loading" && (
              <LoadingContent
                key="loading"
                name={name}
                letterVariants={letterVariants}
                progress={progress}
              />
            )}

            {loadingStage === "blocks" && <BlocksTransition key="blocks" />}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const LoadingContent = ({ name, letterVariants, progress }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 flex flex-col items-center justify-center z-50 px-4"
    >
      {/* Name with Advanced Letter Animation */}
      <div className="mb-8 sm:mb-16 relative">
        {/* Code Particles Background - Hidden on mobile for performance */}
        <div className="absolute inset-0 -z-10 hidden sm:block">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-xs text-purple-500/20 font-mono"
              initial={{
                x: Math.random() * 100 - 50,
                y: Math.random() * 100 - 50,
                opacity: 0,
              }}
              animate={{
                x: Math.random() * 200 - 100,
                y: Math.random() * 200 - 100,
                opacity: [0, 0.5, 0],
              }}
              transition={{
                delay: i * 0.1,
                duration: 3,
                repeat: Infinity,
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            >
              {["{}", "[]", "</>", "( )", "=>", "//", "/*", "*/", "&&", "||"][i % 10]}
            </motion.div>
          ))}
        </div>

        {/* Mobile-only floating code symbols */}
        <div className="absolute inset-0 -z-10 sm:hidden">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-[10px] text-purple-500/30 font-mono"
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0, 0.4, 0],
                y: [-10, -30],
              }}
              transition={{
                delay: i * 0.2,
                duration: 2.5,
                repeat: Infinity,
              }}
              style={{
                left: `${10 + i * 12}%`,
                top: `${20 + (i % 3) * 20}%`,
              }}
            >
              {["</>", "{}", "=>", "[ ]"][i % 4]}
            </motion.div>
          ))}
        </div>

        <div className="flex justify-center items-center gap-0.5 sm:gap-1 mb-4 sm:mb-6 relative">
          {Array.from(name).map((letter, i) => (
            <motion.span
              key={i}
              custom={i}
              variants={letterVariants}
              initial="hidden"
              animate={["visible", "code"]}
              whileHover="hover"
              className="text-4xl xs:text-5xl sm:text-6xl md:text-8xl font-bold relative cursor-pointer"
              style={{
                fontFamily: '"JetBrains Mono", "Fira Code", monospace',
                display: "inline-block",
                transformStyle: "preserve-3d",
                perspective: "1000px",
              }}
            >
              {/* Matrix/Code Effect Background */}
              <motion.span
                className="absolute inset-0 opacity-20 text-green-400 hidden sm:block"
                animate={{
                  opacity: [0.1, 0.3, 0.1],
                }}
                transition={{
                  delay: i * 0.2,
                  duration: 2,
                  repeat: Infinity,
                }}
              >
                {["0", "1", "{", "}", "<", ">", "/", "\\"][i % 8]}
              </motion.span>

              {/* Main Letter with Gradient */}
              <span
                className="relative bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent"
                style={{
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {letter}
              </span>

              {/* Glitch Effect on Hover - Desktop only */}
              <motion.span
                className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-blue-600 bg-clip-text text-transparent hidden sm:block"
                style={{
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  clipPath: "polygon(0 0, 100% 0, 100% 45%, 0 45%)",
                }}
                initial={{ opacity: 0, x: 0 }}
                whileHover={{
                  opacity: [0, 1, 0],
                  x: [-2, 2, -2],
                  transition: { duration: 0.3, repeat: 2 },
                }}
              >
                {letter}
              </motion.span>

              {/* Binary/Hex Code Trail - Desktop only */}
              <motion.span
                className="absolute -bottom-3 sm:-bottom-4 left-1/2 -translate-x-1/2 text-[8px] sm:text-xs text-purple-500/40 font-mono hidden sm:block"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.6, 0] }}
                transition={{
                  delay: i * 0.1 + 0.5,
                  duration: 2,
                  repeat: Infinity,
                }}
              >
                0x{letter.charCodeAt(0).toString(16)}
              </motion.span>
            </motion.span>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="text-center relative"
        >
          {/* Terminal-style subtitle */}
          <div className="flex items-center justify-center gap-2 mb-3 max-w-full px-2">
            <motion.span
              className="text-green-400 text-xs sm:text-sm font-mono"
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              ▶
            </motion.span>
            <motion.p
              className="text-slate-400 text-[10px] xs:text-xs sm:text-sm md:text-base font-mono truncate"
              initial={{ width: 0 }}
              animate={{ width: "auto" }}
              transition={{ delay: 1, duration: 1.5 }}
            >
              <span className="text-purple-400">class</span>{" "}
              <span className="text-blue-400">Developer</span>{" "}
              <span className="text-slate-500 hidden xs:inline">{"{"}</span>{" "}
              <span className="text-pink-400 hidden xs:inline">design</span>
              <span className="text-slate-500 hidden xs:inline">( )</span>{" "}
              <span className="text-slate-500 hidden xs:inline">{"}"}</span>
            </motion.p>
          </div>

          <motion.div
            className="w-20 sm:w-32 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent mx-auto"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 1.5, duration: 0.8 }}
          />
        </motion.div>
      </div>

      {/* Orbital Loader - Responsive sizing */}
      <div className="relative w-20 h-20 sm:w-32 sm:h-32 mb-8 sm:mb-12">
        {/* Center Dot */}
        <motion.div
          className="absolute top-1/2 left-1/2 w-2.5 h-2.5 sm:w-4 sm:h-4 -mt-1.5 -ml-1.5 sm:-mt-2 sm:-ml-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
          animate={{
            scale: [1, 1.4, 1],
            boxShadow: [
              "0 0 20px rgba(139, 92, 246, 0.5)",
              "0 0 40px rgba(139, 92, 246, 0.8)",
              "0 0 20px rgba(139, 92, 246, 0.5)",
            ],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Orbiting Particles */}
        {[0, 1, 2].map((orbit) => (
          <motion.div
            key={orbit}
            className="absolute inset-0"
            animate={{ rotate: 360 }}
            transition={{
              duration: 3 - orbit * 0.5,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <motion.div
              className="absolute top-0 left-1/2 w-2 h-2 sm:w-3 sm:h-3 -ml-1 sm:-ml-1.5 rounded-full"
              style={{
                background:
                  orbit === 0
                    ? "linear-gradient(135deg, #3b82f6, #8b5cf6)"
                    : orbit === 1
                    ? "linear-gradient(135deg, #8b5cf6, #ec4899)"
                    : "linear-gradient(135deg, #ec4899, #3b82f6)",
              }}
              animate={{
                scale: [1, 1.5, 1],
                boxShadow: [
                  "0 0 15px currentColor",
                  "0 0 30px currentColor",
                  "0 0 15px currentColor",
                ],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: orbit * 0.3,
              }}
            />
          </motion.div>
        ))}

        {/* Orbit Rings */}
        {[0, 1, 2].map((ring) => (
          <motion.div
            key={`ring-${ring}`}
            className="absolute inset-0 border border-slate-700/30 rounded-full"
            style={{
              width: `${100 + ring * 15}%`,
              height: `${100 + ring * 15}%`,
              left: `${-7.5 * ring}%`,
              top: `${-7.5 * ring}%`,
            }}
            animate={{
              opacity: [0.2, 0.5, 0.2],
              scale: [1, 1.02, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: ring * 0.3,
            }}
          />
        ))}
      </div>

      {/* Progress Bar - Responsive width */}
      <motion.div
        className="w-56 sm:w-72 max-w-[85%]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.6 }}
      >
        <div className="flex justify-between text-[10px] sm:text-xs text-slate-400 mb-2 px-1">
          <span>Loading Experience</span>
          <motion.span
            key={Math.round(progress)}
            initial={{ scale: 1.3, color: "#8b5cf6" }}
            animate={{ scale: 1, color: "#94a3b8" }}
            transition={{ duration: 0.2 }}
          >
            {Math.round(progress)}%
          </motion.span>
        </div>
        <div className="h-1 sm:h-1.5 bg-slate-800/50 rounded-full overflow-hidden backdrop-blur-sm border border-slate-700/30">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 relative"
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
              animate={{ x: ["-100%", "200%"] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            />
          </motion.div>
        </div>
      </motion.div>

      {/* Loading Message */}
      <motion.div
        className="mt-6 sm:mt-8 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <motion.p
          className="text-slate-500 text-xs sm:text-sm"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        >
          Preparing your experience...
        </motion.p>
      </motion.div>

      {/* Mobile artistic touch - Floating dots */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-3 sm:hidden">
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.div
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
            animate={{
              y: [0, -8, 0],
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              delay: i * 0.15,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </motion.div>
  );
};

const BlocksTransition = () => {
  // Responsive grid - fewer blocks on mobile
  const cols = typeof window !== 'undefined' && window.innerWidth < 640 ? 4 : 6;
  const rows = typeof window !== 'undefined' && window.innerWidth < 640 ? 6 : 4;
  const totalBlocks = cols * rows;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 p-1.5 sm:p-2"
    >
      <div
        className="w-full h-full grid gap-1.5 sm:gap-2"
        style={{
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gridTemplateRows: `repeat(${rows}, 1fr)`,
        }}
      >
        {[...Array(totalBlocks)].map((_, index) => {
          const row = Math.floor(index / cols);
          const col = index % cols;
          const distanceFromCenter = Math.sqrt(
            Math.pow(col - cols / 2, 2) + Math.pow(row - rows / 2, 2)
          );

          return (
            <motion.div
              key={index}
              className="rounded-lg sm:rounded-xl relative overflow-hidden"
              style={{
                background: `linear-gradient(135deg, 
                  rgba(59, 130, 246, ${0.3 - distanceFromCenter * 0.03}), 
                  rgba(139, 92, 246, ${0.25 - distanceFromCenter * 0.025}), 
                  rgba(236, 72, 153, ${0.2 - distanceFromCenter * 0.02}))`,
              }}
              initial={{
                scale: 0,
                opacity: 0,
                rotate: -180,
              }}
              animate={{
                scale: 1,
                opacity: 1,
                rotate: 0,
              }}
              exit={{
                scale: 0,
                opacity: 0,
                rotate: 180,
              }}
              transition={{
                delay: distanceFromCenter * 0.05,
                duration: 0.6,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"
                animate={{
                  opacity: [0.2, 0.5, 0.2],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: distanceFromCenter * 0.1,
                }}
              />
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

const GlowingOrbs = () => (
  <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
    {/* Main orb - smaller on mobile */}
    <motion.div
      className="absolute top-[-20%] left-[-10%] w-[400px] sm:w-[700px] h-[400px] sm:h-[700px] bg-blue-500/20 rounded-full blur-[100px] sm:blur-[150px]"
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.15, 0.25, 0.15],
        x: [0, 50, 0],
        y: [0, 30, 0],
      }}
      transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
    />
    <motion.div
      className="absolute bottom-[-15%] right-[-10%] w-[350px] sm:w-[600px] h-[350px] sm:h-[600px] bg-purple-500/15 rounded-full blur-[80px] sm:blur-[120px]"
      animate={{
        scale: [1, 1.15, 1],
        opacity: [0.12, 0.22, 0.12],
        x: [0, -40, 0],
        y: [0, -20, 0],
      }}
      transition={{
        duration: 12,
        repeat: Infinity,
        ease: "easeInOut",
        delay: 1,
      }}
    />
    <motion.div
      className="absolute top-[40%] right-[20%] w-[250px] sm:w-[400px] h-[250px] sm:h-[400px] bg-pink-500/10 rounded-full blur-[60px] sm:blur-[100px]"
      animate={{
        scale: [1, 1.3, 1],
        opacity: [0.08, 0.15, 0.08],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut",
        delay: 2,
      }}
    />
    
    {/* Mobile artistic touch - subtle scan line effect */}
    <motion.div
      className="absolute inset-0 sm:hidden"
      style={{
        background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(139, 92, 246, 0.03) 2px, rgba(139, 92, 246, 0.03) 4px)",
      }}
      animate={{ y: [0, 4, 0] }}
      transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }}
    />
  </div>
);

export default LoadingScreen;
