import {
  motion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useRef, memo, useCallback } from "react"; // إضافة memo و useCallback
import { MagneticButton } from "./MagneticButton";
import { ArrowDown, Github, Linkedin } from "lucide-react";
import { TypewriterText } from "./AnimatedText";
import cvPdf from "../assets/Youssef_Ibrahim_Frontend_Developer_CV.pdf?url"; // تحسين استيراد الملف
import "./App.css";

// Memoizing the component prevents it from re-rendering due to parent state changes
export const HeroSection = memo(() => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Scroll-reactive transforms (All GPU accelerated where possible)
  const y = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.3, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.92, 0.85]);
  
  // REMOVED: blur filter to prevent Layout Thrashing (Critical Performance Fix)

  // Parallax for background and elements
  const gridY = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const gridOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const tagY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const headingY = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const buttonsY = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const socialsY = useTransform(scrollYProgress, [0, 1], [0, 350]);

  const socialLinks = [
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
  ];

  // Optimized event handler using useCallback
  const handleDownloadCV = useCallback(() => {
    const link = document.createElement("a");
    link.href = cvPdf;
    link.download = "cv.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [cvPdf]);

  return (
    <>
      <section
        ref={ref}
        id="home"
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
      >
        <motion.div
          style={{
            y,
            opacity,
            scale,
            // Removed blur() filter completely for 60fps performance
            willChange: 'transform, opacity', // Browser hint for optimization
          }}
          className="text-center z-10 bgggIm"
        >
          {/* Tag */}
          <motion.div
            style={{ y: tagY }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <span className="inline-block px-4 py-2 glass rounded-full text-sm font-medium text-primary">
              ✦ Front-End Developer
            </span>
          </motion.div>

          {/* Heading - Flattened DOM */}
          <motion.h1
            style={{ y: headingY }}
            className="text-5xl md:text-7xl lg:text-8xl font-display font-bold leading-[0.95] mb-8"
          >
            <span className="block">Hi, I'm</span>
            <span className="block mt-2">
              <TypewriterText text="Youssef Ibrahim" delay={0.1} />
            </span>
          </motion.h1>

          {/* Paragraph */}
          <motion.p
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            Front-End Developer with hands-on experience building modern,
            responsive, high-performance web applications using React.js,
            JavaScript (ES6+), and Tailwind CSS.
          </motion.p>

          {/* Buttons */}
          <motion.div
            style={{ y: buttonsY }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            {/* View My Work - Ensure Link covers the button area */}
            <MagneticButton className="group px-8 py-4 bg-gradient-primary text-primary-foreground font-semibold rounded-full text-base hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 relative overflow-hidden">
              <a 
                href="#work" 
                className="absolute inset-0 z-10 flex items-center justify-center gap-2 w-full h-full"
              >
                View My Work
                <motion.span
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  →
                </motion.span>
              </a>
            </MagneticButton>

            {/* Download CV - Using optimized callback */}
            <MagneticButton className="px-8 py-4 glass rounded-full text-base font-medium hover:bg-secondary-80 transition-all duration-300 relative overflow-hidden">
              <button
                onClick={handleDownloadCV}
                className="absolute inset-0 z-10 w-full h-full flex items-center justify-center"
              >
                Download CV
              </button>
            </MagneticButton>
          </motion.div>

          {/* Social Links */}
          <motion.div
            style={{ y: socialsY }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="flex items-center justify-center gap-6"
          >
            {socialLinks.map((social, i) => (
              <motion.a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 glass rounded-full hover:bg-primary/10 hover:border-primary/30 transition-all duration-300 group"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 + i * 0.1 }}
              >
                <social.icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </motion.a>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          style={{ opacity: useTransform(scrollYProgress, [0, 0.2], [1, 0]) }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 pointer-events-none"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center gap-2"
          >
            <span className="text-xs text-muted-foreground uppercase tracking-widest">
              Scroll
            </span>
            <ArrowDown className="w-4 h-4 text-primary" />
          </motion.div>
        </motion.div>

        {/* Background Grid */}
        <motion.div
          style={{ 
            y: gridY, 
            opacity: gridOpacity,
            willChange: 'transform, opacity' 
          }}
          className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.3)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.3)_1px,transparent_1px)] bg-[size:80px_80px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,black,transparent)] pointer-events-none z-0"
        />
      </section>
    </>
  );
});