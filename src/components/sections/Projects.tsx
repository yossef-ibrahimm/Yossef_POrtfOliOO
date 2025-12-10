import { motion, useInView, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { ExternalLink, Github, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useScrollDirection, useScrollDynamicAnimation } from "@/hooks/use-scroll-direction";

import appDietToDoor from '../../assets/app diet to door.png';
import youss from '../../assets/Youss.png';
import weatherApp from '../../assets/weather app.png';
import cardValidation from '../../assets/card validation.jpg';
import analogClock from '../../assets/analog clock.png';
import quizApp from '../../assets/quiz app.png';
import dietToDoor from '../../assets/diet to door .png';

const projects = [
  {
    title: "Diet To Door App",
    description: "Diet To Door is a web application designed to help users select meals based on their caloric needs, leveraging the MVC (Model-View-Controller) architectural pattern for efficient and organized development. user: test password: 123456",
    image: appDietToDoor,
    technologies: ["HTML", "CSS", "JavaScript", "Bootstrap", "SASS", "jQuery"],
    liveUrl: "https://app.diettodoor.com/Login",
    githubUrl: "",
    featured: true,
  },
  {
    title: "Fit tracker App (Calories Calculator)",
    description: "My Fit App is a web-based fitness application that lets users track and manage their workouts.It provides an intuitive interface for logging exercises and planning training routines.The app helps users monitor progress and maintain a healthy lifestyle.Built with HTML, CSS, and JavaScript, it demonstrates interactive frontend design for fitness tracking.",
    image: youss,
    technologies: ["React", "JavaScript", "HTML", "CSS" , "tailwindcss"],
    liveUrl: "https://yossef-ibrahimm.github.io/calories-calculator/",
    githubUrl: "https://github.com/yossef-ibrahimm/calories-calculator",
    featured: false,
  },{
    title: "Weather App",
    description: "Weather app responsive 100% that allows two use lang",
    image: weatherApp,
    technologies: ["JavaScript", "HTML", "CSS"],
    liveUrl: "https://yossef-ibrahimm.github.io/Weather_App/",
    githubUrl: "https://github.com/yossef-ibrahimm/Weather_App",
    featured: false,
  },
  {
    title: "Interactive Card Validation",
    description: "Website that validates visa information",
    image: cardValidation,
    technologies: ["JavaScript", "HTML", "CSS"],
    liveUrl: "https://yossef-ibrahimm.github.io/visa_card_validation/",
    githubUrl: "https://github.com/yossef-ibrahimm/visa_card_validation",
    featured: false,
  },

  {
    title: "Analog Clock & Stopwatch",
    description: "A responsive analog clock is more than just a shape that displays the current time; it adapts seamlessly to different screen sizes while providing an accurate and interactive representation of time.",
    image: analogClock,
    technologies: ["JavaScript", "HTML", "CSS"],
    liveUrl: "https://yossef-ibrahimm.github.io/analogclock-stopwatch/",
    githubUrl: "https://github.com/yossef-ibrahimm/analogclock-stopwatch",
    featured: true,
  },
  {
    title: "Quiz App",
    description: "A fully responsive quiz app that dynamically loads questions and answers from a JSON file. It adjusts seamlessly to various screen sizes while providing an interactive and engaging quiz experience.",
    image: quizApp,
    technologies: ["JavaScript", "HTML", "CSS"],
    liveUrl: "https://yossef-ibrahimm.github.io/quiz-app/",
    githubUrl: "https://github.com/yossef-ibrahimm/quiz-app",
    featured: false,
  },
  {
    title: "Diet To Door Landing Page",
    description: "Diet to door responsive landing page",
    image: dietToDoor,
    technologies: ["HTML", "CSS", "JavaScript", "Bootstrap", "SASS", "jQuery"],
    liveUrl: "https://yossef-ibrahimm.github.io/diet-to-door/",
    githubUrl: "https://github.com/yossef-ibrahimm/diet-to-door",
    featured: true,
  },

];

const ProjectCard = ({ project, index }: { project: typeof projects[0]; index: number }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const { scrollDirection } = useScrollDirection();
  const dynamicAnim = useScrollDynamicAnimation(0, index);

  // 3D Tilt effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  return (
    <motion.div
      ref={cardRef}
      initial={dynamicAnim.getInitialState()}
      whileInView={dynamicAnim.getAnimateState()}
      exit={dynamicAnim.getExitState()}
      viewport={{ once: false, margin: "-80px" }}
      transition={dynamicAnim.getTransition()}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: isHovered ? rotateX : 0,
        rotateY: isHovered ? rotateY : 0,
        transformStyle: "preserve-3d",
      }}
      className="group relative rounded-2xl overflow-hidden glass cursor-pointer"
    >
      {/* Enhanced Glow effect on hover */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0 blur-xl"
        initial={false}
      />

      {/* Animated border glow */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        animate={{
          boxShadow: isHovered
            ? [
                "inset 0 0 20px rgba(64, 224, 208, 0.2), 0 0 30px rgba(64, 224, 208, 0.3)",
                "inset 0 0 30px rgba(64, 224, 208, 0.3), 0 0 40px rgba(64, 224, 208, 0.4)",
                "inset 0 0 20px rgba(64, 224, 208, 0.2), 0 0 30px rgba(64, 224, 208, 0.3)",
              ]
            : "inset 0 0 10px rgba(64, 224, 208, 0.1), 0 0 0px rgba(64, 224, 208, 0)",
        }}
        transition={{ duration: 2, repeat: isHovered ? Infinity : 0 }}
      />

      {/* Project Image */}
      <div className="relative h-56 overflow-hidden" style={{ transform: "translateZ(20px)" }}>
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-accent/0"
          animate={{
            opacity: isHovered ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
        />
        <motion.img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover"
          animate={{
            scale: isHovered ? 1.15 : 1,
            filter: isHovered ? "brightness(0.8)" : "brightness(1)",
          }}
          transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
        
        {/* Featured Badge with enhanced animation */}
        {project.featured && (
          <motion.span 
            className="absolute top-4 right-4 px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-semibold"
            whileHover={{ scale: 1.15 }}
            animate={{
              y: isHovered ? -5 : 0,
              boxShadow: isHovered
                ? "0 0 20px rgba(245, 169, 49, 0.6)"
                : "0 0 0px rgba(245, 169, 49, 0)",
            }}
            transition={{ duration: 0.3 }}
          >
            Featured
          </motion.span>
        )}

        {/* Enhanced overlay on hover */}
        <motion.div
          className="absolute inset-0 bg-primary/10 backdrop-blur-sm flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: isHovered ? 1 : 0, rotate: isHovered ? 0 : -180 }}
            transition={{ duration: 0.4, type: "spring", stiffness: 200 }}
            className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center shadow-lg"
          >
            <ExternalLink className="w-6 h-6 text-primary-foreground" />
          </motion.div>
        </motion.div>

        {/* Animated light particles */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100"
          animate={isHovered ? { opacity: [0, 0.5, 0] } : { opacity: 0 }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="absolute w-2 h-2 bg-primary rounded-full top-1/4 left-1/4 blur-sm" />
          <div className="absolute w-2 h-2 bg-accent rounded-full top-3/4 right-1/4 blur-sm" />
          <div className="absolute w-1 h-1 bg-primary rounded-full top-1/2 right-1/3 blur-sm" />
        </motion.div>
      </div>

      {/* Project Info */}
      <div className="p-6 relative z-10" style={{ transform: "translateZ(30px)" }}>
        <motion.h3 
          className="font-heading font-bold text-xl text-foreground mb-2 group-hover:text-primary transition-colors"
          initial={{ opacity: 0, y: 20, x: -20 }}
          whileInView={{ opacity: 1, y: 0, x: 0 }}
          viewport={{ once: false }}
          transition={{
            delay: index * 0.12 + 0.1,
            duration: 0.5,
            type: "spring",
            stiffness: 150,
          }}
          animate={{ x: isHovered ? 5 : 0 }}
        >
          {project.title}
        </motion.h3>
        <motion.p
          className="text-muted-foreground mb-4 line-clamp-2"
          initial={{ opacity: 0, y: 15, x: -15 }}
          whileInView={{ opacity: 1, y: 0, x: 0 }}
          viewport={{ once: false }}
          transition={{
            delay: index * 0.12 + 0.15,
            duration: 0.5,
            type: "spring",
            stiffness: 150,
          }}
          animate={{
            color: isHovered ? "hsl(210 40% 70%)" : "hsl(215 20% 55%)",
          }}
        >
          {project.description}
        </motion.p>

        {/* Technologies with enhanced animation */}
        <div className="flex flex-wrap gap-2 mb-6">
          {project.technologies.map((tech, i) => (
            <motion.span
              key={tech}
              className="px-2 py-1 rounded-md bg-gradient-to-r from-secondary/50 to-secondary/30 text-xs font-medium text-muted-foreground border border-primary/10"
              initial={{ opacity: 0, scale: 0.6, y: 20, x: -10 }}
              whileInView={{ opacity: 1, scale: 1, y: 0, x: 0 }}
              viewport={{ once: false }}
              transition={{
                delay: index * 0.12 + 0.2 + i * 0.04,
                duration: 0.45,
                type: "spring",
                stiffness: 160,
              }}
              whileHover={{
                scale: 1.15,
                backgroundColor: "hsl(192 91% 55% / 0.15)",
                color: "hsl(192 91% 55%)",
                boxShadow: "0 0 10px rgba(64, 224, 208, 0.4)",
              }}
            >
              {tech}
            </motion.span>
          ))}
        </div>

        {/* Action Buttons with enhanced effects */}
        <div className="flex items-center gap-3">
          <motion.div
            initial={{ opacity: 0, y: 25, scale: 0.8 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: false }}
            transition={{
              delay: index * 0.12 + 0.3,
              duration: 0.45,
              type: "spring",
              stiffness: 160,
            }}
            whileHover={{ scale: 1.08, y: -2 }}
            whileTap={{ scale: 0.92 }}
          >
            <Button variant="hero" size="sm" asChild className="relative overflow-hidden group/btn">
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                <motion.span
                  className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-0 group-hover/btn:opacity-20"
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <ExternalLink className="w-4 h-4" />
                Live Demo
              </a>
            </Button>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 25, scale: 0.8 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: false }}
            transition={{
              delay: index * 0.12 + 0.35,
              duration: 0.45,
              type: "spring",
              stiffness: 160,
            }}
            whileHover={{ scale: 1.08, y: -2 }}
            whileTap={{ scale: 0.92 }}
          >
            <Button variant="outline" size="sm" asChild className="relative overflow-hidden group/btn">
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                <motion.span
                  className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 opacity-0 group-hover/btn:opacity-100"
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <Github className="w-4 h-4" />
                Code
              </a>
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Hover Arrow with enhanced animation */}
      <motion.div
        className="absolute top-6 right-6 opacity-0 group-hover:opacity-100"
        animate={{ x: isHovered ? 5 : -10, y: isHovered ? -5 : 0 }}
        transition={{ duration: 0.4, type: "spring", stiffness: 200 }}
      >
        <motion.div
          animate={{ rotate: isHovered ? 360 : 0 }}
          transition={{ duration: 0.6, type: "spring" }}
        >
          <ChevronRight className="w-6 h-6 text-primary drop-shadow-lg" />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

const Projects = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-100px" });

  return (
    <section id="projects" className="py-24 md:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/5 to-background" />
      
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-10 left-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
          animate={{
            x: [0, 50, -30, 0],
            y: [0, -30, 50, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute bottom-10 right-10 w-80 h-80 bg-accent/5 rounded-full blur-3xl"
          animate={{
            x: [0, -50, 30, 0],
            y: [0, 30, -50, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        />
      </div>
      
      <div className="container relative z-10 px-4 md:px-6">
        <div ref={ref} className="max-w-6xl mx-auto">
          {/* Section Header with enhanced animations */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
            className="text-center mb-16"
          >
            <motion.span 
              className="text-primary font-heading font-semibold text-sm uppercase tracking-widest mb-4 block"
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={isInView ? { opacity: 1, scale: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.05 }}
            >
              Portfolio
            </motion.span>
            <motion.h2
              className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
              initial={{ opacity: 0, y: 25 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 25 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Featured{" "}
              <motion.span
                className="gradient-text block md:inline"
                animate={{
                  backgroundPosition: ["0% center", "100% center", "0% center"],
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                Projects
              </motion.span>
            </motion.h2>
            <motion.p
              className="text-lg text-muted-foreground max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 15 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              A collection of my best work showcasing my skills and experience
            </motion.p>
          </motion.div>

          {/* Projects Grid */}
          <div className="grid md:grid-cols-2 gap-8" style={{ perspective: "1000px" }}>
            {projects.map((project, index) => (
              <ProjectCard key={project.title} project={project} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Projects;
