import { Navbar } from "./components/Navbar";
import { HeroSection } from "./components/HeroSection";
import LoadingScreen from "./components/LoadingScreen.jsx";
import PremiumAboutSection from "./components/PremiumAboutSection.jsx";
import ProjectsSection from "./components/ProjectsSection.jsx";
import { ContactSection } from "./components/ContactSection.jsx";
import Footer from "./components/Foter.jsx";
import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "framer-motion";
import {
  useRef,
  useState,
  useEffect,
  useMemo,
  memo,
  useCallback,
} from "react";
import { useTheme } from "./components/ThemeProvider";

/* =====================================================
   MOTION SAFETY
===================================================== */
const useMotionSafe = () => {
  const reduced = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(
      "ontouchstart" in window ||
        navigator.maxTouchPoints > 0 ||
        window.innerWidth < 768
    );
  }, []);

  return { disableMotion: reduced || isMobile, isMobile };
};

/* =====================================================
   PARTICLE (DESKTOP ONLY)
===================================================== */
const Particle = memo(({ particle }) => (
  <motion.div
    style={{
      position: "absolute",
      left: `${particle.x}%`,
      top: `${particle.y}%`,
      width: particle.size,
      height: particle.size,
      borderRadius: "50%",
      background: `hsla(220,100%,70%,${particle.opacity})`,
    }}
    animate={{ y: [0, -20, 0], opacity: [particle.opacity, particle.opacity * 1.4, particle.opacity] }}
    transition={{
      duration: particle.duration,
      delay: particle.delay,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  />
));

/* =====================================================
   ORB (LIGHTENED)
===================================================== */
const Orb = memo(({ orb }) => (
  <motion.div
    style={{
      position: "absolute",
      left: orb.x,
      top: orb.y,
      width: orb.size,
      height: orb.size,
      borderRadius: "50%",
      background: `radial-gradient(circle, hsla(${orb.color},0.2), transparent 70%)`,
    }}
    animate={{ opacity: [0.25, 0.5, 0.25] }}
    transition={{ duration: 10, repeat: Infinity }}
  />
));

/* =====================================================
   MOUSE FOLLOWERS (DESKTOP ONLY)
===================================================== */
const MouseFollowers = memo(({ x, y }) => (
  <motion.div
    style={{
      position: "fixed",
      x,
      y,
      width: 120,
      height: 120,
      borderRadius: "50%",
      background:
        "radial-gradient(circle, hsla(280,100%,60%,0.25), transparent 70%)",
      transform: "translate(-50%,-50%)",
      willChange: "transform",
    }}
  />
));

/* =====================================================
   INTERACTIVE BACKGROUND (OPTIMIZED)
===================================================== */
const InteractiveBackground = memo(({ theme }) => {
  const { disableMotion, isMobile } = useMotionSafe();
  const containerRef = useRef(null);

  /* ---------- Mouse Motion ---------- */
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const smoothX = useSpring(mouseX, { stiffness: 120, damping: 30 });
  const smoothY = useSpring(mouseY, { stiffness: 120, damping: 30 });

  const handleMouseMove = useCallback(
    (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    },
    [mouseX, mouseY]
  );

  useEffect(() => {
    if (disableMotion) return;
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [disableMotion, handleMouseMove]);

  /* ---------- Particles ---------- */
  const particles = useMemo(() => {
    if (disableMotion) return [];
    return Array.from({ length: 40 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 15 + 10,
      delay: Math.random() * 3,
      opacity: Math.random() * 0.4 + 0.1,
    }));
  }, [disableMotion]);

  /* ---------- Orbs ---------- */
  const orbs = useMemo(
    () =>
      disableMotion
        ? [{ x: "50%", y: "50%", color: "280,100%,60%", size: 200 }]
        : [
            { x: "10%", y: "20%", color: "280,100%,60%", size: 150 },
            { x: "80%", y: "30%", color: "200,100%,60%", size: 120 },
            { x: "50%", y: "75%", color: "320,100%,60%", size: 180 },
          ],
    [disableMotion]
  );

  /* ---------- Base Styles ---------- */
  const baseGradient = useMemo(
    () => ({
      position: "absolute",
      inset: 0,
      background:
        theme === "dark"
          ? "radial-gradient(circle, hsl(250,50%,8%), hsl(240,50%,3%))"
          : "radial-gradient(circle, hsl(0,0%,95%), hsl(0,0%,90%))",
    }),
    [theme]
  );

  /* ================= Render ================= */
  return (
    <div
      ref={containerRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      <div style={baseGradient} />

      {!disableMotion &&
        particles.map((p) => <Particle key={p.id} particle={p} />)}

      {orbs.map((o, i) => (
        <Orb key={i} orb={o} />
      ))}

      {!disableMotion && <MouseFollowers x={smoothX} y={smoothY} />}
    </div>
  );
});

/* =====================================================
   MAIN APP
===================================================== */
export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const { theme } = useTheme();

  return (
    <>
      {isLoading && (
        <LoadingScreen onLoadingComplete={() => setIsLoading(false)} />
      )}

      {!isLoading && (
        <>
          <InteractiveBackground theme={theme} />
          <Navbar />
          <HeroSection />
          <PremiumAboutSection />
          <ProjectsSection />
          <ContactSection />
          <Footer />
        </>
      )}
    </>
  );
}
