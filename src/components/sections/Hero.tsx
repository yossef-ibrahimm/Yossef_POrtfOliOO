import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowDown, Github, Linkedin, Mail } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";
import MagneticButton from "@/components/MagneticButton";
import TextReveal from "@/components/TextReveal";
import { useRef, useMemo } from "react";
import { useScrollDirection } from "@/hooks/use-scroll-direction";

const Hero = () => {
  const containerRef = useRef(null);
  const { scrollDirection } = useScrollDirection();
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Optimized transforms with better performance
  const y = useTransform(scrollYProgress, [0, 1], [0, 100], { clamp: true });
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0], { clamp: true });

  // Mouse parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Optimized spring config for smooth 60fps animations
  const springConfig = { damping: 30, stiffness: 100, mass: 0.5 };
  const mouseXSpring = useSpring(mouseX, springConfig);
  const mouseYSpring = useSpring(mouseY, springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set((e.clientX - centerX) * 0.01);
    mouseY.set((e.clientY - centerY) * 0.01);
  };

  // Memoize particles to prevent re-rendering on scroll
  const particles = useMemo(() => {
    // Reduce particles on mobile devices
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const particleCount = isMobile ? 50 : 100;
    
    return [...Array(particleCount)].map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      duration: 3 + Math.random() * 2,
      delay: Math.random() * 2,
    }));
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.06,
        delayChildren: 0,
      },
    },
  };

  const getItemVariants = (index: number) => ({
    hidden: {
      opacity: 0,
      y: scrollDirection === 'up' ? -30 : 30,
      x: scrollDirection === 'up' ? -15 : 15,
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut" as const,
        delay: index * 0.06,
      },
    },
  });

  return (
    <section 
      id="home" 
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* Background Image with Parallax */}
      <motion.div 
        className="absolute inset-0 z-0 will-change-transform"
        style={{ y, opacity }}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${heroBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/70 to-background" />
      </motion.div>

      {/* Animated particles/dots */}
      <div className="absolute inset-0 overflow-hidden">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-2 h-2 bg-primary/40 rounded-full"
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Content with Mouse Parallax */}
      <motion.div 
        className="container relative z-10 px-4 md:px-6 will-change-transform"
        style={{ 
          x: mouseXSpring,
          y: mouseYSpring,
        }}
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto text-center"
        >
          {/* Badge with pulse */}
          <motion.div variants={getItemVariants(0)} className="mb-6">
            <motion.span 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm font-medium text-primary"
              whileHover={{ scale: 1.05 }}
            >
              <motion.span 
                className="w-2 h-2 rounded-full bg-primary"
                animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
              Available for Hire
            </motion.span>
          </motion.div>

          {/* Name with Text Reveal */}
          <motion.h1
            variants={getItemVariants(1)}
            className="font-heading text-5xl md:text-7xl lg:text-8xl font-bold mb-4 tracking-tight"
          >
            <TextReveal text="Youssef" className="text-foreground" />
            {" "}
            <TextReveal text="Ibrahim" className="gradient-text" delay={0.2} />
          </motion.h1>

          {/* Role with typing effect style */}
          <motion.div variants={getItemVariants(2)} className="overflow-hidden mb-6">
            <motion.p
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.8, ease: "easeOut" }}
              className="text-xl md:text-2xl lg:text-3xl text-muted-foreground font-heading font-medium"
            >
              Junior Front-End Developer
            </motion.p>
          </motion.div>

          {/* Tagline */}
          <motion.p
            variants={getItemVariants(3)}
            className="text-lg md:text-xl text-muted-foreground/80 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Building responsive, user-friendly web applications with React.js and modern UI frameworks. 
            Passionate about pixel-perfect designs, performance optimization, and seamless user experiences.
          </motion.p>

          {/* CTA Buttons with Magnetic effect */}
          <motion.div
            variants={getItemVariants(4)}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
          >
            <MagneticButton>
              <Button variant="hero" size="xl" asChild>
                <a href="#contact">
                  <Mail className="w-5 h-5" />
                  Get In Touch
                </a>
              </Button>
            </MagneticButton>
            <MagneticButton>
              <Button variant="heroOutline" size="xl" asChild>
                <a href="/cv.pdf" download="Youssef_Ibrahim_CV.pdf">
                  <ArrowDown className="w-5 h-5" />
                  Download CV
                </a>
              </Button>
            </MagneticButton>
          </motion.div>

          {/* Social Links with stagger */}
          <motion.div
            variants={getItemVariants(5)}
            className="flex items-center justify-center gap-4"
            role="list"
          >
            {[
              { icon: Github, href: "https://github.com", label: "GitHub" },
              { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
              { icon: Mail, href: "mailto:yossef@example.com", label: "Email" },
            ].map((social, index) => (
              <MagneticButton key={social.label}>
                <motion.a
                  href={social.href}
                  target={social.href.startsWith("http") ? "_blank" : undefined}
                  rel={social.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="p-3 rounded-xl glass hover:bg-primary/10 hover:border-primary/50 transition-all duration-300 group block"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.08, duration: 0.6, ease: "easeOut" }}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={`Visit ${social.label}`}
                  role="listitem"
                >
                  <social.icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" aria-hidden="true" />
                  <span className="sr-only">{social.label}</span>
                </motion.a>
              </MagneticButton>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6, ease: "easeOut" }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        >
          <motion.a
            href="#about"
            className="flex flex-col items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <span className="text-sm font-medium">Scroll Down</span>
            <motion.div
              animate={{ y: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <ArrowDown className="w-5 h-5" />
            </motion.div>
          </motion.a>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
