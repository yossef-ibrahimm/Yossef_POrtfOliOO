import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
} from "framer-motion";
import { useRef, useMemo, memo, useEffect, useState } from "react";

/* =========================================================
   Motion Safety Hook (Mobile + Reduced Motion)
========================================================= */
const useMotionSafe = () => {
  const prefersReduced = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  return {
    disableMotion: prefersReduced || isMobile,
    isMobile,
  };
};

/* =========================================================
   Scroll Reveal
========================================================= */
export const ScrollReveal = memo(
  ({ children, className = "", direction = "up", offset = 100 }) => {
    const ref = useRef(null);
    const { disableMotion } = useMotionSafe();

    // ✅ Mobile / Reduced Motion
    if (disableMotion) {
      return (
        <motion.div
          className={className}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          {children}
        </motion.div>
      );
    }

    // 🖥 Desktop
    const { scrollYProgress } = useScroll({
      target: ref,
      offset: ["start end", "end start"],
    });

    const smooth = useSpring(scrollYProgress, {
      stiffness: 90,
      damping: 28,
    });

    const y = useTransform(
      smooth,
      [0, 0.3, 0.7, 1],
      direction === "up"
        ? [offset, 0, 0, -offset * 0.3]
        : [-offset, 0, 0, offset * 0.3]
    );

    const opacity = useTransform(
      smooth,
      [0, 0.2, 0.8, 1],
      [0, 1, 1, 0.4]
    );

    return (
      <motion.div
        ref={ref}
        style={{ y, opacity, willChange: "transform, opacity" }}
        className={className}
      >
        {children}
      </motion.div>
    );
  }
);

/* =========================================================
   Parallax Layer (Desktop only)
========================================================= */
export const ParallaxLayer = memo(
  ({ children, className = "", speed = 0.5, direction = "vertical" }) => {
    const ref = useRef(null);
    const { disableMotion } = useMotionSafe();

    if (disableMotion) {
      return <div className={className}>{children}</div>;
    }

    const { scrollYProgress } = useScroll({
      target: ref,
      offset: ["start end", "end start"],
    });

    const movement = useTransform(
      scrollYProgress,
      [0, 1],
      [100 * speed, -100 * speed]
    );

    return (
      <motion.div
        ref={ref}
        className={className}
        style={{
          willChange: "transform",
          ...(direction === "vertical" ? { y: movement } : { x: movement }),
        }}
      >
        {children}
      </motion.div>
    );
  }
);

/* =========================================================
   Scroll Scale
========================================================= */
export const ScrollScale = memo(
  ({ children, className = "", scaleFrom = 0.85, scaleTo = 1 }) => {
    const ref = useRef(null);
    const { disableMotion } = useMotionSafe();

    if (disableMotion) {
      return (
        <motion.div
          className={className}
          initial={{ scale: 0.95, opacity: 0.6 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          {children}
        </motion.div>
      );
    }

    const { scrollYProgress } = useScroll({
      target: ref,
      offset: ["start end", "center center"],
    });

    const smooth = useSpring(scrollYProgress, {
      stiffness: 90,
      damping: 28,
    });

    const scale = useTransform(
      smooth,
      [0, 0.5, 1],
      [scaleFrom, scaleTo, scaleTo * 0.98]
    );

    const opacity = useTransform(smooth, [0, 0.3, 1], [0.5, 1, 1]);

    return (
      <motion.div
        ref={ref}
        style={{ scale, opacity, willChange: "transform, opacity" }}
        className={className}
      >
        {children}
      </motion.div>
    );
  }
);

/* =========================================================
   Scroll Rotate
========================================================= */
export const ScrollRotate = memo(
  ({ children, className = "", rotateFrom = -5, rotateTo = 0 }) => {
    const ref = useRef(null);
    const { disableMotion } = useMotionSafe();

    if (disableMotion) {
      return (
        <motion.div
          className={className}
          initial={{ rotate: 0, opacity: 0.7 }}
          whileInView={{ rotate: 0, opacity: 1 }}
          viewport={{ once: true }}
        >
          {children}
        </motion.div>
      );
    }

    const { scrollYProgress } = useScroll({
      target: ref,
      offset: ["start end", "end start"],
    });

    const smooth = useSpring(scrollYProgress, {
      stiffness: 90,
      damping: 28,
    });

    const rotate = useTransform(
      smooth,
      [0, 0.5, 1],
      [rotateFrom, rotateTo, -rotateFrom * 0.5]
    );

    return (
      <motion.div
        ref={ref}
        style={{ rotate, willChange: "transform" }}
        className={className}
      >
        {children}
      </motion.div>
    );
  }
);

/* =========================================================
   Stagger Reveal (Mobile-safe)
========================================================= */
export const StaggerReveal = memo(
  ({ children, className = "", staggerDelay = 0.08 }) => {
    const { disableMotion } = useMotionSafe();

    const childrenArray = useMemo(
      () => (Array.isArray(children) ? children : [children]),
      [children]
    );

    // ✅ Mobile
    if (disableMotion) {
      return (
        <motion.div
          className={className}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={{
            hidden: {},
            show: {
              transition: { staggerChildren: staggerDelay },
            },
          }}
        >
          {childrenArray.map((child, i) => (
            <motion.div
              key={i}
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0 },
              }}
            >
              {child}
            </motion.div>
          ))}
        </motion.div>
      );
    }

    // 🖥 Desktop (simple stagger, no scroll listeners)
    return (
      <motion.div
        className={className}
        initial="hidden"
        animate="show"
        variants={{
          hidden: {},
          show: {
            transition: { staggerChildren: staggerDelay },
          },
        }}
      >
        {childrenArray.map((child, i) => (
          <motion.div
            key={i}
            variants={{
              hidden: { opacity: 0, y: 30 },
              show: { opacity: 1, y: 0 },
            }}
          >
            {child}
          </motion.div>
        ))}
      </motion.div>
    );
  }
);

/* =========================================================
   Simple Viewport Reveal (Ultra performant)
========================================================= */
export const ViewportReveal = memo(({ children, className = "" }) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.5, ease: "easeOut" }}
  >
    {children}
  </motion.div>
));
