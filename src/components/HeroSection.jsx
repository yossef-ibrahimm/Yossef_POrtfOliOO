import {
  motion,
  useScroll,
  useTransform,
  useSpring,
} from "framer-motion";
import { useRef, useMemo, memo, lazy, Suspense, useState, useEffect } from "react";
import { ArrowDown, Github, Linkedin } from "lucide-react";

// Detect if mobile device
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || 
                  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  return isMobile;
};

// Lazy load heavy components
const MagneticButton = lazy(() => import('./MagneticButton').then(m => ({ default: m.MagneticButton })));
const TypewriterText = lazy(() => import('./AnimatedText').then(m => ({ default: m.TypewriterText })));

// Simplified AnimatedLetters for mobile
const AnimatedLetters = memo(({ text, className }) => (
  <span className={className}>{text}</span>
));

// Optimized Social Link with reduced animations on mobile
const SocialLink = memo(({ social, index, isMobile }) => (
  <motion.a
    href={social.href}
    target="_blank"
    rel="noopener noreferrer"
    className="p-3 glass rounded-full hover:bg-primary/10 hover:border-primary/30 transition-all duration-300 group"
    whileHover={isMobile ? {} : { scale: 1.1, y: -2 }}
    whileTap={{ scale: 0.95 }}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: isMobile ? 0.8 : 1.2 + index * 0.1 }}
  >
    <social.icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
  </motion.a>
));

export const HeroSection = () => {
  const ref = useRef(null);
  const isMobile = useIsMobile();
  
  // Reduce scroll effects on mobile for better performance
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Lighter spring settings for mobile
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: isMobile ? 80 : 100,
    damping: isMobile ? 25 : 30,
    mass: 0.5
  });

  // Reduced transforms on mobile - less parallax = better performance
  const y = useTransform(smoothProgress, [0, 1], [0, isMobile ? 150 : 300]);
  const opacity = useTransform(smoothProgress, [0, 0.5, 1], [1, 0.5, 0]);
  const scale = useTransform(smoothProgress, [0, 0.5, 1], [1, isMobile ? 0.95 : 0.92, isMobile ? 0.9 : 0.85]);
  
  // Skip blur on mobile - expensive operation
  const blur = useTransform(smoothProgress, [0, 0.5], [0, isMobile ? 0 : 10]);
  const blurFilter = useTransform(blur, (v) => `blur(${v}px)`);
  
  // Simplified parallax for other elements on mobile
  const gridY = useTransform(smoothProgress, [0, 1], [0, isMobile ? -50 : -100]);
  const gridOpacity = useTransform(smoothProgress, [0, 0.8], [1, 0]);
  const tagY = useTransform(smoothProgress, [0, 1], [0, isMobile ? 75 : 150]);
  const headingY = useTransform(smoothProgress, [0, 1], [0, isMobile ? 100 : 200]);
  const buttonsY = useTransform(smoothProgress, [0, 1], [0, isMobile ? 150 : 300]);
  const socialsY = useTransform(smoothProgress, [0, 1], [0, isMobile ? 175 : 350]);
  const scrollIndicatorOpacity = useTransform(smoothProgress, [0, 0.2], [1, 0]);

  // Memoize social links array
  const socialLinks = useMemo(() => [
    {
      icon: Github,
      href: "https://github.com/yossef-ibrahimm",
      label: "GitHub",
    },
    {
      icon: Linkedin,
      href: "https://linkedin.com/in/yossef-ibrahim",
      label: "LinkedIn",
    },
  ], []);

  // Optimized CV download handler
  const handleDownloadCV = useMemo(() => () => {
    const link = document.createElement("a");
    link.href = "/assets/Youssef_Ibrahim_Frontend_Developer_CV.pdf";
    link.download = "Youssef_Ibrahim_CV.pdf";
    link.click();
  }, []);

  // Simplified motion styles for mobile
  const motionStyles = useMemo(() => ({
    y,
    opacity,
    scale,
    filter: isMobile ? 'none' : blurFilter, // Remove blur on mobile
  }), [y, opacity, scale, blurFilter, isMobile]);

  return (
    <section
      ref={ref}
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      <motion.div
        style={motionStyles}
        className="text-center z-10 w-full px-4"
      >
        {/* Tag - Faster animation on mobile */}
        <motion.div
          style={{ y: tagY }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: isMobile ? 0.3 : 0.5 }}
          className="mb-6"
        >
          <span className="inline-block px-4 py-2 glass rounded-full text-sm font-medium text-primary">
            ✦ Front-End Developer
          </span>
        </motion.div>

        {/* Heading - Responsive font sizes */}
        <motion.h1
          style={{ y: headingY }}
          className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-display font-bold leading-[0.95] mb-8"
        >
          <AnimatedLetters text="Hi, I'm" className="block" />
          <span className="block mt-2">
            {isMobile ? (
              // Skip typewriter on mobile for instant display
              <span>Youssef Ibrahim</span>
            ) : (
              <Suspense fallback={<span>Youssef Ibrahim</span>}>
                <TypewriterText text="Youssef Ibrahim" delay={0.1} />
              </Suspense>
            )}
          </span>
        </motion.h1>

        {/* Paragraph - Faster animation */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: isMobile ? 0.4 : 0.8, duration: isMobile ? 0.4 : 0.6 }}
          className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed px-4"
        >
          Front-End Developer with hands-on experience building modern,
          responsive, high-performance web applications using React.js,
          JavaScript (ES6+), and Tailwind CSS.
        </motion.p>

        {/* Buttons - Simplified for mobile */}
        <motion.div
          style={{ y: buttonsY }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: isMobile ? 0.5 : 1, duration: isMobile ? 0.4 : 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          {isMobile ? (
            // Skip lazy loading on mobile - reduces load time
            <>
              <button className="group px-8 py-4 bg-gradient-primary text-primary-foreground font-semibold rounded-full text-base hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 w-full sm:w-auto">
                <a href="#work" className="flex items-center justify-center gap-2">
                  View My Work
                  <span>→</span>
                </a>
              </button>

              <button 
                className="px-8 py-4 glass rounded-full text-base font-medium hover:bg-secondary-80 transition-all duration-300 w-full sm:w-auto"
                onClick={handleDownloadCV}
              >
                Download CV
              </button>
            </>
          ) : (
            <Suspense fallback={
              <div className="px-8 py-4 bg-gradient-primary text-primary-foreground font-semibold rounded-full">
                Loading...
              </div>
            }>
              <MagneticButton className="group px-8 py-4 bg-gradient-primary text-primary-foreground font-semibold rounded-full text-base hover:shadow-xl hover:shadow-primary/30 transition-all duration-300">
                <a href="#work" className="flex items-center gap-2">
                  View My Work
                  <motion.span
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  >
                    →
                  </motion.span>
                </a>
              </MagneticButton>

              <MagneticButton 
                className="px-8 py-4 glass rounded-full text-base font-medium hover:bg-secondary-80 transition-all duration-300"
                onClick={handleDownloadCV}
              >
                Download CV
              </MagneticButton>
            </Suspense>
          )}
        </motion.div>

        {/* Social Links */}
        <motion.div
          style={{ y: socialsY }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: isMobile ? 0.6 : 1.2, duration: isMobile ? 0.4 : 0.6 }}
          className="flex items-center justify-center gap-6"
        >
          {socialLinks.map((social, i) => (
            <SocialLink key={social.label} social={social} index={i} isMobile={isMobile} />
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: isMobile ? 0.8 : 1.5 }}
        style={{ opacity: scrollIndicatorOpacity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={isMobile ? {} : { y: [0, 10, 0] }}
          transition={isMobile ? {} : { 
            duration: 2, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-xs text-muted-foreground uppercase tracking-widest">
            Scroll
          </span>
          <ArrowDown className="w-4 h-4 text-primary" />
        </motion.div>
      </motion.div>

      {/* Background Grid - Simplified on mobile */}
      <motion.div
        style={{ 
          y: gridY, 
          opacity: gridOpacity,
          willChange: isMobile ? 'auto' : 'transform, opacity' // Remove will-change on mobile
        }}
        className={`absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.3)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.3)_1px,transparent_1px)] ${
          isMobile ? 'bg-[size:60px_60px]' : 'bg-[size:80px_80px]'
        } [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,black,transparent)]`}
      />
    </section>
  );
};