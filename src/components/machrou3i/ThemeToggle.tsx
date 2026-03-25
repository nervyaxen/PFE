import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useI18n } from "@/i18n";
import { getStoredTheme, setStoredTheme, applyTheme, type Theme } from "@/lib/theme";

export default function ThemeToggle() {
  const { t } = useI18n();
  const reduceMotion = useReducedMotion();
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const stored = getStoredTheme();
    setTheme(stored);
    applyTheme(stored);
  }, []);

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    setStoredTheme(next);
    applyTheme(next);
  };

  return (
    <motion.button
      type="button"
      onClick={toggle}
      className="flex h-9 w-9 items-center justify-center rounded-xl glass glass-hover border border-border/60 text-muted-foreground hover:text-foreground transition-colors duration-300"
      aria-label={theme === "dark" ? t("theme.switchToLight") : t("theme.switchToDark")}
      whileHover={reduceMotion ? undefined : { scale: 1.05 }}
      whileTap={reduceMotion ? undefined : { scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </motion.button>
  );
}
