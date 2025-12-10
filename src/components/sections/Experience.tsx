import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Briefcase, Calendar, MapPin } from "lucide-react";
import { useScrollDirection } from "@/hooks/use-scroll-direction";

const experiences = [
  {
    title: "Junior Front End Developer",
    company: "Diet To Door",
    location: "Cairo, Egypt",
    period: "May 2022 – Jan 2024",
    description: "Developed and maintained responsive web pages for an e-commerce food delivery platform. Collaborated with designers to implement pixel-perfect UI components and optimize front-end performance.",
    achievements: [
      "Developed and maintained 10+ responsive web pages, improving load time by 25%",
      "Implemented pixel-perfect UI components with 100% Figma prototype alignment",
      "Integrated RESTful APIs for dynamic product data, reducing manual updates by 40%",
      "Conducted cross-browser testing across 5 major browsers ensuring consistent UX",
      "Resolved 95% of assigned Jira tickets before deadlines with zero critical bugs",
      "Optimized front-end code, increasing user session duration by 15%",
    ],
  },
  {
    title: "Front-End Developer (Self-Learning)",
    company: "Portfolio Projects & Continuous Learning",
    location: "Remote",
    period: "2022 – Present",
    description: "Building multiple portfolio projects demonstrating proficiency in modern web technologies, responsive design, and Agile development practices.",
    achievements: [
      "Completed Diet to Door e-commerce project with full responsive design",
      "Built Analog Clock & Stopwatch with interactive JavaScript components",
      "Developed Quiz App with dynamic question rendering and real-time scoring",
      "Mastered React.js, HTML, CSS, JavaScript, Bootstrap, Tailwind CSS, and SASS",
      "Learning latest front-end trends and best practices through hands-on projects",
    ],
  },
];

const Experience = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-100px" });
  const { scrollDirection } = useScrollDirection();

  return (
    <section id="experience" className="py-24 md:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/5 to-background" />
      
      <div className="container relative z-10 px-4 md:px-6">
        <div ref={ref} className="max-w-4xl mx-auto">
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
            <span className="text-primary font-heading font-semibold text-sm uppercase tracking-widest mb-4 block">
              Experience
            </span>
            <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              My <span className="gradient-text">Journey</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A timeline of my professional growth and achievements
            </p>
          </motion.div>

          {/* Timeline */}
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-0 md:left-1/2 transform md:-translate-x-px top-0 bottom-0 w-0.5 bg-border" />

            {experiences.map((exp, index) => (
              <motion.div
                key={exp.title + exp.company}
                initial={{
                  opacity: 0,
                  x: scrollDirection === 'up'
                    ? (index % 2 === 0 ? -50 : 50)
                    : (index % 2 === 0 ? 50 : -50),
                  y: scrollDirection === 'up' ? -30 : 30,
                }}
                animate={isInView ? { opacity: 1, x: 0, y: 0 } : {}}
                transition={{
                  delay: 0.15 + index * 0.2,
                  duration: 0.6,
                  type: "spring",
                  stiffness: 120,
                }}
                className={`relative mb-12 md:mb-0 md:pb-12 ${
                  index % 2 === 0 ? "md:pr-12 md:text-right" : "md:pl-12 md:ml-auto"
                } md:w-1/2`}
              >
                {/* Timeline Dot */}
                <motion.div
                  className="absolute left-0 md:left-auto md:right-0 transform -translate-x-1/2 md:translate-x-1/2 w-4 h-4 rounded-full bg-primary glow-primary"
                  animate={{
                    boxShadow: isInView
                      ? ["0 0 10px hsl(var(--primary) / 0.5)", "0 0 20px hsl(var(--primary) / 0.7)", "0 0 10px hsl(var(--primary) / 0.5)"]
                      : "0 0 0px hsl(var(--primary) / 0)",
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{
                    [index % 2 === 0 ? 'right' : 'left']: 0,
                    transform: index % 2 === 0 ? 'translateX(50%)' : 'translateX(-50%)'
                  }}
                />

                <motion.div
                  className="ml-8 md:ml-0 p-6 rounded-2xl glass hover:bg-card/80 transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : {}}
                  transition={{ delay: 0.25 + index * 0.2, duration: 0.5 }}
                >
                  {/* Header */}
                  <div className={`flex items-center gap-2 mb-2 ${index % 2 === 0 ? "md:justify-end" : ""}`}>
                    <Briefcase className="w-4 h-4 text-primary" />
                    <h3 className="font-heading font-bold text-xl text-foreground">
                      {exp.title}
                    </h3>
                  </div>

                  <p className="text-primary font-semibold mb-2">{exp.company}</p>

                  <div className={`flex flex-wrap gap-3 text-sm text-muted-foreground mb-4 ${index % 2 === 0 ? "md:justify-end" : ""}`}>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {exp.period}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {exp.location}
                    </span>
                  </div>

                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    {exp.description}
                  </p>

                  {/* Achievements */}
                  <ul className={`space-y-2 ${index % 2 === 0 ? "md:text-right" : ""}`}>
                    {exp.achievements.map((achievement, i) => (
                      <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                        {achievement}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
