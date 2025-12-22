import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

/* -------------------------------------------
  Parallax Section
------------------------------------------- */
export const ParallaxSection = ({ children, className = "", speed = 0.5 }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [100 * speed, -100 * speed]);

  return (
    <motion.div ref={ref} style={{ y, willChange: "transform" }} className={className}>
      {children}
    </motion.div>
  );
};

/* -------------------------------------------
  Reveal On Scroll
------------------------------------------- */
export const RevealOnScroll = ({ children, className = "", delay = 0, direction = "up" }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 80%", "end 20%"] });

  const getTransformRange = () => {
    const baseStart = 0.05;
    const baseEnd = 0.95;

    switch (direction) {
      case "up":
        return {
          y: useTransform(scrollYProgress, [0, baseStart, baseEnd, 1], [60, 0, 0, -60], { clamp: false }),
          x: useTransform(scrollYProgress, [0, 1], [0, 0])
        };
      case "down":
        return {
          y: useTransform(scrollYProgress, [0, baseStart, baseEnd, 1], [-60, 0, 0, 60], { clamp: false }),
          x: useTransform(scrollYProgress, [0, 1], [0, 0])
        };
      case "left":
        return {
          x: useTransform(scrollYProgress, [0, baseStart, baseEnd, 1], [60, 0, 0, -60], { clamp: false }),
          y: useTransform(scrollYProgress, [0, 1], [0, 0])
        };
      case "right":
        return {
          x: useTransform(scrollYProgress, [0, baseStart, baseEnd, 1], [-60, 0, 0, 60], { clamp: false }),
          y: useTransform(scrollYProgress, [0, 1], [0, 0])
        };
    }
  };

  const transforms = getTransformRange();
  const opacity = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0.2], { clamp: false });
  const scale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.95, 1, 1, 0.95], { clamp: false });

  return (
    <motion.div ref={ref} style={{ opacity, x: transforms.x, y: transforms.y, scale, willChange: "transform, opacity" }} className={className}>
      {children}
    </motion.div>
  );
};

/* -------------------------------------------
  Depth Layer
------------------------------------------- */
export const DepthLayer = ({ children, className = "", depth = 1 }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });

  const y = useTransform(scrollYProgress, [0, 1], [50 * depth, -50 * depth], { clamp: false });
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1 - 0.05 * depth, 1, 1 - 0.05 * depth], { clamp: false });

  return (
    <motion.div ref={ref} style={{ y, scale, willChange: "transform" }} className={className}>
      {children}
    </motion.div>
  );
};

/* -------------------------------------------
  Loaders (all variants)
------------------------------------------- */
export const LoaderSpinningDots = ({ size = "md", className = "", label = "Loading..." }) => {
  const sizeClasses = { sm: "w-8 h-8", md: "w-12 h-12", lg: "w-16 h-16" };
  const dotSize = { sm: "w-2 h-2", md: "w-3 h-3", lg: "w-4 h-4" };

  const containerVariants = { start: { opacity: 0 }, end: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const dotVariants = { start: { y: 0 }, end: { y: -10, transition: { duration: 0.6, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" } } };

  return (
    <div className={`flex flex-col items-center justify-center gap-4 ${className}`}>
      <motion.div className={`flex justify-center items-end gap-2 ${sizeClasses[size]}`} variants={containerVariants} initial="start" animate="end">
        {[0, 1, 2].map((dot) => <motion.div key={dot} className={`${dotSize[size]} bg-primary rounded-full`} variants={dotVariants} />)}
      </motion.div>
      {label && <p className="text-sm text-muted-foreground">{label}</p>}
    </div>
  );
};

export const LoaderCircular = ({ size = "md", className = "", label = "Loading..." }) => {
  const sizeClasses = { sm: "w-8 h-8", md: "w-12 h-12", lg: "w-16 h-16" };
  return (
    <div className={`flex flex-col items-center justify-center gap-4 ${className}`}>
      <motion.div className={`${sizeClasses[size]} border-4 border-primary/30 border-t-primary rounded-full`} animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }} />
      {label && <p className="text-sm text-muted-foreground">{label}</p>}
    </div>
  );
};

export const LoaderPulsingCircles = ({ size = "md", className = "", label = "Loading..." }) => {
  const sizeClasses = { sm: "w-12 h-12", md: "w-16 h-16", lg: "w-20 h-20" };
  const circleVariants = { pulse: { scale: [1, 1.2, 1], opacity: [1, 0.5, 1], transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut" } } };
  return (
    <div className={`flex flex-col items-center justify-center gap-4 ${className}`}>
      <div className={`relative ${sizeClasses[size]}`}>
        {[0, 1, 2].map((c, i) => <motion.div key={c} className="absolute inset-0 border-2 border-primary rounded-full" variants={circleVariants} animate="pulse" transition={{ delay: i * 0.2 }} />)}
      </div>
      {label && <p className="text-sm text-muted-foreground">{label}</p>}
    </div>
  );
};

export const LoaderWave = ({ size = "md", className = "", label = "Loading..." }) => {
  const barHeight = { sm: "h-6", md: "h-8", lg: "h-10" };
  const barWidth = { sm: "w-1", md: "w-2", lg: "w-3" };
  const waveVariants = { start: { opacity: 0 }, end: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const barVariants = { start: { scaleY: 0.5 }, end: { scaleY: [0.5, 1, 0.5], transition: { duration: 0.8, repeat: Infinity, repeatType: "loop", ease: "easeInOut" } } };

  return (
    <div className={`flex flex-col items-center justify-center gap-4 ${className}`}>
      <motion.div className="flex justify-center items-end gap-1" variants={waveVariants} initial="start" animate="end">
        {[0, 1, 2, 3, 4].map((bar) => <motion.div key={bar} className={`${barWidth[size]} ${barHeight[size]} bg-primary rounded-full origin-bottom`} variants={barVariants} />)}
      </motion.div>
      {label && <p className="text-sm text-muted-foreground">{label}</p>}
    </div>
  );
};

export const LoaderGradientSpinner = ({ size = "md", className = "", label = "Loading..." }) => {
  const sizeClasses = { sm: "w-8 h-8", md: "w-12 h-12", lg: "w-16 h-16" };
  return (
    <div className={`flex flex-col items-center justify-center gap-4 ${className}`}>
      <motion.div className={`${sizeClasses[size]} rounded-full bg-gradient-to-r from-primary via-purple-500 to-primary bg-[length:200%_200%]`} animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"], rotate: [0, 360] }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} />
      {label && <p className="text-sm text-muted-foreground">{label}</p>}
    </div>
  );
};

/* -------------------------------------------
  Full Screen Loader
------------------------------------------- */
export const FullScreenLoader = ({ isVisible = true, loaderType = "circular", label = "Loading..." }) => {
  const loaderComponents = {
    "spinning-dots": <LoaderSpinningDots label={label} />,
    circular: <LoaderCircular label={label} />,
    "pulsing-circles": <LoaderPulsingCircles label={label} />,
    wave: <LoaderWave label={label} />,
    gradient: <LoaderGradientSpinner label={label} />
  };

  return (
    <motion.div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50" initial={{ opacity: 0 }} animate={isVisible ? { opacity: 1 } : { opacity: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
      {loaderComponents[loaderType]}
    </motion.div>
  );
};
