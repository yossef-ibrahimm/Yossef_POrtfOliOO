import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";

const ThemeToggle = () => {
  const { effectiveTheme, toggleTheme } = useTheme();

  return (
    <motion.button
      onClick={toggleTheme}
      className="relative inline-flex items-center justify-center w-10 h-10 rounded-lg glass hover:bg-primary/10 transition-colors"
      aria-label={`Switch to ${effectiveTheme === 'dark' ? 'light' : 'dark'} mode`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        initial={false}
        animate={{ scale: effectiveTheme === 'dark' ? 1 : 0, opacity: effectiveTheme === 'dark' ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="absolute"
      >
        <Moon className="w-5 h-5 text-muted-foreground" aria-hidden="true" />
      </motion.div>
      <motion.div
        initial={false}
        animate={{ scale: effectiveTheme === 'light' ? 1 : 0, opacity: effectiveTheme === 'light' ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="absolute"
      >
        <Sun className="w-5 h-5 text-muted-foreground" aria-hidden="true" />
      </motion.div>
    </motion.button>
  );
};

export default ThemeToggle;
