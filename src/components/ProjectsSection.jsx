import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef, useState, MouseEvent } from "react";
import { ScrollReveal } from "./ScrollReveal";
import { AnimatedText } from "./AnimatedText";
import { ExternalLink, Github, Sparkles } from "lucide-react";

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
import dietToDoor from "../assets/diet to door .png";

/* =======================
   PROJECTS DATA
======================= */

 

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
   3D PROJECT CARD
======================= */

const ProjectCard = ({ project, index }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Mouse position for 3D effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring animation
  const springConfig = { damping: 25, stiffness: 150 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), springConfig);

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
    <ScrollReveal delay={index * 0.1}>
      <motion.div
        ref={cardRef}
        className="perspective-1000 relative"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX: isHovered ? rotateX : 0,
          rotateY: isHovered ? rotateY : 0,
        }}
      >
        <motion.div
          className="relative group rounded-2xl overflow-hidden glass-strong card-hover border-gradient preserve-3d"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          {/* Glow effect */}
          <motion.div
            className="absolute -inset-1 rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 -z-10"
            style={{
              background: `radial-gradient(circle at center, hsl(${project.color}, 0.4), transparent 70%)`,
            }}
          />

          {/* Image Container */}
          <div className="relative aspect-video overflow-hidden">
            <motion.div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${project.image})` }}
              animate={{ scale: isHovered ? 1.1 : 1 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            />

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />

            {/* Project number */}
            <motion.div
              className="absolute top-4 left-4 w-12 h-12 rounded-xl glass flex items-center justify-center"
              animate={{
                rotate: isHovered ? 360 : 0,
                scale: isHovered ? 1.1 : 1,
              }}
              transition={{ duration: 0.6 }}
            >
              <span
                className="text-lg font-bold"
                style={{ color: `hsl(${project.color})` }}
              >
                {String(index + 1).padStart(2, "0")}
              </span>
            </motion.div>

            {/* Featured badge */}
            {project.featured && (
              <motion.div
                className="absolute top-4 right-4 px-3 py-1.5 rounded-full glass flex items-center gap-1.5"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Sparkles className="w-3 h-3 text-primary" />
                <span className="text-xs font-medium text-primary">Featured</span>
              </motion.div>
            )}

            {/* Action buttons overlay */}
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
                  className="p-4 glass rounded-full hover:bg-primary/20 transition-colors"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{
                    scale: isHovered ? 1 : 0,
                    rotate: isHovered ? 0 : -180,
                  }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <ExternalLink className="w-5 h-5 text-primary" />
                </motion.a>
              )}
              {project.githubUrl && (
                <motion.a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 glass rounded-full hover:bg-accent/20 transition-colors"
                  initial={{ scale: 0, rotate: 180 }}
                  animate={{
                    scale: isHovered ? 1 : 0,
                    rotate: isHovered ? 0 : 180,
                  }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Github className="w-5 h-5 text-accent" />
                </motion.a>
              )}
            </motion.div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            <motion.h3
              className="text-xl font-bold font-display transition-colors duration-300"
              style={{ color: isHovered ? `hsl(${project.color})` : undefined }}
            >
              {project.title}
            </motion.h3>

            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
              {project.description}
            </p>

            {/* Technologies */}
            <div className="flex flex-wrap gap-2 pt-2">
              {project.technologies.slice(0, 4).map((tech, techIndex) => (
                <motion.span
                  key={tech}
                  className="px-3 py-1 text-xs font-medium bg-secondary/50 rounded-full border border-border/50"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * techIndex }}
                  whileHover={{
                    scale: 1.05,
                    backgroundColor: `hsl(${project.color}, 0.15)`,
                    borderColor: `hsl(${project.color}, 0.3)`,
                  }}
                >
                  {tech}
                </motion.span>
              ))}
              {project.technologies.length > 4 && (
                <span className="px-3 py-1 text-xs font-medium text-muted-foreground">
                  +{project.technologies.length - 4}
                </span>
              )}
            </div>
          </div>

          {/* Bottom accent line */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-1"
            style={{
              background: `linear-gradient(90deg, hsl(${project.color}), hsl(${project.color}, 0))`,
            }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: isHovered ? 1 : 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          />
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
    <section id="work" className="relative py-32 px-6 overflow-hidden noise-bg">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <ScrollReveal>
            <motion.span
              className="inline-block px-4 py-2 text-sm uppercase tracking-widest text-primary glass rounded-full mb-6"
              whileHover={{ scale: 1.05 }}
            >
              ✨ Selected Work
            </motion.span>
          </ScrollReveal>

          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold font-display">
            <AnimatedText text="Featured" />
            <span className="block text-gradient mt-2">
              <AnimatedText text="Projects" delay={0.3} />
            </span>
          </h2>

          <ScrollReveal delay={0.5}>
            <p className="mt-6 text-lg text-muted-foreground max-w-xl mx-auto">
              A collection of projects that showcase my skills in web development
            </p>
          </ScrollReveal>
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <ProjectCard key={project.title} project={project} index={index} />
          ))}
        </div>

        {/* View All Button */}
        <ScrollReveal className="flex justify-center mt-16">
          <motion.button
            className="btn-glass group flex items-center gap-3"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>View All Projects</span>
            <motion.span
              className="inline-block"
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              →
            </motion.span>
          </motion.button>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default ProjectsSection;
