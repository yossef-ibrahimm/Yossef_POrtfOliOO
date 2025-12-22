import { motion, useScroll, useTransform, useMotionValue ,useSpring  } from "framer-motion";
import { useRef , useState , useEffect } from "react";
import { MagneticButton } from "./MagneticButton";
import { ArrowDown, Github, Linkedin, Twitter } from "lucide-react";
import { TypewriterText } from "./AnimatedText";
import "./App.css";

  

// AnimatedLetters & AnimatedText placeholders
const AnimatedLetters = ({ text, className }) => (
  <span className={className}>{text}</span>
);
const AnimatedText = ({ text, delay = 0 }) => (
  <span style={{ animationDelay: `${delay}s` }}>{text}</span>
);

export const HeroSection = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Scroll-reactive transforms
  const y = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.3, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.92, 0.85]);
  const blur = useTransform(scrollYProgress, [0, 0.5], [0, 10]);

  // Parallax for background and elements
  const gridY = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const gridOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const tagY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const headingY = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const buttonsY = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const socialsY = useTransform(scrollYProgress, [0, 1], [0, 350]);

  const socialLinks = [
    { icon: Github, href: "https://github.com/yossef-ibrahimm", label: "GitHub" },
    { icon: Linkedin, href: "https://linkedin.com/in/yossef-ibrahim", label: "LinkedIn" },
  ];

  return (
    <> 
    <section
      ref={ref}
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden   "
      
    >
      <motion.div
        style={{
          y,
          opacity,
          scale,
          filter: useTransform(blur, (v) => `blur(${v}px)`),
        }}
        className="  text-center z-10 bgggIm"
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

        {/* Heading */}
        <motion.h1
          style={{ y: headingY }}
          className="text-5xl md:text-7xl lg:text-8xl font-display font-bold leading-[0.95] mb-8"
        >
          <AnimatedLetters text="Hi, I'm" className="block" />
          <span className="block mt-2">
            <TypewriterText text="Youssef Ibrahim" delay={0.1} />
           {/* 
             */}
          </span>
        </motion.h1>

        {/* Paragraph */}
        <motion.p
/*         style={{transform:"translateX(0px) !important" }}
 */        /* initial={{ x: 30 }} */
         animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed"
        >
          Front-End Developer with hands-on experience building modern, responsive, high-performance web applications using React.js, JavaScript (ES6+), and Tailwind CSS.
        </motion.p>

        {/* Buttons */}
        <motion.div
          style={{ y: buttonsY }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <MagneticButton className="group px-8 py-4 bg-gradient-primary text-primary-foreground font-semibold rounded-full text-base hover:shadow-xl hover:shadow-primary/30 transition-all duration-300">
            <a className="flex items-center gap-2" href="#work">
              View My Work 
              <motion.button
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                →
              </motion.button>
            </a>
          </MagneticButton>

          <MagneticButton className="px-8 py-4 glass rounded-full text-base font-medium hover:bg-secondary-80 transition-all duration-300">
            <button
              onClick={() => {
                const link = document.createElement('a');
                link.href = '/src/assets/cv.pdf';
                link.download = 'Youssef_Ibrahim_CV.pdf';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
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
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-xs text-muted-foreground uppercase tracking-widest">Scroll</span>
          <ArrowDown className="w-4 h-4 text-primary" />
        </motion.div>
      </motion.div>

      {/* Background Grid */}
      <motion.div
        style={{ y: gridY, opacity: gridOpacity }}
        className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.3)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.3)_1px,transparent_1px)] bg-[size:80px_80px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,black,transparent)]"
      />
    </section></>
   
  );
};
