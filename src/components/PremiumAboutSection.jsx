import { motion } from "framer-motion";
import { RevealOnScroll, DepthLayer } from "./ParallaxSection";
import { ResponsiveImage } from "./ResponsiveImage";
import { ArrowRight } from "lucide-react";
import yossef from "../assets/yossef.png";

export const PremiumAboutSection = ({
  showImage = true,
  
}) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center  px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Ambient background elements */}
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden"
        id="about"
      >
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl"
          animate={{
            opacity: [0.1, 0.15, 0.1],
            scale: [1, 1.05, 1],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          style={{ willChange: "transform, opacity" }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/3 rounded-full blur-3xl"
          animate={{
            opacity: [0.05, 0.1, 0.05],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          style={{ willChange: "transform, opacity" }}
        />
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          viewport={{ once: false, margin: "-100px" }}
          className="text-center mb-16"
        >
          <motion.h2
            className="text-4xl sm:text-5xl md:text-6xl font-light tracking-tight mb-4"
            style={{ fontFamily: '"Playfair Display", "Georgia", serif' }}
          >
            About Me
          </motion.h2>
          <motion.div
            className="w-20 h-1 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          />
        </motion.div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {showImage && (
            <DepthLayer
              depth={0.3}
              className="relative h-96 sm:h-[500px] lg:h-[600px] rounded-2xl overflow-hidden group"
            >
              <motion.div
                className="relative w-full h-full bg-gradient-to-br from-primary/10 to-purple-500/10 rounded-2xl overflow-hidden border border-primary/20 backdrop-blur-sm"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: false }}
              >
                <ResponsiveImage
                  src={yossef}
                  alt="Professional photo"
                  className="w-full h-full"
                  priority={false}
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 600px"
                />

                <motion.div
                  className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent pointer-events-none"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                />

                <motion.div
                  className="absolute inset-0 rounded-2xl border-2 border-primary/30 pointer-events-none"
                  animate={{
                    borderColor: [
                      "rgba(var(--primary), 0.2)",
                      "rgba(var(--primary), 0.4)",
                      "rgba(var(--primary), 0.2)",
                    ],
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
              </motion.div>

              {/* الشكل الأول في الزاوية اليمنى السفلى */}
              <motion.div
                className="absolute -bottom-4 -right-4 w-24 h-24 border border-primary/20 rounded-2xl "
                animate={{
                  opacity: [0.3, 0.5, 0.3],
                  scale: [0.95, 1.05, 0.95],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                style={{ willChange: "transform, opacity" }}
              />

              {/* الشكل الجديد في الزاوية اليسرى العليا */}
              <motion.div
                className="absolute -top-6 -left-6 w-20 h-20 bg-primary/30 border-primary/20 rounded-3xl"
                animate={{
                  rotate: [0, 360],
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                style={{
                  willChange: "transform, opacity",
                  border: "solid 1.5px hsl(220deg 100% 48.89%)",
                }}
              />
            </DepthLayer>
          )}

          <RevealOnScroll
            direction="left"
            className="flex flex-col justify-center space-y-8"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
              viewport={{ once: false, margin: "-100px" }}
            >
              <p className="text-lg md:text-xl leading-relaxed text-foreground/90 mb-6">
                Front-End Developer with hands-on experience building modern,
                responsive, high-performance web applications using React.js,
                JavaScript (ES6+), and Tailwind CSS.
              </p>
              <p className="text-base md:text-lg leading-relaxed text-foreground/70">
                Strong in component-based architecture, REST API integration, UX
                optimization, performance optimization, agile teamwork, and
                pixel-perfect UI from Figma designs.
              </p>
            </motion.div>

            <motion.div
              className="grid grid-cols-3 gap-6 py-8 border-y border-primary/10"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delayChildren: 0.2 }}
              viewport={{ once: false, margin: "-100px" }}
            >
              {[
                { number: "10+", label: "Projects" },
                { number: "2+", label: "Years" },
                { number: "6+", label: "Clients" },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  className="text-center"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.6 }}
                  viewport={{ once: false }}
                >
                  <div className="text-3xl md:text-4xl font-light text-primary mb-2">
                    {stat.number}
                  </div>
                  <div className="text-sm text-foreground/60 uppercase tracking-wider">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              viewport={{ once: false, margin: "-100px" }}
            >
              <motion.button
                className="group relative inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-lg font-medium overflow-hidden text-base md:text-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.span
                  className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary opacity-0 group-hover:opacity-100 transition-opacity"
                  transition={{ duration: 0.3 }}
                />
                <span className="relative flex items-center gap-2">
                  View My Work
                  <motion.div className="group-hover:translate-x-1 transition-transform">
                    <ArrowRight className="w-5 h-5" />
                  </motion.div>
                </span>
              </motion.button>
            </motion.div>

            <motion.div
              className="flex flex-wrap gap-3 pt-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              viewport={{ once: false }}
            >
              {[
                "HTML5",
                "CSS3",
                "JavaScript (ES6+)",
                "BootStarp",
                "Tailwind CSS",
                "React.js",
                " NextJS",
                "Figma",
                "Git & GitHub",
                "Responsive Design",
                "RESTful APIs",
                `Performance Optimization`,
                "Cross-Browser Compatibility",
              ].map((skill, i) => (
                <motion.span
                  key={i}
                  className="px-4 py-2 rounded-full border border-primary/30 text-sm text-foreground/80 hover:border-primary/60 hover:bg-primary/5 transition-all cursor-default"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.08, duration: 0.5 }}
                  viewport={{ once: false }}
                >
                  {skill}
                </motion.span>
              ))}
            </motion.div>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
};

export default PremiumAboutSection;
