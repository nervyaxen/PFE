import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Menu, X, LayoutDashboard, BookOpenCheck, Sparkles, CreditCard, Settings } from "lucide-react";
import { useI18n } from "@/i18n";
import LanguageSwitcher from "./LanguageSwitcher";

const LINKS = [
  { to: "/", labelKey: "menu.dashboard", icon: LayoutDashboard, pathMatch: (path: string) => path === "/" },
  { to: "/library", labelKey: "menu.projectLibrary", icon: BookOpenCheck, pathMatch: (path: string) => path === "/library" },
  { to: "/library/ai-creator", labelKey: "menu.createNewProject", icon: Sparkles, pathMatch: (path: string) => path.startsWith("/library/ai-creator") },
  { to: "/payment", labelKey: "menu.payment", icon: CreditCard, pathMatch: (path: string) => path === "/payment" },
  { to: "/#admin", labelKey: "menu.settings", icon: Settings, pathMatch: () => false },
] as const;

export default function HamburgerMenu() {
  const { t } = useI18n();
  const location = useLocation();
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleNav = (to: string) => {
    setOpen(false);
    if (to === "/#admin") {
      navigate("/");
      setTimeout(() => document.getElementById("admin")?.scrollIntoView({ behavior: "smooth" }), 100);
    }
  };

  return (
    <>
      <motion.button
        type="button"
        onClick={() => setOpen(true)}
        className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl glass glass-hover border border-border/60 text-foreground hover:border-neon/30 hover:shadow-[0_0_20px_-8px_hsl(var(--neon)/0.4)] transition-all duration-300 min-w-[36px] min-h-[36px] touch-manipulation"
        aria-label={t("menu.open")}
        aria-expanded={open}
        whileTap={reduceMotion ? undefined : { scale: 0.96 }}
      >
        <Menu className="h-5 w-5 sm:h-[22px] sm:w-[22px]" aria-hidden />
      </motion.button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setOpen(false)}
              aria-hidden
            />
            <motion.aside
              className="fixed top-0 right-0 z-[101] h-full w-[min(300px,92vw)] max-w-[300px] glass border-l border-border/60 shadow-2xl flex flex-col"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: reduceMotion ? 0.15 : 0.35, ease: [0.32, 0.72, 0, 1] }}
              aria-label={t("menu.navigation")}
            >
              <div className="flex items-center justify-between p-4 sm:p-5 border-b border-border/50 flex-shrink-0">
                <span className="text-sm font-semibold text-foreground">{t("menu.title")}</span>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground hover:text-foreground hover:bg-surface/60 hover:border-neon/20 transition-all duration-200 border border-transparent"
                  aria-label={t("menu.close")}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <nav className="flex-1 min-h-0 overflow-auto py-4 px-2 -mx-2">
                <ul className="space-y-1">
                  {LINKS.map(({ to, labelKey, icon: Icon, pathMatch }) => {
                    const isActive = to.startsWith("/#") ? false : pathMatch(location.pathname);
                    const isHash = to === "/#admin";
                    return (
                      <li key={to}>
                        {isHash ? (
                          <button
                            type="button"
                            onClick={() => handleNav(to)}
                            className="flex items-center gap-3 w-full rounded-xl px-4 py-3.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-surface/70 hover:border-neon/10 border border-transparent transition-all duration-200 text-left"
                          >
                            <Icon className="h-4 w-4 shrink-0" />
                            {t(labelKey)}
                          </button>
                        ) : (
                          <Link
                            to={to}
                            onClick={() => setOpen(false)}
                            className={`flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-medium transition-all duration-200 ${
                              isActive
                                ? "bg-primary text-primary-foreground shadow-[0_0_20px_-8px_hsl(var(--neon)/0.3)]"
                                : "text-muted-foreground hover:text-foreground hover:bg-surface/70 hover:border-neon/10 border border-transparent"
                            }`}
                          >
                            <Icon className="h-4 w-4 shrink-0" />
                            {t(labelKey)}
                          </Link>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </nav>
              <div className="p-3 sm:p-4 border-t border-border/50 flex-shrink-0">
                <LanguageSwitcher />
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
