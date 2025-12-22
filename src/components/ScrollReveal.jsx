import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

// Continuous scroll-reactive reveal
export const ScrollReveal = ({ children, className = "", direction = "up", offset = 100, delay = 0 }) => {
  const ref = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const getTransforms = () => {
    const baseProgress = [0, 0.3 + delay * 0.1, 0.7 - delay * 0.1, 1];
    
    switch (direction) {
      case "up":
        return {
          y: useTransform(scrollYProgress, baseProgress, [offset, 0, 0, -offset * 0.3]),
          x: useTransform(scrollYProgress, [0, 1], [0, 0]),
        };
      case "down":
        return {
          y: useTransform(scrollYProgress, baseProgress, [-offset, 0, 0, offset * 0.3]),
          x: useTransform(scrollYProgress, [0, 1], [0, 0]),
        };
      case "left":
        return {
          x: useTransform(scrollYProgress, baseProgress, [offset, 0, 0, -offset * 0.3]),
          y: useTransform(scrollYProgress, [0, 1], [0, 0]),
        };
      case "right":
        return {
          x: useTransform(scrollYProgress, baseProgress, [-offset, 0, 0, offset * 0.3]),
          y: useTransform(scrollYProgress, [0, 1], [0, 0]),
        };
      default:
        return {
          x: useTransform(scrollYProgress, [0, 1], [0, 0]),
          y: useTransform(scrollYProgress, [0, 1], [0, 0]),
        };
    }
  };

  const transforms = getTransforms();
  const opacity = useTransform(scrollYProgress, [0, 0.2 + delay * 0.1, 0.8 - delay * 0.1, 1], [0, 1, 1, 0.3]);

  return (
    <motion.div
      ref={ref}
      style={{ opacity, x: transforms.x, y: transforms.y }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Continuous parallax effect
export const ParallaxLayer = ({ children, className = "", speed = 0.5, direction = "vertical" }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const movement = useTransform(scrollYProgress, [0, 1], [100 * speed, -100 * speed]);

  return (
    <motion.div
      ref={ref}
      style={{ [direction === "vertical" ? "y" : "x"]: movement }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Scale animation tied to scroll
export const ScrollScale = ({ children, className = "", scaleFrom = 0.8, scaleTo = 1 }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] });

  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [scaleFrom, scaleTo, scaleTo * 0.98]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 1], [0.5, 1, 1]);

  return (
    <motion.div ref={ref} style={{ scale, opacity }} className={className}>
      {children}
    </motion.div>
  );
};

// Rotation animation tied to scroll
export const ScrollRotate = ({ children, className = "", rotateFrom = -5, rotateTo = 0 }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });

  const rotate = useTransform(scrollYProgress, [0, 0.5, 1], [rotateFrom, rotateTo, -rotateFrom * 0.5]);

  return (
    <motion.div ref={ref} style={{ rotate }} className={className}>
      {children}
    </motion.div>
  );
};

// Staggered reveal for multiple children
export const StaggerReveal = ({ children, className = "", staggerDelay = 0.05 }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });

  return (
    <div ref={ref} className={className}>
      {children.map((child, index) => {
        const start = index * staggerDelay;
        const opacity = useTransform(scrollYProgress, [start, start + 0.2, 0.8, 1], [0, 1, 1, 0.5]);
        const y = useTransform(scrollYProgress, [start, start + 0.2, 0.8, 1], [50, 0, 0, -20]);

        return (
          <motion.div key={index} style={{ opacity, y }}>
            {child}
          </motion.div>
        );
      })}
    </div>
  );
};

// Hook for creating custom scroll-based values
export const useScrollValue = (inputRange = [0, 1], outputRange = [0, 100]) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const value = useTransform(scrollYProgress, inputRange, outputRange);
  return [ref, value];
};
