import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef, useMemo, memo } from "react";

// Optimized continuous scroll-reactive reveal
export const ScrollReveal = memo(({ 
  children, 
  className = "", 
  direction = "up", 
  offset = 100, 
  delay = 0 
}) => {
  const ref = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Use spring for smoother animations
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Calculate progress ranges once
  const baseProgress = useMemo(() => [
    0, 
    0.3 + delay * 0.1, 
    0.7 - delay * 0.1, 
    1
  ], [delay]);

  // Create transforms based on direction - all at top level
  const yUp = useTransform(smoothProgress, baseProgress, [offset, 0, 0, -offset * 0.3]);
  const yDown = useTransform(smoothProgress, baseProgress, [-offset, 0, 0, offset * 0.3]);
  const xLeft = useTransform(smoothProgress, baseProgress, [offset, 0, 0, -offset * 0.3]);
  const xRight = useTransform(smoothProgress, baseProgress, [-offset, 0, 0, offset * 0.3]);
  const defaultValue = useTransform(smoothProgress, [0, 1], [0, 0]);
  
  const opacity = useTransform(
    smoothProgress,
    [0, 0.2 + delay * 0.1, 0.8 - delay * 0.1, 1],
    [0, 1, 1, 0.3]
  );

  // Select transforms based on direction
  const { x, y } = useMemo(() => {
    switch (direction) {
      case "up":
        return { y: yUp, x: defaultValue };
      case "down":
        return { y: yDown, x: defaultValue };
      case "left":
        return { x: xLeft, y: defaultValue };
      case "right":
        return { x: xRight, y: defaultValue };
      default:
        return { x: defaultValue, y: defaultValue };
    }
  }, [direction, yUp, yDown, xLeft, xRight, defaultValue]);

  return (
    <motion.div
      ref={ref}
      style={{ x, y, opacity, willChange: "transform, opacity" }}
      className={className}
    >
      {children}
    </motion.div>
  );
});

ScrollReveal.displayName = "ScrollReveal";

// Optimized parallax effect
export const ParallaxLayer = memo(({ 
  children, 
  className = "", 
  speed = 0.5, 
  direction = "vertical" 
}) => {
  const ref = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 25,
    restDelta: 0.001
  });

  const movementRange = useMemo(() => [100 * speed, -100 * speed], [speed]);
  const movement = useTransform(smoothProgress, [0, 1], movementRange);

  const style = useMemo(() => {
    const baseStyle = { willChange: "transform" };
    return direction === "vertical" 
      ? { ...baseStyle, y: movement }
      : { ...baseStyle, x: movement };
  }, [direction, movement]);

  return (
    <motion.div ref={ref} style={style} className={className}>
      {children}
    </motion.div>
  );
});

ParallaxLayer.displayName = "ParallaxLayer";

// Optimized scale animation
export const ScrollScale = memo(({ 
  children, 
  className = "", 
  scaleFrom = 0.8, 
  scaleTo = 1 
}) => {
  const ref = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const scaleRange = useMemo(() => [
    scaleFrom, 
    scaleTo, 
    scaleTo * 0.98
  ], [scaleFrom, scaleTo]);

  const scale = useTransform(smoothProgress, [0, 0.5, 1], scaleRange);
  const opacity = useTransform(smoothProgress, [0, 0.3, 1], [0.5, 1, 1]);

  return (
    <motion.div
      ref={ref}
      style={{ scale, opacity, willChange: "transform, opacity" }}
      className={className}
    >
      {children}
    </motion.div>
  );
});

ScrollScale.displayName = "ScrollScale";

// Optimized rotation animation
export const ScrollRotate = memo(({ 
  children, 
  className = "", 
  rotateFrom = -5, 
  rotateTo = 0 
}) => {
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

  const rotateRange = useMemo(() => [
    rotateFrom, 
    rotateTo, 
    -rotateFrom * 0.5
  ], [rotateFrom, rotateTo]);

  const rotate = useTransform(smoothProgress, [0, 0.5, 1], rotateRange);

  return (
    <motion.div
      ref={ref}
      style={{ rotate, willChange: "transform" }}
      className={className}
    >
      {children}
    </motion.div>
  );
});

ScrollRotate.displayName = "ScrollRotate";

// Optimized staggered reveal
const StaggerItem = memo(({ child, index, scrollYProgress, staggerDelay }) => {
  const start = useMemo(() => index * staggerDelay, [index, staggerDelay]);
  const end = useMemo(() => start + 0.2, [start]);

  const opacity = useTransform(
    scrollYProgress,
    [start, end, 0.8, 1],
    [0, 1, 1, 0.5]
  );

  const y = useTransform(
    scrollYProgress,
    [start, end, 0.8, 1],
    [50, 0, 0, -20]
  );

  return (
    <motion.div style={{ opacity, y, willChange: "transform, opacity" }}>
      {child}
    </motion.div>
  );
});

StaggerItem.displayName = "StaggerItem";

export const StaggerReveal = memo(({ 
  children, 
  className = "", 
  staggerDelay = 0.05 
}) => {
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

  // Convert children to array safely
  const childrenArray = useMemo(() => 
    Array.isArray(children) ? children : [children]
  , [children]);

  return (
    <div ref={ref} className={className}>
      {childrenArray.map((child, index) => (
        <StaggerItem
          key={index}
          child={child}
          index={index}
          scrollYProgress={smoothProgress}
          staggerDelay={staggerDelay}
        />
      ))}
    </div>
  );
});

StaggerReveal.displayName = "StaggerReveal";

// Optimized custom scroll hook
export const useScrollValue = (inputRange = [0, 1], outputRange = [0, 100]) => {
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

  const value = useTransform(smoothProgress, inputRange, outputRange);
  
  return useMemo(() => [ref, value], [ref, value]);
};

// Bonus: Viewport-based reveal (more performant for simple cases)
export const ViewportReveal = memo(({ children, className = "" }) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: false, margin: "-100px" }}
    transition={{ duration: 0.6, ease: "easeOut" }}
    className={className}
  >
    {children}
  </motion.div>
));

ViewportReveal.displayName = "ViewportReveal";