import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export const GlowingOrb = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll();

  // Continuous scroll-reactive transforms for orbs
  const orb1Y = useTransform(scrollYProgress, [0, 1], [0, -400]);
  const orb1X = useTransform(scrollYProgress, [0, 0.5, 1], [0, 100, -50]);
  const orb1Scale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.3, 0.8]);
  const orb1Opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.2, 0.3, 0.2, 0.1]);

  const orb2Y = useTransform(scrollYProgress, [0, 1], [0, -600]);
  const orb2X = useTransform(scrollYProgress, [0, 0.5, 1], [0, -150, 100]);
  const orb2Scale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.8, 1.2]);
  const orb2Opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.15, 0.25, 0.15, 0.08]);

  return (
    <div ref={ref} className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
      {/* Primary Orb */}
      <motion.div
        style={{ y: orb1Y, x: orb1X, scale: orb1Scale, opacity: orb1Opacity }}
        className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px]"
      >
        <motion.div
          className="w-full h-full rounded-full bg-primary/20 blur-[120px]"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>

      {/* Secondary Orb */}
      <motion.div
        style={{ y: orb2Y, x: orb2X, scale: orb2Scale, opacity: orb2Opacity }}
        className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px]"
      >
        <motion.div
          className="w-full h-full rounded-full bg-accent/15 blur-[100px]"
          animate={{ scale: [1, 0.9, 1.1, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
      </motion.div>

      {/* Small floating particles - scroll reactive */}
      {[...Array(5)].map((_, i) => {
        const particleY = useTransform(scrollYProgress, [0, 1], [0, -100 * (i + 1)]);
        const particleOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.2, 0.6, 0.4, 0.1]);

        return (
          <motion.div
            key={i}
            style={{ y: particleY, opacity: particleOpacity }}
            className="absolute w-2 h-2 rounded-full bg-primary/40"
            animate={{ y: [0, -30, 0] }}
            transition={{ duration: 3 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }}
            initial={{ top: `${20 + i * 15}%`, left: `${10 + i * 20}%` }}
          />
        );
      })}
    </div>
  );
};
