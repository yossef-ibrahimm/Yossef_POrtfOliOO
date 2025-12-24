import { Navbar } from "./components/Navbar";
import { HeroSection } from "./components/HeroSection";
import LoadingScreen from "./components/LoadingScreen.jsx";
import PremiumAboutSection from "./components/PremiumAboutSection.jsx";
import ProjectsSection from "./components/ProjectsSection.jsx";
import { ContactSection } from "./components/ContactSection.jsx";
import Footer from "./components/Foter.jsx";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { useTheme } from "./components/ThemeProvider";
/* import "./App.css";
 */

const InteractiveBackground = ({ theme = "dark" }) => {
  const containerRef = useRef(null);
  const [particles, setParticles] = useState([]);
  const [ripples, setRipples] = useState([]);
  const [isMobile, setIsMobile] = useState(false);

  /* ------------------ Detect Mobile / Touch ------------------ */
  useEffect(() => {
    const mobile =
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      window.innerWidth < 768;

    setIsMobile(mobile);
  }, []);

  /* ------------------ Mouse Motion ------------------ */
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const smoothX = useSpring(mouseX, { damping: 25, stiffness: 150 });
  const smoothY = useSpring(mouseY, { damping: 25, stiffness: 150 });

  const smoothX2 = useSpring(mouseX, { damping: 35, stiffness: 100 });
  const smoothY2 = useSpring(mouseY, { damping: 35, stiffness: 100 });

  const smoothX3 = useSpring(mouseX, { damping: 50, stiffness: 80 });
  const smoothY3 = useSpring(mouseY, { damping: 50, stiffness: 80 });

  /* ------------------ Mouse Move (Desktop Only) ------------------ */
  useEffect(() => {
    if (isMobile) return;

    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isMobile, mouseX, mouseY]);

  /* ------------------ Particles ------------------ */
  useEffect(() => {
    const count = isMobile ? 18 : 50;

    const items = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 6 + 2,
      duration: Math.random() * 20 + 10,
      delay: Math.random() * 5,
      opacity: Math.random() * 0.5 + 0.1,
    }));

    setParticles(items);
  }, [isMobile]);

  /* ------------------ Ripple ------------------ */
  const handleClick = (e) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const ripple = {
      id: Date.now(),
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };

    setRipples((r) => [...r, ripple]);

    setTimeout(() => {
      setRipples((r) => r.filter((x) => x.id !== ripple.id));
    }, 900);
  };

  /* ------------------ Orbs ------------------ */
  const orbs = [
    { x: "10%", y: "20%", color: "280,100%,60%", size: 150 },
    { x: "85%", y: "30%", color: "200,100%,60%", size: 120 },
    { x: "50%", y: "80%", color: "320,100%,60%", size: 180 },
    { x: "20%", y: "70%", color: "240,100%,60%", size: 100 },
  ];

  /* ================== Render ================== */
  return (
    <div
      ref={containerRef}
      onClick={handleClick}
      onTouchStart={isMobile ? handleClick : undefined}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        overflow: "hidden",
        pointerEvents: "none",
      }}
    >
      {/* Base Gradient */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            theme === "dark"
              ? "radial-gradient(circle, hsl(250,50%,8%), hsl(240,50%,3%))"
              : "radial-gradient(circle, hsl(0,0%,95%), hsl(0,0%,90%))",
        }}
      />

      {/* Mesh Gradient */}
      <motion.div
        style={{
          position: "absolute",
          inset: "-50%",
          opacity: isMobile ? 0.4 : 1,
          filter: isMobile ? "blur(40px)" : "none",
          background: `
            radial-gradient(circle at 20% 30%, hsla(280,100%,50%,0.15), transparent 40%),
            radial-gradient(circle at 80% 70%, hsla(200,100%,50%,0.15), transparent 40%)
          `,
        }}
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
      />

      {/* Particles */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          style={{
            position: "absolute",
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            borderRadius: "50%",
            background: `hsla(220,100%,70%,${p.opacity})`,
          }}
          animate={{ y: [0, -25, 0], opacity: [p.opacity, p.opacity * 1.4, p.opacity] }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Mouse Followers – Desktop Only */}
      {!isMobile && (
        <>
          <motion.div
            style={{
              position: "fixed",
              x: smoothX,
              y: smoothY,
              width: 40,
              height: 40,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, hsla(280,100%,70%,0.8), transparent 70%)",
              transform: "translate(-50%,-50%)",
            }}
          />

          <motion.div
            style={{
              position: "fixed",
              x: smoothX2,
              y: smoothY2,
              width: 80,
              height: 80,
              borderRadius: "50%",
              border: "2px solid hsla(200,100%,70%,0.4)",
              transform: "translate(-50%,-50%)",
            }}
          />

          <motion.div
            style={{
              position: "fixed",
              x: smoothX3,
              y: smoothY3,
              width: 200,
              height: 200,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, hsla(320,100%,60%,0.15), transparent 70%)",
              transform: "translate(-50%,-50%)",
            }}
          />
        </>
      )}

      {/* Ripples */}
      {ripples.map((r) => (
        <motion.div
          key={r.id}
          style={{
            position: "absolute",
            left: r.x,
            top: r.y,
            width: 20,
            height: 20,
            borderRadius: "50%",
            border: "2px solid hsla(280,100%,70%,0.8)",
            transform: "translate(-50%,-50%)",
          }}
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 12, opacity: 0 }}
          transition={{ duration: 0.9 }}
        />
      ))}

      {/* Orbs */}
      {(isMobile ? orbs.slice(0, 2) : orbs).map((o, i) => (
        <motion.div
          key={i}
          style={{
            position: "absolute",
            left: o.x,
            top: o.y,
            width: o.size,
            height: o.size,
            borderRadius: "50%",
            background: `radial-gradient(circle, hsla(${o.color},0.25), transparent 70%)`,
            filter: "blur(40px)",
          }}
          animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 8 + i * 2, repeat: Infinity }}
        />
      ))}

      {/* Noise */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: isMobile ? 0.015 : 0.03,
          background:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
    </div>
  );
};
export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const { theme } = useTheme();

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };
  return (
    <>
      {isLoading && <LoadingScreen onLoadingComplete={handleLoadingComplete} />}
      {!isLoading && (
        <>
          {" "}
          <InteractiveBackground theme={theme}> </InteractiveBackground>
          <Navbar></Navbar>
          <HeroSection></HeroSection>
          <PremiumAboutSection></PremiumAboutSection>
          <ProjectsSection></ProjectsSection>
          <ContactSection></ContactSection>
          <Footer></Footer>
        </>
      )}
    </>
  );
}
