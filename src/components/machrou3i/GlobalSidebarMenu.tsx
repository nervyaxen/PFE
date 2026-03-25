import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Menu, X, LayoutDashboard, BookOpenCheck, Sparkles, CreditCard, Settings } from "lucide-react";
import { useI18n } from "@/i18n";

const LINKS = [
    { to: "/", labelKey: "menu.dashboard", icon: LayoutDashboard, pathMatch: (path: string) => path === "/" },
    { to: "/library", labelKey: "menu.projectLibrary", icon: BookOpenCheck, pathMatch: (path: string) => path === "/library" },
    { to: "/library/ai-creator", labelKey: "menu.createNewProject", icon: Sparkles, pathMatch: (path: string) => path.startsWith("/library/ai-creator") },
    { to: "/payment", labelKey: "menu.payment", icon: CreditCard, pathMatch: (path: string) => path === "/payment" },
    { to: "/#admin", labelKey: "menu.settings", icon: Settings, pathMatch: () => false },
] as const;

export default function GlobalSidebarMenu() {
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
            <motion.div
                className="fixed bottom-6 right-6 z-[90] flex flex-col gap-3"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <motion.button
                    type="button"
                    onClick={() => setOpen(true)}
                    className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl glass glass-hover border border-border/60 text-foreground hover:border-neon/50 shadow-[0_8px_30px_-12px_hsl(var(--neon)/0.5)] transition-all duration-300 touch-manipulation relative overflow-hidden group"
                    aria-label={t("menu.open")}
                    aria-expanded={open}
                    whileTap={reduceMotion ? undefined : { scale: 0.92 }}
                >
                    {/* Neon glow effect inside the button */}
                    <div className="absolute inset-0 bg-neon/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <Menu className="h-6 w-6 sm:h-7 sm:w-7 relative z-10 drop-shadow-[0_0_8px_hsl(var(--neon)/0.5)]" aria-hidden />
                </motion.button>
            </motion.div>

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
                            className="fixed top-0 right-0 z-[101] h-full w-[min(340px,94vw)] max-w-[340px] glass border-l border-border/60 shadow-2xl flex flex-col"
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "tween", duration: reduceMotion ? 0.15 : 0.4, ease: [0.32, 0.72, 0, 1] }}
                            aria-label={t("menu.navigation")}
                        >
                            <div className="flex items-center justify-between p-5 border-b border-border/50 flex-shrink-0 bg-surface/30">
                                <div className="flex items-center gap-2">
                                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-primary shadow-[0_0_15px_-3px_hsl(var(--neon)/0.4)]">
                                        <Sparkles className="h-4 w-4 text-primary-foreground" />
                                    </span>
                                    <span className="text-base font-semibold text-shimmer animate-shimmer">
                                        {t("titles.machrou3i") || "Machrou3i"}
                                    </span>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setOpen(false)}
                                    className="flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground hover:text-foreground hover:bg-surface/60 hover:border-neon/30 hover:shadow-[0_0_15px_-5px_hsl(var(--neon)/0.3)] transition-all duration-200 border border-transparent"
                                    aria-label={t("menu.close")}
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                            <nav className="flex-1 min-h-0 overflow-auto py-6 px-4">
                                <ul className="space-y-2">
                                    {LINKS.map(({ to, labelKey, icon: Icon, pathMatch }, idx) => {
                                        const isActive = to.startsWith("/#") ? false : pathMatch(location.pathname);
                                        const isHash = to === "/#admin";
                                        return (
                                            <motion.li
                                                key={to}
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ duration: 0.3, delay: idx * 0.05 + 0.1 }}
                                            >
                                                {isHash ? (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleNav(to)}
                                                        className="flex items-center gap-4 w-full rounded-2xl px-5 py-4 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-surface/80 hover:border-neon/20 border border-transparent transition-all duration-300 text-left group"
                                                    >
                                                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface border border-border/50 group-hover:border-neon/30 group-hover:bg-primary/10 transition-colors">
                                                            <Icon className="h-5 w-5 group-hover:text-neon transition-colors" />
                                                        </span>
                                                        {t(labelKey)}
                                                    </button>
                                                ) : (
                                                    <Link
                                                        to={to}
                                                        onClick={() => setOpen(false)}
                                                        className={`flex items-center gap-4 rounded-2xl px-5 py-4 text-sm font-medium transition-all duration-300 group ${isActive
                                                            ? "bg-surface text-foreground border border-neon/30 shadow-[0_4px_20px_-8px_hsl(var(--neon)/0.25)] ring-1 ring-neon/10"
                                                            : "text-muted-foreground hover:text-foreground hover:bg-surface/80 hover:border-neon/20 border border-transparent"
                                                            }`}
                                                    >
                                                        <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition-colors ${isActive
                                                            ? "bg-primary border-primary text-primary-foreground shadow-[0_0_15px_-3px_hsl(var(--neon)/0.5)]"
                                                            : "bg-surface border-border/50 group-hover:border-neon/30 group-hover:bg-primary/10"
                                                            }`}>
                                                            <Icon className={`h-5 w-5 ${isActive ? "" : "group-hover:text-neon transition-colors"}`} />
                                                        </span>
                                                        <span className={isActive ? "text-neon font-semibold text-shadow-sm" : ""}>
                                                            {t(labelKey)}
                                                        </span>
                                                    </Link>
                                                )}
                                            </motion.li>
                                        );
                                    })}
                                </ul>
                            </nav>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
