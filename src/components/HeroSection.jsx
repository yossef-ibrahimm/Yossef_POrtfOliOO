import { motion, useScroll, useTransform, useSpring, useReducedMotion } from "framer-motion";
import { useRef, useMemo, memo, lazy, Suspense } from "react";
import { ArrowDown, Github, Linkedin } from "lucide-react";

// Lazy load heavy components
const MagneticButton = lazy(() => import('./MagneticButton').then(m => ({ default: m.MagneticButton })));
const TypewriterText = lazy(() => import('./AnimatedText').then(m => ({ default: m.TypewriterText })));

// Memoized lightweight components
const AnimatedLetters = memo(({ text, className }) => <span className={className}>{text}</span>);
const SocialLink = memo(({ social, index }) => (
  <motion.a
    href={social.href}
    target="_blank"
    rel="noopener noreferrer"
    className="p-3 glass rounded-full hover:bg-primary/10 hover:border-primary/30 transition-all duration-300 group"
    whileHover={{ scale: 1.05, y: -1 }}
    whileTap={{ scale: 0.95 }}
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 1 + index * 0.1, duration: 0.5 }}
  >
    <social.icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
  </motion.a>
));

export const HeroSection = () => {
  const ref = useRef(null);
  const reducedMotion = useReducedMotion();
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const disableHeavyMotion = reducedMotion || isMobile;

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 50, damping: 20, mass: 0.3 });

  const y = disableHeavyMotion ? 0 : useTransform(smoothProgress, [0, 1], [0, 200]);
  const opacity = disableHeavyMotion ? 1 : useTransform(smoothProgress, [0, 0.5, 1], [1, 0.7, 0]);
  const scale = disableHeavyMotion ? 1 : useTransform(smoothProgress, [0, 1], [1, 0.95]);
  const blurFilter = disableHeavyMotion ? "none" : useTransform(useTransform(smoothProgress, [0, 0.5], [0, 5]), v => `blur(${v}px)`);

  const gridY = disableHeavyMotion ? 0 : useTransform(smoothProgress, [0, 1], [0, -50]);
  const gridOpacity = disableHeavyMotion ? 0.5 : useTransform(smoothProgress, [0, 0.8], [1, 0]);

  const tagY = disableHeavyMotion ? 0 : useTransform(smoothProgress, [0, 1], [0, 100]);
  const headingY = disableHeavyMotion ? 0 : useTransform(smoothProgress, [0, 1], [0, 150]);
  const buttonsY = disableHeavyMotion ? 0 : useTransform(smoothProgress, [0, 1], [0, 200]);
  const socialsY = disableHeavyMotion ? 0 : useTransform(smoothProgress, [0, 1], [0, 250]);
  const scrollIndicatorOpacity = disableHeavyMotion ? 1 : useTransform(smoothProgress, [0, 0.2], [1, 0]);

  const socialLinks = useMemo(() => [
    { icon: Github, href: "https://github.com/yossef-ibrahimm", label: "GitHub" },
    { icon: Linkedin, href: "https://linkedin.com/in/yossef-ibrahim", label: "LinkedIn" },
  ], []);

  const handleDownloadCV = useMemo(() => () => {
    const link = document.createElement("a");
    link.href = "/assets/Youssef_Ibrahim_Frontend_Developer_CV.pdf";
    link.download = "Youssef_Ibrahim_CV.pdf";
    link.click();
  }, []);

  return (
    <section ref={ref} id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <motion.div style={{ y, opacity, scale, filter: blurFilter }} className="text-center z-10 w-full px-4">
        {/* Tag */}
        <motion.div style={{ y: tagY }} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="mb-6">
          <span className="inline-block px-4 py-2 glass rounded-full text-sm font-medium text-primary">✦ Front-End Developer</span>
        </motion.div>

        {/* Heading */}
        <motion.h1 style={{ y: headingY }} className="text-5xl md:text-7xl lg:text-8xl font-display font-bold leading-[0.95] mb-8">
          <AnimatedLetters text="Hi, I'm" className="block" />
          <span className="block mt-2">
            <Suspense fallback={<span>Youssef Ibrahim</span>}>
              <TypewriterText text="Youssef Ibrahim" delay={0.1} />
            </Suspense>
          </span>
        </motion.h1>

        {/* Paragraph */}
        <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.5 }} className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed">
          Front-End Developer with hands-on experience building modern, responsive, high-performance web applications using React.js, JavaScript (ES6+), and Tailwind CSS.
        </motion.p>

        {/* Buttons */}
        <motion.div style={{ y: buttonsY }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1, duration: 0.5 }} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Suspense fallback={<div className="px-8 py-4 bg-gradient-primary text-primary-foreground font-semibold rounded-full">Loading...</div>}>
            <MagneticButton className="group px-8 py-4 bg-gradient-primary text-primary-foreground font-semibold rounded-full text-base hover:shadow-lg hover:shadow-primary/20 transition-all duration-300">
              <a href="#work" className="flex items-center gap-2">View My Work →</a>
            </MagneticButton>
            <MagneticButton className="px-8 py-4 glass rounded-full text-base font-medium hover:bg-secondary-80 transition-all duration-300" onClick={handleDownloadCV}>
              Download CV
            </MagneticButton>
          </Suspense>
        </motion.div>

        {/* Social Links */}
        <motion.div style={{ y: socialsY }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2, duration: 0.5 }} className="flex items-center justify-center gap-6">
          {socialLinks.map((social, i) => <SocialLink key={social.label} social={social} index={i} />)}
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      {!disableHeavyMotion && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }} style={{ opacity: scrollIndicatorOpacity }} className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} className="flex flex-col items-center gap-2">
            <span className="text-xs text-muted-foreground uppercase tracking-widest">Scroll</span>
            <ArrowDown className="w-4 h-4 text-primary" />
          </motion.div>
        </motion.div>
      )}

      {/* Background Grid */}
      <motion.div style={{ y: gridY, opacity: gridOpacity, willChange: "transform, opacity" }} className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.3)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.3)_1px,transparent_1px)] bg-[size:80px_80px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,black,transparent)]" />
    </section>
  );
};
