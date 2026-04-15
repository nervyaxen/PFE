import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Globe, Sparkles, LogOut, Moon, Sun } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const languages = [
  { code: "en", label: "EN", dir: "ltr" },
  { code: "fr", label: "FR", dir: "ltr" },
  { code: "ar", label: "عربي", dir: "rtl" },
];

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const { user, isAdmin, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [dark, setDark] = useState(() => !document.documentElement.classList.contains("light"));

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.remove("light");
    } else {
      document.documentElement.classList.add("light");
    }
  }, [dark]);

  const switchLang = (code: string, dir: string) => {
    i18n.changeLanguage(code);
    document.documentElement.dir = dir;
    document.documentElement.lang = code;
    setLangOpen(false);
  };

  const navLinks = [
    { to: "/", label: t("nav.home") },
    { to: "/pricing", label: t("nav.pricing") },
    { to: "/marketing-video", label: t("nav.marketingVideo") },
    { to: "/payment", label: t("nav.payment") },
    ...(user ? [{ to: "/dashboard", label: t("nav.dashboard") }] : []),
    ...(isAdmin ? [{ to: "/admin", label: t("nav.admin") }] : []),
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <motion.nav initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-border/50"
    >
      <div className="container mx-auto flex items-center justify-between h-14 px-4">
        <Link to="/" className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-neon" />
          <span className="text-lg font-bold font-heading text-gradient-neon">{t("brand")}</span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link key={link.to} to={link.to}
              className={`text-xs font-medium transition-colors hover:text-neon ${isActive(link.to) ? "text-neon" : "text-muted-foreground"}`}
            >{link.label}</Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-2">
          {/* Dark mode toggle */}
          <button onClick={() => setDark(!dark)}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground transition-colors glass-panel"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={dark ? "moon" : "sun"} initial={{ rotate: -90, opacity: 0, scale: 0.5 }} animate={{ rotate: 0, opacity: 1, scale: 1 }} exit={{ rotate: 90, opacity: 0, scale: 0.5 }} transition={{ duration: 0.2 }}>
                {dark ? <Moon className="h-3.5 w-3.5" /> : <Sun className="h-3.5 w-3.5" />}
              </motion.div>
            </AnimatePresence>
          </button>

          {/* Language */}
          <div className="relative">
            <button onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1 px-2 py-1.5 text-xs rounded-lg text-muted-foreground hover:text-foreground transition-colors glass-panel"
            >
              <Globe className="h-3.5 w-3.5" />
              {languages.find((l) => l.code === i18n.language)?.label || "EN"}
            </button>
            <AnimatePresence>
              {langOpen && (
                <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
                  className="absolute top-full mt-1 right-0 glass-panel rounded-lg overflow-hidden min-w-[70px]"
                >
                  {languages.map((lang) => (
                    <button key={lang.code} onClick={() => switchLang(lang.code, lang.dir)}
                      className={`block w-full px-3 py-1.5 text-xs text-start hover:bg-primary/20 transition-colors ${i18n.language === lang.code ? "text-neon" : "text-muted-foreground"}`}
                    >{lang.label}</button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {user ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">{user.name}</span>
              <button onClick={logout} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive transition-colors">
                <LogOut className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">{t("nav.login")}</Link>
              <Link to="/signup" className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-neon text-accent-foreground hover:opacity-90 transition-opacity glow-neon">{t("nav.signup")}</Link>
            </>
          )}
        </div>

        {/* Mobile: dark mode + hamburger */}
        <div className="md:hidden flex items-center gap-2">
          <button onClick={() => setDark(!dark)} className="p-1.5 rounded-lg text-foreground glass-panel">
            {dark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </button>
          <button className="text-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden glass-panel border-t border-border/50"
          >
            <div className="flex flex-col gap-3 p-4">
              {navLinks.map((link) => (
                <Link key={link.to} to={link.to} onClick={() => setMobileOpen(false)}
                  className={`text-sm font-medium ${isActive(link.to) ? "text-neon" : "text-muted-foreground"}`}
                >{link.label}</Link>
              ))}
              {user ? (
                <button onClick={() => { logout(); setMobileOpen(false); }} className="text-sm text-muted-foreground text-start">{t("nav.logout")}</button>
              ) : (
                <>
                  <Link to="/login" onClick={() => setMobileOpen(false)} className="text-sm text-muted-foreground">{t("nav.login")}</Link>
                  <Link to="/signup" onClick={() => setMobileOpen(false)} className="text-sm text-neon">{t("nav.signup")}</Link>
                </>
              )}
              <div className="flex gap-2">
                {languages.map((lang) => (
                  <button key={lang.code} onClick={() => { switchLang(lang.code, lang.dir); setMobileOpen(false); }}
                    className={`px-2.5 py-1 text-xs rounded-md ${i18n.language === lang.code ? "bg-neon text-accent-foreground" : "glass-panel text-muted-foreground"}`}
                  >{lang.label}</button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
