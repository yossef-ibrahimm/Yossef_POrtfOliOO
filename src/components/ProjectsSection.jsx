import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { ScrollReveal } from "./ScrollReveal";
import { AnimatedText } from "./AnimatedText";
import { ExternalLink, Github, Sparkles, ArrowUpRight } from "lucide-react";

/* =======================
   PROJECTS DATA
======================= */

// Images
import appDietToDoor from "../assets/app diet to door.png";
import youss from "../assets/Youss.png";
import weatherApp from "../assets/weather app.png";
import cardValidation from "../assets/card validation.jpg";
import analogClock from "../assets/analog clock.png";
import quizApp from "../assets/quiz app.png";

const projects = [
  {
    title: "Diet To Door App",
    description:
      "Diet To Door is a web application designed to help users select meals based on their caloric needs using MVC architecture.",
    image: appDietToDoor,
    technologies: ["HTML", "CSS", "JavaScript", "Bootstrap", "SASS", "jQuery"],
    liveUrl: "https://app.diettodoor.com/Login",
    githubUrl: "",
    featured: true,
    color: "175, 80%, 50%",
  },
  {
    title: "Fit Tracker App",
    description:
      "A fitness app that helps users calculate calories and track daily intake with a clean React UI.",
    image: youss,
    technologies: ["React", "JavaScript", "TailwindCSS"],
    liveUrl: "https://yossef-ibrahimm.github.io/calories-calculator/",
    githubUrl: "https://github.com/yossef-ibrahimm/calories-calculator",
    featured: false,
    color: "280, 70%, 60%",
  },
  {
    title: "Weather App",
    description:
      "A fully responsive weather app supporting multi-language display.",
    image: weatherApp,
    technologies: ["JavaScript", "HTML", "CSS"],
    liveUrl: "https://yossef-ibrahimm.github.io/Weather_App/",
    githubUrl: "https://github.com/yossef-ibrahimm/Weather_App",
    featured: false,
    color: "200, 80%, 50%",
  },
  {
    title: "Card Validation",
    description: "A website that validates Visa card information dynamically.",
    image: cardValidation,
    technologies: ["JavaScript", "HTML", "CSS"],
    liveUrl: "https://yossef-ibrahimm.github.io/visa_card_validation/",
    githubUrl: "https://github.com/yossef-ibrahimm/visa_card_validation",
    featured: false,
    color: "45, 90%, 50%",
  },
  {
    title: "Analog Clock",
    description:
      "A responsive analog clock and stopwatch with smooth animations.",
    image: analogClock,
    technologies: ["JavaScript", "HTML", "CSS"],
    liveUrl: "https://yossef-ibrahimm.github.io/analogclock-stopwatch/",
    githubUrl: "https://github.com/yossef-ibrahimm/analogclock-stopwatch",
    featured: true,
    color: "330, 80%, 60%",
  },
  {
    title: "Quiz App",
    description:
      "A responsive quiz app that loads questions dynamically from JSON.",
    image: quizApp,
    technologies: ["JavaScript", "HTML", "CSS"],
    liveUrl: "https://yossef-ibrahimm.github.io/quiz-app/",
    githubUrl: "https://github.com/yossef-ibrahimm/quiz-app",
    featured: false,
    color: "140, 70%, 45%",
  },
];

/* =======================
   3D PROJECT CARD - OPTIMIZED
======================= */

const ProjectCard = ({ project, index }) => {
  const cardRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  // Mouse position for 3D effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring animation with optimized config
  const springConfig = { damping: 30, stiffness: 200, mass: 0.5 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [5, -5]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-5, 5]), springConfig);
  
  // Parallax effect for image
  const imageX = useSpring(useTransform(mouseX, [-0.5, 0.5], [-20, 20]), springConfig);
  const imageY = useSpring(useTransform(mouseY, [-0.5, 0.5], [-20, 20]), springConfig);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  };

  return (
    <ScrollReveal delay={index * 0.08}>
      <motion.div
        ref={cardRef}
        className="perspective-1000 relative h-full"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
      >
        <motion.div
          className="relative group rounded-3xl overflow-hidden glass-strong card-hover border border-border/50 h-full flex flex-col"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: index * 0.1 }}
        >
          {/* Animated Glow Effect */}
          <motion.div
            className="absolute -inset-[2px] rounded-3xl opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-700 -z-10"
            animate={isHovered ? {
              background: [
                `radial-gradient(circle at 0% 0%, hsl(${project.color}, 0.6), transparent 50%)`,
                `radial-gradient(circle at 100% 0%, hsl(${project.color}, 0.6), transparent 50%)`,
                `radial-gradient(circle at 100% 100%, hsl(${project.color}, 0.6), transparent 50%)`,
                `radial-gradient(circle at 0% 100%, hsl(${project.color}, 0.6), transparent 50%)`,
                `radial-gradient(circle at 0% 0%, hsl(${project.color}, 0.6), transparent 50%)`,
              ],
            } : {}}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />

          {/* Image Container with Parallax */}
          <div className="relative aspect-[4/3] overflow-hidden">
            <motion.div
              className="absolute inset-0 bg-cover bg-center will-change-transform"
              style={{ 
                backgroundImage: `url(${project.image})`,
                x: imageX,
                y: imageY,
              }}
              animate={{ 
                scale: isHovered ? 1.15 : 1,
              }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            />

            {/* Gradient overlay with animation */}
            <motion.div 
              className="absolute inset-0 bg-gradient-to-t from-card via-card/60 to-transparent"
              animate={{
                opacity: isHovered ? 0.95 : 1,
              }}
              transition={{ duration: 0.4 }}
            />

            {/* Animated scanline effect */}
            <motion.div
              className="absolute inset-0 opacity-0 group-hover:opacity-20"
              style={{
                background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)",
              }}
              animate={isHovered ? {
                y: ["-100%", "100%"],
              } : {}}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear",
              }}
            />

            {/* Project Number with Morphing Effect */}
            <motion.div
              className="absolute top-4 left-4 w-14 h-14 rounded-2xl glass flex items-center justify-center overflow-hidden"
              animate={{
                rotate: isHovered ? [0, 360] : 0,
                scale: isHovered ? [1, 1.1, 1] : 1,
                borderRadius: isHovered ? ["1rem", "50%", "1rem"] : "1rem",
              }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            >
              <motion.span
                className="text-xl font-bold relative z-10"
                style={{ color: `hsl(${project.color})` }}
                animate={{
                  scale: isHovered ? [1, 1.2, 1] : 1,
                }}
                transition={{ duration: 0.5 }}
              >
                {String(index + 1).padStart(2, "0")}
              </motion.span>
              
              {/* Animated background circles */}
              <motion.div
                className="absolute inset-0 opacity-20"
                style={{ background: `hsl(${project.color})` }}
                animate={isHovered ? {
                  scale: [0, 2],
                  opacity: [0.3, 0],
                } : {}}
                transition={{ duration: 1, repeat: Infinity }}
              />
            </motion.div>

            {/* Featured Badge with Pulse */}
            {project.featured && (
              <motion.div
                className="absolute top-4 right-4 px-4 py-2 rounded-full glass flex items-center gap-2 overflow-hidden"
                initial={{ opacity: 0, x: 20, scale: 0.8 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
              >
                <motion.div
                  animate={{
                    rotate: [0, 360],
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="w-4 h-4 text-primary" />
                </motion.div>
                <span className="text-xs font-semibold text-primary">Featured</span>
                
                {/* Pulse effect */}
                <motion.div
                  className="absolute inset-0 bg-primary/20 rounded-full"
                  animate={{
                    scale: [1, 1.5],
                    opacity: [0.5, 0],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.div>
            )}

            {/* Action Buttons with Creative Animations */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {project.liveUrl && (
                <motion.a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative p-5 glass rounded-2xl hover:bg-primary/20 transition-colors group/btn overflow-hidden"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{
                    scale: isHovered ? 1 : 0,
                    rotate: isHovered ? 0 : -180,
                  }}
                  transition={{ type: "spring", stiffness: 300, delay: 0.05 }}
                  whileHover={{ scale: 1.15, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <ExternalLink className="w-6 h-6 text-primary relative z-10" />
                  
                  {/* Ripple effect */}
                  <motion.div
                    className="absolute inset-0 bg-primary/30 rounded-2xl"
                    initial={{ scale: 0, opacity: 0.5 }}
                    whileHover={{
                      scale: [0, 2],
                      opacity: [0.5, 0],
                    }}
                    transition={{ duration: 0.6 }}
                  />
                </motion.a>
              )}
              {project.githubUrl && (
                <motion.a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative p-5 glass rounded-2xl hover:bg-accent/20 transition-colors overflow-hidden"
                  initial={{ scale: 0, rotate: 180 }}
                  animate={{
                    scale: isHovered ? 1 : 0,
                    rotate: isHovered ? 0 : 180,
                  }}
                  transition={{ type: "spring", stiffness: 300, delay: 0.1 }}
                  whileHover={{ scale: 1.15, rotate: -5 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Github className="w-6 h-6 text-accent relative z-10" />
                  
                  {/* Ripple effect */}
                  <motion.div
                    className="absolute inset-0 bg-accent/30 rounded-2xl"
                    initial={{ scale: 0, opacity: 0.5 }}
                    whileHover={{
                      scale: [0, 2],
                      opacity: [0.5, 0],
                    }}
                    transition={{ duration: 0.6 }}
                  />
                </motion.a>
              )}
            </motion.div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4 flex-1 flex flex-col">
            <motion.h3
              className="text-xl font-bold font-display transition-all duration-500"
              animate={{
                color: isHovered ? `hsl(${project.color})` : undefined,
              }}
            >
              {project.title}
            </motion.h3>

            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 flex-1">
              {project.description}
            </p>

            {/* Technologies with Wave Animation */}
            <div className="flex flex-wrap gap-2 pt-2">
              {project.technologies.slice(0, 4).map((tech, techIndex) => (
                <motion.span
                  key={tech}
                  className="px-3 py-1.5 text-xs font-medium bg-secondary/50 rounded-full border border-border/50 relative overflow-hidden"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * techIndex }}
                  whileHover={{
                    scale: 1.1,
                    y: -2,
                  }}
                >
                  <span className="relative z-10">{tech}</span>
                  
                  {/* Hover wave effect */}
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    style={{ background: `hsl(${project.color}, 0.2)` }}
                    initial={{ scale: 0, opacity: 0 }}
                    whileHover={{
                      scale: 1,
                      opacity: 1,
                    }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.span>
              ))}
              {project.technologies.length > 4 && (
                <motion.span 
                  className="px-3 py-1.5 text-xs font-medium text-muted-foreground"
                  whileHover={{ scale: 1.05 }}
                >
                  +{project.technologies.length - 4}
                </motion.span>
              )}
            </div>
          </div>

          {/* Animated Bottom Accent Line */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-1 overflow-hidden"
          >
            <motion.div
              className="h-full"
              style={{
                background: `linear-gradient(90deg, transparent, hsl(${project.color}), transparent)`,
              }}
              initial={{ x: "-100%" }}
              animate={{ x: isHovered ? "100%" : "-100%" }}
              transition={{ 
                duration: 1.5, 
                repeat: isHovered ? Infinity : 0,
                ease: "easeInOut" 
              }}
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </ScrollReveal>
  );
};

/* =======================
   PROJECTS SECTION
======================= */
export const ProjectsSection = () => {
  return (
    <section id="work" className="relative py-24 md:py-32 px-4 md:px-6 overflow-hidden noise-bg">
      {/* Animated Background Effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div 
          className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
            x: [0, 50, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-1/4 -right-32 w-96 h-96 bg-accent/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.5, 0.3],
            x: [0, -50, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16 md:mb-20">
          <ScrollReveal>
            <motion.span
              className="inline-block px-5 py-2.5 text-sm uppercase tracking-widest text-primary glass rounded-full mb-6 relative overflow-hidden group"
              whileHover={{ scale: 1.05 }}
            >
              <span className="relative z-10 flex items-center gap-2">
                <motion.span
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  ✨
                </motion.span>
                Selected Work
              </span>
              <motion.div
                className="absolute inset-0 bg-primary/20"
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.5 }}
              />
            </motion.span>
          </ScrollReveal>

          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold font-display">
            <AnimatedText text="Featured" />
            <span className="block text-gradient mt-2">
              <AnimatedText text="Projects" delay={0.3} />
            </span>
          </h2>

          <ScrollReveal delay={0.5}>
            <p className="mt-6 text-base md:text-lg text-muted-foreground max-w-xl mx-auto">
              A collection of projects that showcase my skills in web development
            </p>
          </ScrollReveal>
        </div>

        {/* Projects Grid - Optimized */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {projects.map((project, index) => (
            <ProjectCard key={project.title} project={project} index={index} />
          ))}
        </div>

        {/* View All Button with Creative Animation */}
        <ScrollReveal className="flex justify-center mt-12 md:mt-16">
          <motion.button
            className="relative px-8 py-4 btn-glass group flex items-center gap-3 overflow-hidden"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="relative z-10">View All Projects</span>
            <motion.span
              className="relative z-10"
              animate={{ 
                x: [0, 5, 0],
                rotate: [0, 45, 0],
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ArrowUpRight className="w-5 h-5" />
            </motion.span>
            
            {/* Animated background */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20"
              initial={{ x: "-100%", skewX: -20 }}
              whileHover={{ x: "100%" }}
              transition={{ duration: 0.6 }}
            />
          </motion.button>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default ProjectsSection;