import { Link, useLocation } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { Compass, PenLine, LayoutDashboard } from "lucide-react";
import { useI18n } from "@/i18n";

const PILLARS = [
  { key: "discover", path: "/", icon: Compass },
  { key: "build", path: "/library/ai-creator", icon: PenLine },
  { key: "monitor", path: "/library", icon: LayoutDashboard },
] as const;

export default function JourneyPillars() {
  const { t } = useI18n();
  const location = useLocation();
  const reduceMotion = useReducedMotion();

  return (
    <nav
      className="flex items-center gap-1 rounded-xl bg-surface/40 px-1 py-1 border border-border/50"
      aria-label={t("journey.pillarTitle")}
    >
      {PILLARS.map(({ key, path, icon: Icon }) => {
        const isActive =
          (key === "discover" && location.pathname === "/") ||
          (key === "build" && location.pathname.startsWith("/library/ai-creator")) ||
          (key === "monitor" && (location.pathname === "/library" || location.pathname.startsWith("/projects/")));
        return (
          <Link
            key={key}
            to={path}
            className={`
              relative flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-all duration-300
              ${isActive ? "bg-primary text-primary-foreground shadow-lg" : "text-muted-foreground hover:text-foreground hover:bg-surface/60"}
            `}
            data-narrate={`${t(`journey.${key}`)}|${t(`journey.${key}Desc`)}`}
          >
            {reduceMotion ? (
              <Icon className="h-3.5 w-3.5 shrink-0" />
            ) : (
              <motion.span
                whileHover={{ scale: 1.08 }}
                transition={{ duration: 0.2 }}
              >
                <Icon className="h-3.5 w-3.5 shrink-0" />
              </motion.span>
            )}
            <span className="hidden sm:inline">{t(`journey.${key}`)}</span>
          </Link>
        );
      })}
    </nav>
  );
}
