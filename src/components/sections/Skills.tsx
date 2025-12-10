import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { useScrollDirection } from "@/hooks/use-scroll-direction";

const skills = [
  { name: "HTML", level: 95, category: "Frontend" },
  { name: "CSS", level: 92, category: "Frontend" },
  { name: "JavaScript", level: 90, category: "Frontend" },
  { name: "React.js", level: 85, category: "Frontend" },
  { name: "Bootstrap", level: 90, category: "Frontend" },
  { name: "Tailwind CSS", level: 88, category: "Frontend" },
  { name: "SASS", level: 85, category: "Frontend" },
  { name: "jQuery", level: 82, category: "Frontend" },
  { name: "Git & GitHub", level: 88, category: "Tools" },
  { name: "Chrome DevTools", level: 85, category: "Tools" },
];

const technologies = [
  "HTML", "CSS", "JavaScript", "React.js", "Bootstrap", 
  "Tailwind CSS", "SASS", "jQuery", "Git", "GitHub", "Chrome DevTools",
  "Responsive Design", "RESTful APIs", "MVC Architecture", "Figma Integration"
];

const Skills = () => {
  const ref = useRef(null);
  const containerRef = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-100px" });
  const [hoveredSkill, setHoveredSkill] = useState<number | null>(null);
  const { scrollDirection } = useScrollDirection();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, -100]);

  return (
    <section 
      id="skills" 
      ref={containerRef}
      className="py-24 md:py-32 relative overflow-hidden"
    >
      {/* Animated Background */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-b from-background via-secondary/5 to-background"
        style={{ y: backgroundY }}
      />
      
      <div className="container relative z-10 px-4 md:px-6">
        <div ref={ref} className="max-w-6xl mx-auto">
          {/* Section Header */}
          <motion.div
            initial={{
              opacity: 0,
              y: scrollDirection === 'up' ? -40 : 40,
              x: scrollDirection === 'up' ? -20 : 20,
            }}
            animate={isInView ? { opacity: 1, y: 0, x: 0 } : {}}
            transition={{ duration: 0.6, type: "spring", stiffness: 120 }}
            className="text-center mb-16"
          >
            <motion.span 
              className="text-primary font-heading font-semibold text-sm uppercase tracking-widest mb-4 block"
              initial={{ opacity: 0, letterSpacing: "0.1em", scale: 0.8 }}
              animate={isInView ? { opacity: 1, letterSpacing: "0.3em", scale: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Skills & Expertise
            </motion.span>
            <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Tech <span className="gradient-text">Stack</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Technologies and tools I work with daily
            </p>
          </motion.div>

          {/* Skills Grid with 3D Tilt */}
          <div className="grid md:grid-cols-2 gap-6 mb-16">
            {skills.map((skill, index) => {
              const isLeft = index % 2 === 0;
              return (
                <motion.div
                  key={skill.name}
                  initial={{
                    opacity: 0,
                    x: scrollDirection === 'up'
                      ? (isLeft ? -50 : 50)
                      : (isLeft ? 50 : -50),
                    y: scrollDirection === 'up' ? -30 : 30,
                  }}
                  animate={isInView ? { opacity: 1, x: 0, y: 0 } : {}}
                  transition={{
                    delay: 0.15 + index * 0.08,
                    duration: 0.5,
                    type: "spring",
                    stiffness: 140,
                  }}
                  onMouseEnter={() => setHoveredSkill(index)}
                  onMouseLeave={() => setHoveredSkill(null)}
                  whileHover={{ 
                    scale: 1.05,
                    rotateY: 5,
                    rotateX: -5,
                  }}
                  style={{ transformStyle: "preserve-3d", perspective: 1000 }}
                  className="p-5 rounded-xl glass hover:bg-card/80 transition-all duration-300 cursor-default"
                >
                  <div className="flex justify-between items-center mb-3">
                    <motion.span 
                      className="font-medium text-foreground"
                      animate={{ 
                        color: hoveredSkill === index ? "hsl(var(--primary))" : "hsl(var(--foreground))"
                      }}
                    >
                      {skill.name}
                    </motion.span>
                    <motion.span 
                      className="text-sm text-primary font-semibold"
                      initial={{ opacity: 0 }}
                      animate={isInView ? { opacity: 1 } : {}}
                      transition={{ delay: 0.5 + index * 0.05 }}
                    >
                      {skill.level}%
                    </motion.span>
                  </div>
                  <div className="h-2 bg-secondary/50 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full relative"
                      style={{
                        background: "linear-gradient(90deg, hsl(var(--primary)), hsl(var(--primary) / 0.6))",
                      }}
                      initial={{ width: 0 }}
                      animate={isInView ? { width: `${skill.level}%` } : { width: 0 }}
                      transition={{ delay: 0.3 + index * 0.08, duration: 0.8, ease: "easeOut" }}
                    >
                      {/* Shimmer effect */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                        initial={{ x: "-100%" }}
                        animate={isInView ? { x: "200%" } : {}}
                        transition={{ delay: 0.8 + index * 0.08, duration: 0.8 }}
                      />
                    </motion.div>
                  </div>
                  <motion.span 
                    className="text-xs text-muted-foreground mt-2 block"
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ delay: 0.5 + index * 0.08 }}
                  >
                    {skill.category}
                  </motion.span>
                </motion.div>
              );
            })}
          </div>

          {/* Technologies Cloud with Float Animation */}
          <motion.div
            initial={{
              opacity: 0,
              y: scrollDirection === 'up' ? -50 : 50,
            }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4, duration: 0.6, type: "spring", stiffness: 120 }}
            className="text-center"
          >
            <h3 className="font-heading text-2xl font-bold mb-8 text-foreground">
              All Technologies
            </h3>
            <div className="flex flex-wrap justify-center gap-3">
              {technologies.map((tech, index) => (
                <motion.span
                  key={tech}
                  initial={{
                    opacity: 0,
                    scale: 0.6,
                    y: scrollDirection === 'up' ? -30 : 30,
                    rotate: scrollDirection === 'up' ? -15 : 15,
                  }}
                  animate={isInView ? { 
                    opacity: 1, 
                    scale: 1, 
                    y: 0,
                    rotate: 0,
                  } : {}}
                  transition={{
                    delay: 0.5 + index * 0.04,
                    duration: 0.45,
                    type: "spring",
                    stiffness: 150,
                  }}
                  whileHover={{ 
                    scale: 1.2, 
                    y: -12,
                    boxShadow: "0 15px 40px hsl(var(--primary) / 0.4)",
                    rotateZ: 5,
                  }}
                  className="px-4 py-2 rounded-full glass text-sm font-medium text-muted-foreground hover:text-primary hover:border-primary/50 transition-all duration-300 cursor-default"
                >
                  {tech}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Skills;
