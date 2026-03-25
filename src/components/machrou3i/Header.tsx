import { motion, useReducedMotion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Sparkles, LogIn, Rocket } from "lucide-react";
import { useI18n } from "@/i18n";
import { useAuthStore } from "@/store/useAuthStore";
import LanguageSwitcher from "./LanguageSwitcher";
import ThemeToggle from "./ThemeToggle";

// START SAFE MODIFICATION — Header with Auth Buttons
export default function Header() {
  const reduceMotion = useReducedMotion();
  const { t } = useI18n();
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-[130] px-4 sm:px-6 py-4 pointer-events-none"
      initial={reduceMotion ? false : { opacity: 0, y: -20 }}
      animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mx-auto max-w-7xl flex items-center justify-between">
        {/* Logo */}
        <div className="pointer-events-auto">
          <Link
            to="/"
            className="flex items-center gap-2 glass glass-hover rounded-2xl px-4 py-3 transition-all depth-shadow border border-border/40 hover:border-neon/30"
            data-narrate={`${t("titles.machrou3i")}|${t("titles.intelligenceForProjects")}`}
          >
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-primary">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
            </span>
            <span className="text-lg font-semibold text-shimmer animate-shimmer">
              {t("titles.machrou3i")}
            </span>
          </Link>
        </div>

        {/* Right side: Auth buttons + Theme + Language */}
        <div className="pointer-events-auto flex items-center gap-2 sm:gap-3">
          {!isAuthenticated ? (
            <>
              {/* Log In Button */}
              <motion.button
                onClick={() => navigate("/auth/login")}
                className="hidden sm:flex items-center gap-2 glass glass-hover rounded-xl px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground border border-border/40 hover:border-neon/30 transition-all duration-300"
                whileHover={reduceMotion ? undefined : { scale: 1.03 }}
                whileTap={reduceMotion ? undefined : { scale: 0.97 }}
                data-narrate="Login|Access your existing workspace"
              >
                <LogIn className="h-4 w-4" />
                <span>{t("nav.login")}</span>
              </motion.button>

              {/* Start for Free Button — Premium CTA */}
              <motion.button
                onClick={() => navigate("/auth/signup")}
                className="flex items-center gap-2 rounded-xl px-4 sm:px-5 py-2.5 text-sm font-semibold tracking-wide
                  bg-gradient-to-r from-neon/20 via-neon/10 to-gold/20
                  text-neon border border-neon/40
                  hover:border-neon/70 hover:shadow-[0_0_25px_-3px_hsl(var(--neon)/0.5)]
                  transition-all duration-300 backdrop-blur-md"
                whileHover={reduceMotion ? undefined : { scale: 1.05, y: -1 }}
                whileTap={reduceMotion ? undefined : { scale: 0.97 }}
                data-narrate="Start Free|Initialize your AI-powered workspace"
              >
                <Rocket className="h-4 w-4" />
                <span className="hidden sm:inline">Start for Free</span>
                <span className="sm:hidden">Start</span>
              </motion.button>
            </>
          ) : (
            /* Authenticated user pill */
            <div className="flex items-center gap-2 glass rounded-xl px-3 py-2 border border-border/40">
              <div className="h-7 w-7 rounded-lg bg-neon/20 flex items-center justify-center">
                <span className="text-xs font-bold text-neon uppercase">
                  {(user?.name || user?.email || "U").charAt(0)}
                </span>
              </div>
              <span className="hidden sm:inline text-sm text-muted-foreground truncate max-w-[120px]">
                {user?.name || user?.email}
              </span>
              <button
                onClick={() => { logout(); navigate("/"); }}
                className="text-xs text-muted-foreground hover:text-destructive transition-colors ml-1"
              >
                ✕
              </button>
            </div>
          )}

          <div className="flex items-center gap-1.5 sm:gap-2 glass rounded-2xl px-3 py-2 depth-shadow border border-border/40">
            <ThemeToggle />
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </motion.header>
  );
}
// END SAFE MODIFICATION
