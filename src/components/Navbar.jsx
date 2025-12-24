import { motion, useScroll, useTransform } from "framer-motion";
import { useState } from "react";
import { MagneticButton } from "./MagneticButton";
import { useTheme } from "./ThemeProvider";

const navLinks = [
  { name: "Home", href: "#home" },
  { name: "About", href: "#about" },
  { name: "Work", href: "#work" },
  { name: "Contact", href: "#contact" },
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, toggleTheme } = useTheme("dark");

  const { scrollY } = useScroll();

  const backgroundColor = useTransform(
    scrollY,
    [0, 100],
    ["rgba(10, 12, 16, 0)", "rgba(10, 12, 16, 0.8)"]
  );

  const backdropBlur = useTransform(
    scrollY,
    [0, 100],
    ["blur(0px)", "blur(20px)"]
  );

  return (
    <>
      <motion.nav
        style={{ backgroundColor, backdropFilter: backdropBlur }}
        className="fixed top-0 left-0 right-0 z-50 px-4 py-3 sm:px-6 sm:py-4 lg:px-12"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <motion.a
            href="#home"
            className="text-xl sm:text-2xl font-display font-bold text-gradient relative z-10"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            Y.
          </motion.a>

          {/* Desktop Navigation */}
          <motion.div
            className="hidden md:flex items-center gap-4 lg:gap-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {navLinks.map((link, i) => (
              <motion.a
                key={link.name}
                href={link.href}
                className="relative text-sm lg:text-base font-medium text-muted-foreground hover:text-foreground transition-colors duration-300 group"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i + 0.3 }}
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-gradient-primary group-hover:w-full transition-all duration-300" />
              </motion.a>
            ))}

            <MagneticButton className="ml-2 lg:ml-4 px-4 py-2 lg:px-6 lg:py-2.5 bg-gradient-primary text-primary-foreground font-medium rounded-full text-sm hover:shadow-lg hover:shadow-primary/25 transition-shadow duration-300">
              Let's Talk
            </MagneticButton>

            {/* Desktop Theme Toggle */}
            <motion.button
              onClick={toggleTheme}
              className="ml-2 lg:ml-4 p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <svg className="w-5 h-5 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </motion.button>
          </motion.div>

          {/* Mobile Menu Button */}
          <motion.button
            className="md:hidden relative w-12 h-12 flex flex-col justify-center items-center gap-1.5 z-10 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 shadow-lg shadow-primary/10 hover:shadow-xl hover:shadow-primary/20 hover:border-primary/40 transition-all duration-300"
            onClick={() => setIsOpen((prev) => !prev)}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.3 }}
            aria-label="Toggle menu"
            aria-expanded={isOpen}
          >
            <motion.span
              className="w-5 h-[2px] bg-gradient-to-r from-primary to-primary/80 rounded-full shadow-sm"
              animate={{ 
                rotate: isOpen ? 45 : 0, 
                y: isOpen ? 10 : 0,
                scaleX: isOpen ? 1 : 1
              }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              style={{ backgroundColor: isOpen ? "#fd4141ff" : "#ffffff" }}

            />
            <motion.span
              className="w-5 h-[2px] bg-gradient-to-r from-primary to-primary/80 rounded-full shadow-sm"
              animate={{ 
                opacity: isOpen ? 0 : 1,
                scaleX: isOpen ? 0 : 1
              }}
              transition={{ duration: 0.2 }}
                            style={{ backgroundColor: isOpen ? "#fd4141ff" : "#ffffff" }}

            />
            <motion.span
              className="w-5 h-[2px] bg-gradient-to-r from-primary to-primary/80 rounded-full shadow-sm"
              animate={{ 
                rotate: isOpen ? -45 : 0, 
                y: isOpen ? -5 : 0,
                scaleX: isOpen ? 1 : 1
              }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
                            style={{ backgroundColor: isOpen ? "#fd4141ff" : "#ffffff" }}

            />
          </motion.button>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <motion.div
        className="md:hidden fixed inset-0 bg-background/95 backdrop-blur-lg z-40"
        initial={false}
        animate={{
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? "auto" : "none",
        }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          className="flex flex-col items-center justify-center h-full px-6 pt-20 pb-8"
          initial={false}
          animate={{
            opacity: isOpen ? 1 : 0,
            y: isOpen ? 0 : -20,
          }}
          transition={{ duration: 0.3, delay: isOpen ? 0.1 : 0 }}
        >
          {/* Mobile Navigation Links */}
          <div className="flex flex-col items-center gap-8 w-full max-w-sm">
            {navLinks.map((link, i) => (
              <motion.a
                key={link.name}
                href={link.href}
                className="text-2xl sm:text-3xl font-medium text-muted-foreground hover:text-foreground transition-colors duration-300 relative group"
                onClick={() => setIsOpen(false)}
                initial={false}
                animate={{
                  opacity: isOpen ? 1 : 0,
                  y: isOpen ? 0 : 20,
                }}
                transition={{
                  duration: 0.3,
                  delay: isOpen ? 0.1 * i + 0.2 : 0,
                }}
              >
                {link.name}
                <span className="absolute -bottom-2 left-0 w-0 h-[2px] bg-gradient-primary group-hover:w-full transition-all duration-300" />
              </motion.a>
            ))}

            {/* Mobile CTA Button */}
            <motion.a
              href="#contact"
              className="mt-4 px-8 py-3 bg-gradient-primary text-primary-foreground font-medium rounded-full text-lg shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-shadow duration-300"
              onClick={() => setIsOpen(false)}
              initial={false}
              animate={{
                opacity: isOpen ? 1 : 0,
                scale: isOpen ? 1 : 0.9,
              }}
              transition={{
                duration: 0.3,
                delay: isOpen ? 0.5 : 0,
              }}
            >
              Let's Talk
            </motion.a>

            {/* Mobile Theme Toggle */}
            <motion.button
              onClick={toggleTheme}
              className="mt-6 p-3 rounded-full bg-muted hover:bg-muted/80 transition-colors duration-300"
              initial={false}
              animate={{
                opacity: isOpen ? 1 : 0,
                scale: isOpen ? 1 : 0.9,
              }}
              transition={{
                duration: 0.3,
                delay: isOpen ? 0.6 : 0,
              }}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <svg className="w-6 h-6 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-6 h-6 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
};