import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef, useMemo, memo } from "react";

/* -------------------------------------------
  Parallax Section - Optimized
------------------------------------------- */
export const ParallaxSection = memo(({ children, className = "", speed = 0.5 }) => {
  const ref = useRef(null);
  
  const { scrollYProgress } = useScroll({ 
    target: ref, 
    offset: ["start end", "end start"] 
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const yRange = useMemo(() => [100 * speed, -100 * speed], [speed]);
  const y = useTransform(smoothProgress, [0, 1], yRange);

  return (
    <motion.div 
      ref={ref} 
      style={{ y, willChange: "transform" }} 
      className={className}
    >
      {children}
    </motion.div>
  );
});

ParallaxSection.displayName = "ParallaxSection";

/* -------------------------------------------
  Reveal On Scroll - Optimized & Fixed
------------------------------------------- */
export const RevealOnScroll = memo(({ 
  children, 
  className = "", 
  delay = 0, 
  direction = "up" 
}) => {
  const ref = useRef(null);
  
  const { scrollYProgress } = useScroll({ 
    target: ref, 
    offset: ["start 80%", "end 20%"] 
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // All transforms at top level - Fixed Hooks violation
  const baseStart = 0.05;
  const baseEnd = 0.95;
  const progressRange = useMemo(() => [0, baseStart, baseEnd, 1], []);
  
  const yUp = useTransform(smoothProgress, progressRange, [60, 0, 0, -60]);
  const yDown = useTransform(smoothProgress, progressRange, [-60, 0, 0, 60]);
  const xLeft = useTransform(smoothProgress, progressRange, [60, 0, 0, -60]);
  const xRight = useTransform(smoothProgress, progressRange, [-60, 0, 0, 60]);
  const neutral = useTransform(smoothProgress, [0, 1], [0, 0]);

  const opacity = useTransform(smoothProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0.2]);
  const scale = useTransform(smoothProgress, [0, 0.2, 0.8, 1], [0.95, 1, 1, 0.95]);

  // Select transforms based on direction
  const transforms = useMemo(() => {
    switch (direction) {
      case "up":
        return { y: yUp, x: neutral };
      case "down":
        return { y: yDown, x: neutral };
      case "left":
        return { x: xLeft, y: neutral };
      case "right":
        return { x: xRight, y: neutral };
      default:
        return { x: neutral, y: neutral };
    }
  }, [direction, yUp, yDown, xLeft, xRight, neutral]);

  return (
    <motion.div 
      ref={ref} 
      style={{ 
        opacity, 
        x: transforms.x, 
        y: transforms.y, 
        scale, 
        willChange: "transform, opacity" 
      }} 
      className={className}
    >
      {children}
    </motion.div>
  );
});

RevealOnScroll.displayName = "RevealOnScroll";

/* -------------------------------------------
  Depth Layer - Optimized
------------------------------------------- */
export const DepthLayer = memo(({ children, className = "", depth = 1 }) => {
  const ref = useRef(null);
  
  const { scrollYProgress } = useScroll({ 
    target: ref, 
    offset: ["start end", "end start"] 
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const yRange = useMemo(() => [50 * depth, -50 * depth], [depth]);
  const scaleRange = useMemo(() => [1 - 0.05 * depth, 1, 1 - 0.05 * depth], [depth]);

  const y = useTransform(smoothProgress, [0, 1], yRange);
  const scale = useTransform(smoothProgress, [0, 0.5, 1], scaleRange);

  return (
    <motion.div 
      ref={ref} 
      style={{ y, scale, willChange: "transform" }} 
      className={className}
    >
      {children}
    </motion.div>
  );
});

DepthLayer.displayName = "DepthLayer";

/* -------------------------------------------
  Loaders - Optimized with memo
------------------------------------------- */

// Shared size configurations (memoized)
const SIZE_CONFIGS = {
  container: { sm: "w-8 h-8", md: "w-12 h-12", lg: "w-16 h-16" },
  dot: { sm: "w-2 h-2", md: "w-3 h-3", lg: "w-4 h-4" },
  pulsing: { sm: "w-12 h-12", md: "w-16 h-16", lg: "w-20 h-20" },
  bar: {
    height: { sm: "h-6", md: "h-8", lg: "h-10" },
    width: { sm: "w-1", md: "w-2", lg: "w-3" }
  }
};

export const LoaderSpinningDots = memo(({ 
  size = "md", 
  className = "", 
  label = "Loading..." 
}) => {
  const containerVariants = useMemo(() => ({
    start: { opacity: 0 },
    end: { 
      opacity: 1, 
      transition: { staggerChildren: 0.1 } 
    }
  }), []);

  const dotVariants = useMemo(() => ({
    start: { y: 0 },
    end: { 
      y: -10, 
      transition: { 
        duration: 0.6, 
        repeat: Infinity, 
        repeatType: "reverse", 
        ease: "easeInOut" 
      } 
    }
  }), []);

  const dots = useMemo(() => [0, 1, 2], []);

  return (
    <div className={`flex flex-col items-center justify-center gap-4 ${className}`}>
      <motion.div 
        className={`flex justify-center items-end gap-2 ${SIZE_CONFIGS.container[size]}`}
        variants={containerVariants}
        initial="start"
        animate="end"
      >
        {dots.map((dot) => (
          <motion.div 
            key={dot}
            className={`${SIZE_CONFIGS.dot[size]} bg-primary rounded-full`}
            variants={dotVariants}
          />
        ))}
      </motion.div>
      {label && <p className="text-sm text-muted-foreground">{label}</p>}
    </div>
  );
});

LoaderSpinningDots.displayName = "LoaderSpinningDots";

export const LoaderCircular = memo(({ 
  size = "md", 
  className = "", 
  label = "Loading..." 
}) => {
  const spinTransition = useMemo(() => ({
    duration: 1.5,
    repeat: Infinity,
    ease: "linear"
  }), []);

  return (
    <div className={`flex flex-col items-center justify-center gap-4 ${className}`}>
      <motion.div 
        className={`${SIZE_CONFIGS.container[size]} border-4 border-primary/30 border-t-primary rounded-full`}
        animate={{ rotate: 360 }}
        transition={spinTransition}
      />
      {label && <p className="text-sm text-muted-foreground">{label}</p>}
    </div>
  );
});

LoaderCircular.displayName = "LoaderCircular";

export const LoaderPulsingCircles = memo(({ 
  size = "md", 
  className = "", 
  label = "Loading..." 
}) => {
  const circleVariants = useMemo(() => ({
    pulse: { 
      scale: [1, 1.2, 1],
      opacity: [1, 0.5, 1],
      transition: { 
        duration: 1.5, 
        repeat: Infinity, 
        ease: "easeInOut" 
      } 
    }
  }), []);

  const circles = useMemo(() => [0, 1, 2], []);

  return (
    <div className={`flex flex-col items-center justify-center gap-4 ${className}`}>
      <div className={`relative ${SIZE_CONFIGS.pulsing[size]}`}>
        {circles.map((c, i) => (
          <motion.div 
            key={c}
            className="absolute inset-0 border-2 border-primary rounded-full"
            variants={circleVariants}
            animate="pulse"
            transition={{ delay: i * 0.2 }}
          />
        ))}
      </div>
      {label && <p className="text-sm text-muted-foreground">{label}</p>}
    </div>
  );
});

LoaderPulsingCircles.displayName = "LoaderPulsingCircles";

export const LoaderWave = memo(({ 
  size = "md", 
  className = "", 
  label = "Loading..." 
}) => {
  const waveVariants = useMemo(() => ({
    start: { opacity: 0 },
    end: { 
      opacity: 1, 
      transition: { staggerChildren: 0.1 } 
    }
  }), []);

  const barVariants = useMemo(() => ({
    start: { scaleY: 0.5 },
    end: { 
      scaleY: [0.5, 1, 0.5],
      transition: { 
        duration: 0.8, 
        repeat: Infinity, 
        repeatType: "loop", 
        ease: "easeInOut" 
      } 
    }
  }), []);

  const bars = useMemo(() => [0, 1, 2, 3, 4], []);

  return (
    <div className={`flex flex-col items-center justify-center gap-4 ${className}`}>
      <motion.div 
        className="flex justify-center items-end gap-1"
        variants={waveVariants}
        initial="start"
        animate="end"
      >
        {bars.map((bar) => (
          <motion.div 
            key={bar}
            className={`${SIZE_CONFIGS.bar.width[size]} ${SIZE_CONFIGS.bar.height[size]} bg-primary rounded-full origin-bottom`}
            variants={barVariants}
          />
        ))}
      </motion.div>
      {label && <p className="text-sm text-muted-foreground">{label}</p>}
    </div>
  );
});

LoaderWave.displayName = "LoaderWave";

export const LoaderGradientSpinner = memo(({ 
  size = "md", 
  className = "", 
  label = "Loading..." 
}) => {
  const gradientTransition = useMemo(() => ({
    duration: 2,
    repeat: Infinity,
    ease: "linear"
  }), []);

  return (
    <div className={`flex flex-col items-center justify-center gap-4 ${className}`}>
      <motion.div 
        className={`${SIZE_CONFIGS.container[size]} rounded-full bg-gradient-to-r from-primary via-purple-500 to-primary bg-[length:200%_200%]`}
        animate={{ 
          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
          rotate: [0, 360]
        }}
        transition={gradientTransition}
      />
      {label && <p className="text-sm text-muted-foreground">{label}</p>}
    </div>
  );
});

LoaderGradientSpinner.displayName = "LoaderGradientSpinner";

/* -------------------------------------------
  Full Screen Loader - Optimized
------------------------------------------- */
export const FullScreenLoader = memo(({ 
  isVisible = true, 
  loaderType = "circular", 
  label = "Loading..." 
}) => {
  const loaderComponents = useMemo(() => ({
    "spinning-dots": <LoaderSpinningDots label={label} />,
    circular: <LoaderCircular label={label} />,
    "pulsing-circles": <LoaderPulsingCircles label={label} />,
    wave: <LoaderWave label={label} />,
    gradient: <LoaderGradientSpinner label={label} />
  }), [label]);

  const transition = useMemo(() => ({ duration: 0.3 }), []);

  if (!isVisible) return null;

  return (
    <motion.div 
      className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={transition}
    >
      {loaderComponents[loaderType]}
    </motion.div>
  );
});

FullScreenLoader.displayName = "FullScreenLoader";