import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { ScrollReveal } from "./ScrollReveal";
import { AnimatedText } from "./AnimatedText";
import { ExternalLink, Github } from "lucide-react";

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
  },
  {
    title: "Fit Tracker App (Calories Calculator)",
    description:
      "A fitness app that helps users calculate calories and track daily intake with a clean React UI.",
    image: youss,
    technologies: ["React", "JavaScript", "HTML", "CSS", "TailwindCSS"],
    liveUrl: "https://yossef-ibrahimm.github.io/calories-calculator/",
    githubUrl: "https://github.com/yossef-ibrahimm/calories-calculator",
    featured: false,
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
  },
  {
    title: "Interactive Card Validation",
    description: "A website that validates Visa card information dynamically.",
    image: cardValidation,
    technologies: ["JavaScript", "HTML", "CSS"],
    liveUrl: "https://yossef-ibrahimm.github.io/visa_card_validation/",
    githubUrl: "https://github.com/yossef-ibrahimm/visa_card_validation",
    featured: false,
  },
  {
    title: "Analog Clock & Stopwatch",
    description:
      "A responsive analog clock and stopwatch with smooth animations.",
    image: analogClock,
    technologies: ["JavaScript", "HTML", "CSS"],
    liveUrl: "https://yossef-ibrahimm.github.io/analogclock-stopwatch/",
    githubUrl: "https://github.com/yossef-ibrahimm/analogclock-stopwatch",
    featured: true,
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
  },
  {
    title: "Diet To Door Landing Page",
    description: "Responsive landing page for Diet To Door brand.",
    image: dietToDoor,
    technologies: ["HTML", "CSS", "JavaScript", "Bootstrap", "SASS"],
    liveUrl: "https://yossef-ibrahimm.github.io/diet-to-door/",
    githubUrl: "https://github.com/yossef-ibrahimm/diet-to-door",
    featured: true,
  },
];

/* =======================
   PROJECT CARD
======================= */
const ProjectCard = ({ project, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [100, 0, 0, -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0.3]);
  const scale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.9, 1, 1, 0.95]);
  const rotate = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [index % 2 === 0 ? -3 : 3, 0, index % 2 === 0 ? 3 : -3]
  );

  return (
    <motion.div ref={cardRef} style={{ y, opacity, scale, rotate }}>
      <motion.div
        className="group rounded-2xl overflow-hidden glass cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={{ y: -10 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {/* IMAGE */}
        <div className="relative aspect-[16/10] overflow-hidden">
          <motion.div
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${project.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
            animate={{ scale: isHovered ? 1.1 : 1 }}
            transition={{ duration: 0.6 }}
          />

          {/* INDEX */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              className="w-24 h-24 rounded-xl bg-card/80 backdrop-blur flex items-center justify-center"
              animate={{
                rotate: isHovered ? 10 : 0,
                scale: isHovered ? 1.1 : 1,
              }}
            >
              <span className="text-4xl font-bold text-gradient">
                {String(index + 1).padStart(2, "0")}
              </span>
            </motion.div>
          </div>

          {/* OVERLAY */}
          <motion.div
            className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
          >
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 glass rounded-full"
              >
                <ExternalLink />
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 glass rounded-full"
              >
                <Github />
              </a>
            )}
          </motion.div>
        </div>

        {/* CONTENT */}
        <div className="p-6 space-y-4">
          <h3 className="text-xl font-bold group-hover:text-gradient">
            {project.title}
          </h3>

          <p className="text-sm text-muted-foreground line-clamp-2">
            {project.description}
          </p>

          <div className="flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 text-xs bg-secondary rounded-full"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

/* =======================
   PROJECTS SECTION
======================= */
export const ProjectsSection = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const headerY = useTransform(scrollYProgress, [0, 0.3], [50, 0]);
  const headerOpacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);

  return (
    <section ref={containerRef} id="work" className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <motion.div style={{ y: headerY, opacity: headerOpacity }} className="mb-16">
          <span className="text-sm uppercase tracking-widest text-primary">
            Selected Work
          </span>
          <h2 className="text-4xl md:text-6xl font-bold mt-4">
            <AnimatedText text="Featured" />
            <span className="block text-gradient">
              <AnimatedText text="Projects" delay={0.3} />
            </span>
          </h2>
        </motion.div>

        {/* GRID */}
        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <ProjectCard key={index} project={project} index={index} />
          ))}
        </div>

        {/* BUTTON */}
        <ScrollReveal className="flex justify-center mt-16">
          <button className="px-8 py-4 glass rounded-full">
            View All Projects →
          </button>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default ProjectsSection;
