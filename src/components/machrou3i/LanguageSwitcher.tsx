import { useState, useRef, useEffect } from "react";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import { Globe, Check } from "lucide-react";
import { useI18n, Language } from "@/i18n";

const languages: { code: Language; labelKey: string; flag: string }[] = [
  { code: "en", labelKey: "languages.en", flag: "🇬🇧" },
  { code: "fr", labelKey: "languages.fr", flag: "🇫🇷" },
  { code: "ar", labelKey: "languages.ar", flag: "🇸🇦" },
];

export default function LanguageSwitcher() {
  const reduceMotion = useReducedMotion();
  const { language, setLanguage, t } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const currentLanguage = languages.find((l) => l.code === language) || languages[0];

  return (
    <div className="relative" ref={dropdownRef}>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="glass glass-hover rounded-xl px-3 py-2 flex items-center gap-2 text-sm font-medium transition-all"
        whileHover={reduceMotion ? undefined : { scale: 1.05 }}
        whileTap={reduceMotion ? undefined : { scale: 0.95 }}
        data-narrate={`${t("labels.language")}|${t("labels.selectLanguage")}`}
      >
        <Globe className="h-4 w-4" />
        <span className="hidden sm:inline">{currentLanguage.flag}</span>
        <span className="hidden md:inline text-xs">{currentLanguage.code.toUpperCase()}</span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute right-0 top-full mt-2 glass rounded-xl p-2 min-w-[160px] z-50"
            initial={reduceMotion ? false : { opacity: 0, y: -10, scale: 0.95 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            {languages.map((lang) => (
              <motion.button
                key={lang.code}
                onClick={() => {
                  setLanguage(lang.code);
                  setIsOpen(false);
                }}
                className={`w-full glass glass-hover rounded-lg px-3 py-2 flex items-center justify-between gap-2 text-sm transition-all ${language === lang.code ? "neon-outline" : ""
                  }`}
                whileHover={reduceMotion ? undefined : { x: 4, scale: 1.02 }}
                data-narrate={`${t(lang.labelKey)}|${t("labels.switchTo")} ${t(lang.labelKey)}`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-base">{lang.flag}</span>
                  <span>{t(lang.labelKey)}</span>
                </div>
                {language === lang.code && (
                  <motion.div
                    initial={reduceMotion ? false : { scale: 0 }}
                    animate={reduceMotion ? undefined : { scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  >
                    <Check className="h-4 w-4 text-neon" />
                  </motion.div>
                )}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
