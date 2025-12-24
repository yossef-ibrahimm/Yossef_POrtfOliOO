import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const LoadingScreen = ({ onLoadingComplete }) => {
  const [loadingStage, setLoadingStage] = useState("loading");
  const [progress, setProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Simulate loading progress
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

  // Transition from blocks to complete
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
      z: -100,
      filter: "blur(10px)",
    },
    visible: (i) => ({
      opacity: 1,
      scale: 1,
      rotateY: 0,
      z: 0,
      filter: "blur(0px)",
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
        delay: i * 0.1,
        duration: 1,
      }
    }),
    hover: {
      scale: 1.2,
      rotateY: 180,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    },
    code: (i) => ({
      opacity: [1, 0.5, 1],
      scale: [1, 0.98, 1],
      transition: {
        delay: i * 0.15,
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    })
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
          <GlowingOrbs isMobile={isMobile} />

          <AnimatePresence mode="wait">
            {loadingStage === "loading" && (
              <LoadingContent
                key="loading"
                name={name}
                letterVariants={letterVariants}
                progress={progress}
                isMobile={isMobile}
              />
            )}

            {loadingStage === "blocks" && (
              <BlocksTransition key="blocks" isMobile={isMobile} />
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ============================================
// Loading Content
// ============================================
const LoadingContent = ({ name, letterVariants, progress, isMobile }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 flex flex-col items-center justify-center z-50 px-4"
    >
      {/* Name with Advanced Letter Animation */}
      <div className="mb-12 md:mb-16 relative">
        {/* Code Particles Background - Reduced on mobile */}
        {!isMobile && (
          <div className="absolute inset-0 -z-10">
            {[...Array(12)].map((_, i) => (
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
                  delay: i * 0.15,
                  duration: 3,
                  repeat: Infinity,
                }}
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
              >
                {["{}", "[]", "</>", "=>", "//", "&&"][i % 6]}
              </motion.div>
            ))}
          </div>
        )}

        <div className="flex justify-center items-center gap-1 mb-4 md:mb-6 relative">
          {Array.from(name).map((letter, i) => (
            <motion.span
              key={i}
              custom={i}
              variants={letterVariants}
              initial="hidden"
              animate={["visible", "code"]}
              whileHover={!isMobile ? "hover" : undefined}
              className={`${isMobile ? 'text-5xl' : 'text-6xl md:text-8xl'} font-bold relative ${!isMobile ? 'cursor-pointer' : ''}`}
              style={{
                fontFamily: '"JetBrains Mono", "Fira Code", monospace',
                display: "inline-block",
                transformStyle: "preserve-3d",
              }}
            >
              {/* Matrix Effect - Only desktop */}
              {!isMobile && (
                <motion.span
                  className="absolute inset-0 opacity-20 text-green-400"
                  animate={{
                    opacity: [0.1, 0.3, 0.1],
                  }}
                  transition={{
                    delay: i * 0.2,
                    duration: 2,
                    repeat: Infinity,
                  }}
                >
                  {["0", "1", "{", "}", "<", ">"][i % 6]}
                </motion.span>
              )}
              
              {/* Main Letter with Gradient */}
              <span className="relative bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent"
                style={{
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {letter}
              </span>

              {/* Hex Code - Only desktop */}
              {!isMobile && (
                <motion.span
                  className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-xs text-purple-500/40 font-mono"
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
              )}
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
          <div className="flex items-center justify-center gap-2 mb-3 max-w-full overflow-hidden px-4">
            <motion.span
              className="text-green-400 text-sm font-mono flex-shrink-0"
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              ▶
            </motion.span>
            <motion.p
              className={`text-slate-400 ${isMobile ? 'text-xs' : 'text-sm md:text-base'} font-mono`}
              initial={{ width: 0 }}
              animate={{ width: "auto" }}
              transition={{ delay: 1, duration: 1.5 }}
            >
              <span className="text-purple-400">class</span>{" "}
              <span className="text-blue-400">Developer</span>{" "}
              <span className="text-slate-500">{"{"}</span>{" "}
              <span className="text-pink-400">design</span>
              <span className="text-slate-500">( )</span>{" "}
              <span className="text-slate-500">{"}"}</span>
            </motion.p>
          </div>
          
          <motion.div
            className={`${isMobile ? 'w-24' : 'w-32'} h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent mx-auto`}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 1.5, duration: 0.8 }}
          />
        </motion.div>
      </div>

      {/* Orbital Loader - Simplified on mobile */}
      <div className={`relative ${isMobile ? 'w-24 h-24 mb-8' : 'w-32 h-32 mb-12'}`}>
        {/* Center Dot */}
        <motion.div
          className={`absolute top-1/2 left-1/2 ${isMobile ? 'w-3 h-3 -mt-1.5 -ml-1.5' : 'w-4 h-4 -mt-2 -ml-2'} bg-gradient-to-r from-blue-500 to-purple-600 rounded-full`}
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

        {/* Orbiting Particles - Reduced on mobile */}
        {[0, 1].map((orbit) => (
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
              className={`absolute top-0 left-1/2 ${isMobile ? 'w-2 h-2 -ml-1' : 'w-3 h-3 -ml-1.5'} rounded-full`}
              style={{
                background: orbit === 0 
                  ? "linear-gradient(135deg, #3b82f6, #8b5cf6)"
                  : "linear-gradient(135deg, #ec4899, #3b82f6)",
              }}
              animate={{
                scale: [1, 1.5, 1],
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

        {/* Orbit Rings - Reduced on mobile */}
        {[0, 1].map((ring) => (
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

      {/* Progress Bar */}
      <motion.div
        className={`${isMobile ? 'w-64' : 'w-72'} max-w-full`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.6 }}
      >
        <div className="flex justify-between text-xs text-slate-400 mb-2 px-1">
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
        <div className="h-1.5 bg-slate-800/50 rounded-full overflow-hidden backdrop-blur-sm border border-slate-700/30">
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
        className="mt-6 md:mt-8 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <motion.p
          className={`text-slate-500 ${isMobile ? 'text-xs' : 'text-sm'}`}
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        >
          Preparing your experience...
        </motion.p>
      </motion.div>
    </motion.div>
  );
};

// ============================================
// Blocks Transition - Optimized
// ============================================
const BlocksTransition = ({ isMobile }) => {
  const cols = isMobile ? 4 : 6;
  const rows = isMobile ? 3 : 4;
  const totalBlocks = cols * rows;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 p-2"
    >
      <div 
        className="w-full h-full grid gap-2"
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
              className="rounded-xl relative overflow-hidden"
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
              {!isMobile && (
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
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

// ============================================
// Background Glowing Orbs - Optimized
// ============================================
const GlowingOrbs = ({ isMobile }) => (
  <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
    <motion.div
      className={`absolute top-[-20%] left-[-10%] ${isMobile ? 'w-[400px] h-[400px]' : 'w-[700px] h-[700px]'} bg-blue-500/20 rounded-full ${isMobile ? 'blur-[100px]' : 'blur-[150px]'}`}
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.15, 0.25, 0.15],
      }}
      transition={{ duration: isMobile ? 15 : 10, repeat: Infinity, ease: "easeInOut" }}
    />
    <motion.div
      className={`absolute bottom-[-15%] right-[-10%] ${isMobile ? 'w-[350px] h-[350px]' : 'w-[600px] h-[600px]'} bg-purple-500/15 rounded-full ${isMobile ? 'blur-[80px]' : 'blur-[120px]'}`}
      animate={{
        scale: [1, 1.15, 1],
        opacity: [0.12, 0.22, 0.12],
      }}
      transition={{
        duration: isMobile ? 18 : 12,
        repeat: Infinity,
        ease: "easeInOut",
        delay: 1,
      }}
    />
    {!isMobile && (
      <motion.div
        className="absolute top-[40%] right-[20%] w-[400px] h-[400px] bg-pink-500/10 rounded-full blur-[100px]"
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
    )}
  </div>
);

export default LoadingScreen;