import { motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import LanguageSwitcher from "./LanguageSwitcher";
import { Sparkles } from "lucide-react";
import { useI18n } from "@/i18n";

export default function Header() {
  const reduceMotion = useReducedMotion();
  const { t } = useI18n();

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
      initial={reduceMotion ? false : { opacity: 0, y: -20 }}
      animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mx-auto max-w-6xl">
        <div className="glass rounded-2xl px-4 py-3 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 glass-hover rounded-xl px-3 py-2 transition-all"
            data-narrate={`${t("titles.machrou3i")}|${t("titles.intelligenceForProjects")}`}
          >
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-primary">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
            </span>
            <span className="text-lg font-semibold text-shimmer animate-shimmer">
              {t("titles.machrou3i")}
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </motion.header>
  );
}
