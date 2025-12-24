import { Navbar } from "./components/Navbar";
import { HeroSection } from "./components/HeroSection";
import LoadingScreen from "./components/LoadingScreen.jsx";
import PremiumAboutSection from "./components/PremiumAboutSection.jsx";
import ProjectsSection from "./components/ProjectsSection.jsx";
import { ContactSection } from "./components/ContactSection.jsx";
import Footer from "./components/Foter.jsx";
import { motion, useScroll, useTransform, useMotionValue ,useSpring  } from "framer-motion";
import { useRef , useState , useEffect } from "react";
import { useTheme } from "./components/ThemeProvider";
/* import "./App.css";
 */

const InteractiveBackground = ({ theme }) => {
  const containerRef = useRef(null);
  const [particles, setParticles] = useState([]);
  const [ripples, setRipples] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  
  // Mouse position with smooth spring animation
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const smoothX = useSpring(mouseX, { damping: 25, stiffness: 150 });
  const smoothY = useSpring(mouseY, { damping: 25, stiffness: 150 });
  
  // Secondary follower (delayed)
  const smoothX2 = useSpring(mouseX, { damping: 35, stiffness: 100 });
  const smoothY2 = useSpring(mouseY, { damping: 35, stiffness: 100 });
  
  // Third follower (more delayed)
  const smoothX3 = useSpring(mouseX, { damping: 50, stiffness: 80 });
  const smoothY3 = useSpring(mouseY, { damping: 50, stiffness: 80 });

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Generate floating particles (reduced on mobile)
  useEffect(() => {
    const particleCount = isMobile ? 15 : 50;
    const newParticles = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: isMobile ? Math.random() * 4 + 2 : Math.random() * 6 + 2,
      duration: Math.random() * 20 + 10,
      delay: Math.random() * 5,
      opacity: isMobile ? Math.random() * 0.3 + 0.1 : Math.random() * 0.5 + 0.1,
    }));
    setParticles(newParticles);
  }, [isMobile]);

  // Handle mouse move (disabled on mobile)
  useEffect(() => {
    if (isMobile) return;
    
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY, isMobile]);

  // Handle click ripple effect (disabled on mobile)
  const handleClick = (e) => {
    if (isMobile) return;
    
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const newRipple = {
      id: Date.now(),
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
    
    setRipples(prev => [...prev, newRipple]);
    
    // Remove ripple after animation
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== newRipple.id));
    }, 1000);
  };

  return (
    <div 
      ref={containerRef}
      onClick={handleClick}
      style={{
        position: 'fixed',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    >
      {/* Gradient Background */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: theme === 'dark'
            ? 'radial-gradient(ellipse at 50% 50%, hsl(250, 50%, 8%) 0%, hsl(240, 50%, 3%) 100%)'
            : 'radial-gradient(ellipse at 50% 50%, hsl(0, 0%, 95%) 0%, hsl(0, 0%, 90%) 100%)',
        }}
      />

      {/* Animated Mesh Gradient - Slower on mobile */}
      <motion.div
        style={{
          position: 'absolute',
          inset: '-50%',
          background: `
            radial-gradient(circle at 20% 30%, hsla(280, 100%, 50%, ${isMobile ? '0.08' : '0.15'}) 0%, transparent 40%),
            radial-gradient(circle at 80% 70%, hsla(200, 100%, 50%, ${isMobile ? '0.08' : '0.15'}) 0%, transparent 40%),
            radial-gradient(circle at 50% 50%, hsla(320, 100%, 50%, ${isMobile ? '0.05' : '0.1'}) 0%, transparent 50%)
          `,
        }}
        animate={{
          rotate: [0, 360],
        }}
        transition={{
          duration: isMobile ? 120 : 60,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      {/* Floating Particles */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          style={{
            position: 'absolute',
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            borderRadius: '50%',
            background: theme === 'dark'
              ? `hsla(${200 + Math.random() * 100}, 100%, 70%, ${particle.opacity})`
              : `hsla(${200 + Math.random() * 100}, 100%, 50%, ${particle.opacity * 0.5})`,
            boxShadow: theme === 'dark'
              ? `0 0 ${particle.size * 2}px hsla(${200 + Math.random() * 100}, 100%, 70%, 0.5)`
              : `0 0 ${particle.size * 2}px hsla(${200 + Math.random() * 100}, 100%, 50%, 0.3)`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.random() * 20 - 10, 0],
            opacity: [particle.opacity, particle.opacity * 1.5, particle.opacity],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Geometric Shapes - Reduced on mobile */}
      {[...Array(isMobile ? 3 : 8)].map((_, i) => (
        <motion.div
          key={`shape-${i}`}
          style={{
            position: 'absolute',
            left: `${10 + i * 12}%`,
            top: `${20 + (i % 3) * 25}%`,
            width: isMobile ? 40 + i * 5 : 60 + i * 10,
            height: isMobile ? 40 + i * 5 : 60 + i * 10,
            border: `1px solid hsla(280, 100%, 70%, ${isMobile ? '0.05' : '0.1'})`,
            borderRadius: i % 2 === 0 ? '50%' : '0',
            transform: i % 2 === 0 ? 'none' : 'rotate(45deg)',
          }}
          animate={{
            rotate: i % 2 === 0 ? [0, 360] : [45, 405],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: isMobile ? 30 + i * 5 : 20 + i * 5,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}

      {/* Mouse Followers - Only on desktop */}
      {!isMobile && (
        <>
          {/* Main Cursor Glow */}
          <motion.div
            style={{
              position: 'fixed',
              zIndex: 100,
              x: smoothX,
              y: smoothY,
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: 'radial-gradient(circle, hsla(280, 100%, 70%, 0.8) 0%, transparent 70%)',
              boxShadow: '0 0 60px 30px hsla(280, 100%, 60%, 0.3)',
              pointerEvents: 'none',
              zIndex: 100,
              transform: 'translate(-50%, -50%)',
            }}
          />

          {/* Secondary Follower */}
          <motion.div
            style={{
              position: 'fixed',
              x: smoothX2,
              y: smoothY2,
              width: 80,
              height: 80,
              borderRadius: '50%',
              border: '2px solid hsla(200, 100%, 70%, 0.4)',
              background: 'radial-gradient(circle, hsla(200, 100%, 70%, 0.1) 0%, transparent 70%)',
              pointerEvents: 'none',
              zIndex: 99,
              transform: 'translate(-50%, -50%)',
            }}
          />

          {/* Third Follower - Large Glow */}
          <motion.div
            style={{
              position: 'fixed',
              x: smoothX3,
              y: smoothY3,
              width: 200,
              height: 200,
              borderRadius: '50%',
              background: 'radial-gradient(circle, hsla(320, 100%, 60%, 0.15) 0%, transparent 70%)',
              pointerEvents: 'none',
              zIndex: 98,
              transform: 'translate(-50%, -50%)',
            }}
          />

          {/* Interactive Light Trail */}
          <motion.div
            style={{
              position: 'fixed',
              x: smoothX,
              y: smoothY,
              width: 300,
              height: 300,
              background: `
                radial-gradient(circle, hsla(260, 100%, 60%, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 30% 30%, hsla(200, 100%, 70%, 0.05) 0%, transparent 40%)
              `,
              pointerEvents: 'none',
              zIndex: 97,
              transform: 'translate(-50%, -50%)',
              filter: 'blur(20px)',
            }}
          />

          {/* Click Ripples */}
          {ripples.map((ripple) => (
            <motion.div
              key={ripple.id}
              style={{
                position: 'absolute',
                left: ripple.x,
                top: ripple.y,
                width: 20,
                height: 20,
                borderRadius: '50%',
                border: '2px solid hsla(280, 100%, 70%, 0.8)',
                transform: 'translate(-50%, -50%)',
              }}
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: 15, opacity: 0 }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          ))}
        </>
      )}

      {/* Connecting Lines Effect - Reduced on mobile */}
      {!isMobile && (
        <svg
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
          }}
        >
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={theme === 'dark' ? "hsla(280, 100%, 70%, 0.3)" : "hsla(280, 100%, 30%, 0.3)"} />
              <stop offset="100%" stopColor={theme === 'dark' ? "hsla(200, 100%, 70%, 0.3)" : "hsla(200, 100%, 30%, 0.3)"} />
            </linearGradient>
          </defs>
          {[...Array(6)].map((_, i) => (
            <motion.line
              key={`line-${i}`}
              x1={`${15 + i * 15}%`}
              y1="0%"
              x2={`${25 + i * 12}%`}
              y2="100%"
              stroke="url(#lineGradient)"
              strokeWidth="0.5"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: [0, 0.3, 0] }}
              transition={{
                duration: 8,
                delay: i * 0.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          ))}
        </svg>
      )}

      {/* Glowing Orbs - Reduced on mobile */}
      {[
        { x: '10%', y: '20%', color: '280, 100%, 60%', size: isMobile ? 80 : 150 },
        { x: '85%', y: '30%', color: '200, 100%, 60%', size: isMobile ? 60 : 120 },
        { x: '50%', y: '80%', color: '320, 100%, 60%', size: isMobile ? 100 : 180 },
        ...(!isMobile ? [{ x: '20%', y: '70%', color: '240, 100%, 60%', size: 100 }] : []),
      ].map((orb, i) => (
        <motion.div
          key={`orb-${i}`}
          style={{
            position: 'absolute',
            left: orb.x,
            top: orb.y,
            width: orb.size,
            height: orb.size,
            borderRadius: '50%',
            background: `radial-gradient(circle, hsla(${orb.color}, ${isMobile ? '0.1' : '0.2'}) 0%, transparent 70%)`,
            filter: `blur(${isMobile ? '30px' : '40px'})`,
          }}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.6, 0.3],
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: isMobile ? 12 + i * 2 : 8 + i * 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Grid Pattern */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: theme === 'dark'
            ? `
              linear-gradient(hsla(280, 100%, 70%, ${isMobile ? '0.02' : '0.03'}) 1px, transparent 1px),
              linear-gradient(90deg, hsla(280, 100%, 70%, ${isMobile ? '0.02' : '0.03'}) 1px, transparent 1px)
            `
            : `
              linear-gradient(hsla(280, 100%, 20%, ${isMobile ? '0.02' : '0.03'}) 1px, transparent 1px),
              linear-gradient(90deg, hsla(280, 100%, 20%, ${isMobile ? '0.02' : '0.03'}) 1px, transparent 1px)
            `,
          backgroundSize: isMobile ? '80px 80px' : '50px 50px',
        }}
      />

      {/* Noise Texture Overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: isMobile ? 0.02 : 0.03,
          background: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
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
