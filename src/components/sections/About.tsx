import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Code2, Sparkles, Zap, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useScrollDirection, useScrollDynamicAnimation } from "@/hooks/use-scroll-direction";

const About = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-100px" });
  const { scrollDirection } = useScrollDirection();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const getItemVariants = (index: number) => {
    const isUp = scrollDirection === 'up';
    return {
      hidden: {
        opacity: 0,
        y: isUp ? -40 : 40,
        x: isUp ? -20 : 20,
      },
      visible: {
        opacity: 1,
        y: 0,
        x: 0,
        transition: {
          duration: 0.5,
          ease: "easeOut" as const,
          delay: index * 0.12,
        },
      },
    };
  };

  const features = [
    {
      icon: Code2,
      title: "Responsive Design",
      description: "Building pixel-perfect responsive web applications across desktop, tablet, and mobile devices",
    },
    {
      icon: Sparkles,
      title: "Modern Frameworks",
      description: "Expert in React.js, Bootstrap, Tailwind CSS, and SASS for stunning UI components",
    },
    {
      icon: Zap,
      title: "Performance Optimization",
      description: "Optimizing code efficiency, API integration, and improving page load times by 25%+",
    },
  ];

  return (
    <section id="about" className="py-24 md:py-32 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/5 to-background" />
      
      <div className="container relative z-10 px-4 md:px-6">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="max-w-6xl mx-auto"
        >
          {/* Section Header */}
          <motion.div variants={getItemVariants(0)} className="text-center mb-16">
            <span className="text-primary font-heading font-semibold text-sm uppercase tracking-widest mb-4 block">
              About Me
            </span>
            <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Turning Ideas Into{" "}
              <span className="gradient-text">Digital Reality</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Turning complex problems into elegant solutions
            </p>
          </motion.div>

          {/* Content Grid */}
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Text Content */}
            <motion.div variants={getItemVariants(1)} className="space-y-6">
              <p className="text-lg text-muted-foreground leading-relaxed">
                I'm <span className="text-foreground font-semibold">Youssef Ibrahim</span>, 
                a Junior Front-End Developer with 1.5+ years of experience building responsive, 
                user-friendly web applications. I specialize in creating pixel-perfect UI components 
                and optimizing front-end performance.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                At <span className="text-primary font-medium">Diet To Door</span>, I developed and maintained 10+ responsive 
                web pages, improved load times by 25%, and successfully integrated RESTful APIs. 
                My expertise includes HTML, CSS, JavaScript, React.js, Bootstrap, Tailwind CSS, and SASS, 
                with proven ability to deliver on-time sprint tasks with zero critical bugs.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                I'm passionate about cross-browser testing, Agile development, and continuous learning 
                of emerging technologies. Currently pursuing Computer Science at Culture & Science City.
              </p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <Button asChild size="lg" className="w-full sm:w-auto">
                  <a href="/cv.pdf" download="Youssef_Ibrahim_CV.pdf">
                    <Download className="w-5 h-5" />
                    Download CV
                  </a>
                </Button>
              </motion.div>
            </motion.div>

            {/* Feature Cards */}
            <motion.div variants={getItemVariants(2)} className="space-y-4">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  className="p-6 rounded-2xl glass hover:bg-card/80 transition-all duration-300 group cursor-default"
                  whileHover={{ x: 10, scale: 1.02 }}
                  initial={{
                    opacity: 0,
                    x: scrollDirection === 'up' ? -30 : 30,
                    y: scrollDirection === 'up' ? -20 : 20,
                  }}
                  animate={isInView ? { opacity: 1, x: 0, y: 0 } : {}}
                  transition={{
                    delay: 0.4 + index * 0.1,
                    duration: 0.5,
                    type: "spring",
                    stiffness: 150,
                  }}
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <feature.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-heading font-semibold text-lg text-foreground mb-1">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
