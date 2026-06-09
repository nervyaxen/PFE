import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Globe, Sparkles, LogOut, Moon, Sun, Lock, Unlock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

const languages = [
  { code: "en", label: "EN", dir: "ltr" },
  { code: "fr", label: "FR", dir: "ltr" },
  { code: "ar", label: "عربي", dir: "rtl" },
];

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAdmin, premiumUnlocked, logout } = useAuth();
  

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
    { to: "/", label: t("nav.home", "Home"), premium: false },
    { to: "/pricing", label: t("nav.pricing", "Pricing"), premium: false },
    { to: "/faq", label: t("nav.faq", "FAQ"), premium: false },
    { to: "/marketing-video", label: t("nav.marketingVideo", "Marketing"), premium: false },
    { to: "/brands", label: t("nav.brands", "Brands"), premium: false },
    
    // Premium Lock features
    { to: "/entreprise", label: t("nav.entreprise", "Enterprise"), premium: true },
    { to: "/business-names", label: t("nav.businessNames", "Names"), premium: true },
    { to: "/logo-generator", label: t("nav.logoGenerator", "Logos"), premium: true },
    { to: "/opportunity-finder", label: t("nav.opportunityFinder", "Opportunities"), premium: true },
    
    { to: "/payment", label: t("nav.payment", "Payment"), premium: false },
    ...(user ? [{ to: "/dashboard", label: t("nav.dashboard", "Dashboard"), premium: false }] : []),
    ...(user ? [{ to: "/chatbot", label: t("nav.chatbot", "AI Assistant"), premium: false }] : []),
    ...(isAdmin ? [{ to: "/admin", label: t("nav.admin", "Admin"), premium: false }] : []),
    ...(isAdmin ? [{ to: "/pfe-testing", label: "PFE Testing", premium: false }] : []),
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleLockedClick = (e: React.MouseEvent, label: string) => {
    e.preventDefault();
    toast({
      title: "Premium Feature Locked 🔒",
      description: `Upgrade your account to unlock the ${label} module immediately.`,
    });
  };

  if (isAdmin) return null;

  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }} 
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-border/50"
    >
      <div className="container mx-auto flex items-center justify-between h-14 px-4">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <Sparkles className="h-5 w-5 text-neon" />
          <span className="text-lg font-bold font-heading text-gradient-neon">{t("brand", "Machrou3i")}</span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden xl:flex items-center gap-4 mx-4 overflow-x-auto max-w-[60%]">
          {navLinks.map((link) => {
            const isLocked = link.premium && !premiumUnlocked;
            return isLocked ? (
              <div
                key={link.to}
                onClick={(e) => handleLockedClick(e, link.label)}
                className="text-[11px] font-medium transition-all text-muted-foreground/60 cursor-pointer flex items-center gap-1 hover:text-neon group relative px-1 py-1"
                title="Premium Locked module. Complete payment to unlock."
              >
                <span>{link.label}</span>
                <motion.div
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  <Lock className="h-3 w-3 text-gold" />
                </motion.div>
                {/* Micro tooltip */}
                <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-black text-white text-[8px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-neon/20 mb-1 z-50 shadow-lg">
                  Upgrade to unlock
                </span>
              </div>
            ) : (
              <Link 
                key={link.to} 
                to={link.to}
                className={`text-[11px] font-medium transition-colors hover:text-neon flex items-center gap-1 ${
                  isActive(link.to) ? "text-neon font-semibold" : "text-muted-foreground"
                }`}
              >
                {link.label}
                {link.premium && (
                  <Unlock className="h-2.5 w-2.5 text-neon opacity-75" />
                )}
              </Link>
            );
          })}
        </div>

        <div className="hidden xl:flex items-center gap-2 shrink-0">
          {/* Unlocked banner badge */}
          {premiumUnlocked && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="px-2.5 py-1 text-[9px] font-bold rounded-lg bg-neon/15 border border-neon/30 text-neon flex items-center gap-1 mr-1 shadow-sm shadow-neon/10"
            >
              <Sparkles className="h-2.5 w-2.5 text-neon" />
              PRO UNLOCKED
            </motion.div>
          )}

          {/* Dark mode toggle */}
          <button 
            onClick={() => setDark(!dark)}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground transition-colors glass-panel"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div 
                key={dark ? "moon" : "sun"} 
                initial={{ rotate: -90, opacity: 0, scale: 0.5 }} 
                animate={{ rotate: 0, opacity: 1, scale: 1 }} 
                exit={{ rotate: 90, opacity: 0, scale: 0.5 }} 
                transition={{ duration: 0.2 }}
              >
                {dark ? <Moon className="h-3.5 w-3.5" /> : <Sun className="h-3.5 w-3.5" />}
              </motion.div>
            </AnimatePresence>
          </button>

          {/* Language selection */}
          <div className="relative">
            <button 
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1 px-2 py-1.5 text-xs rounded-lg text-muted-foreground hover:text-foreground transition-colors glass-panel"
            >
              <Globe className="h-3.5 w-3.5" />
              {languages.find((l) => l.code === i18n.language)?.label || "EN"}
            </button>
            <AnimatePresence>
              {langOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: -5 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  exit={{ opacity: 0, y: -5 }}
                  className="absolute top-full mt-1 right-0 glass-panel rounded-lg overflow-hidden min-w-[70px] z-50 shadow-xl"
                >
                  {languages.map((lang) => (
                    <button 
                      key={lang.code} 
                      onClick={() => switchLang(lang.code, lang.dir)}
                      className={`block w-full px-3 py-1.5 text-xs text-start hover:bg-primary/20 transition-colors ${
                        i18n.language === lang.code ? "text-neon" : "text-muted-foreground"
                      }`}
                    >{lang.label}</button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {user ? (
            <div className="flex items-center gap-2 ml-1 border-l border-border/60 pl-2">
              <span className="text-xs text-muted-foreground max-w-[80px] truncate">{user.name}</span>
              <button
                type="button"
                onClick={async () => {
                  await logout();
                  navigate("/login");
                }}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive transition-colors"
                title={t("nav.logout", "Logout")}
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>{t("nav.logout", "Logout")}</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 ml-1 pl-1">
              <Link to="/login" className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">{t("nav.login", "Login")}</Link>
              <Link to="/signup" className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-neon text-black hover:opacity-90 transition-opacity glow-neon shrink-0">{t("nav.signup", "Get Started")}</Link>
            </div>
          )}
        </div>

        {/* Mobile menu trigger */}
        <div className="xl:hidden flex items-center gap-2">
          {premiumUnlocked && (
            <span className="px-2 py-0.5 text-[8px] font-bold rounded bg-neon/20 border border-neon/30 text-neon">PRO</span>
          )}
          <button onClick={() => setDark(!dark)} className="p-1.5 rounded-lg text-foreground glass-panel">
            {dark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </button>
          <button className="text-foreground p-1 glass-panel" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }} 
            animate={{ height: "auto", opacity: 1 }} 
            exit={{ height: 0, opacity: 0 }}
            className="xl:hidden overflow-hidden glass-panel border-t border-border/50"
          >
            <div className="flex flex-col gap-3 p-4">
              {navLinks.map((link) => {
                const isLocked = link.premium && !premiumUnlocked;
                return isLocked ? (
                  <div
                    key={link.to}
                    onClick={(e) => {
                      setMobileOpen(false);
                      handleLockedClick(e, link.label);
                    }}
                    className="text-sm font-medium text-muted-foreground/60 cursor-pointer flex items-center gap-1.5 py-1"
                  >
                    <span>{link.label}</span>
                    <Lock className="h-3 w-3 text-gold" />
                  </div>
                ) : (
                  <Link 
                    key={link.to} 
                    to={link.to} 
                    onClick={() => setMobileOpen(false)}
                    className={`text-sm font-medium flex items-center gap-1.5 py-1 ${
                      isActive(link.to) ? "text-neon" : "text-muted-foreground"
                    }`}
                  >
                    {link.label}
                    {link.premium && <Unlock className="h-3 w-3 text-neon" />}
                  </Link>
                );
              })}
              {user ? (
                <button 
                  type="button"
                  onClick={async () => {
                    await logout();
                    setMobileOpen(false);
                    navigate("/login");
                  }} 
                  className="text-sm text-muted-foreground text-start py-1 border-t border-border/10 mt-1 flex items-center gap-1 text-destructive"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  {t("nav.logout", "Logout")}
                </button>
              ) : (
                <div className="flex flex-col gap-2 pt-2 border-t border-border/10 mt-1">
                  <Link to="/login" onClick={() => setMobileOpen(false)} className="text-sm text-muted-foreground py-1">{t("nav.login", "Login")}</Link>
                  <Link to="/signup" onClick={() => setMobileOpen(false)} className="text-sm text-neon font-semibold py-1">{t("nav.signup", "Get Started")}</Link>
                </div>
              )}
              <div className="flex gap-2 pt-2 border-t border-border/10 mt-1">
                {languages.map((lang) => (
                  <button 
                    key={lang.code} 
                    onClick={() => { switchLang(lang.code, lang.dir); setMobileOpen(false); }}
                    className={`px-2.5 py-1 text-xs rounded-md ${
                      i18n.language === lang.code ? "bg-neon text-black" : "glass-panel text-muted-foreground"
                    }`}
                  >{lang.label}</button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
