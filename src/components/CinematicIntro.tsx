import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Sparkles, Eye, Users, DollarSign, Map, Cpu, Activity, Layers, Radar, ShieldCheck } from "lucide-react";

type CinematicMode = "user" | "admin";

const userScenes = [
  { key: "sparkles", icon: Sparkles, gradient: "from-neon/20 to-transparent" },
  { key: "vision", icon: Eye, gradient: "from-gold/20 to-transparent" },
  { key: "audience", icon: Users, gradient: "from-neon/20 to-transparent" },
  { key: "monetization", icon: DollarSign, gradient: "from-gold/20 to-transparent" },
  { key: "roadmap", icon: Map, gradient: "from-neon/20 to-transparent" },
];

const adminScenes = [
  { key: "init", icon: Cpu, gradient: "from-cyan-400/30 to-transparent" },
  { key: "analytics", icon: Activity, gradient: "from-sky-400/30 to-transparent" },
  { key: "network", icon: Layers, gradient: "from-purple-400/30 to-transparent" },
  { key: "monitoring", icon: Radar, gradient: "from-cyan-300/30 to-transparent" },
  { key: "ready", icon: ShieldCheck, gradient: "from-emerald-300/25 to-transparent" },
];

const SCENE_DURATION = 2800;

const atmosphereStyles: Record<string, string> = {
  sparkles: "bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.16),transparent_40%)]",
  vision: "bg-[radial-gradient(circle_at_center,rgba(251,191,36,0.14),transparent_45%)]",
  audience: "bg-[radial-gradient(circle_at_center,rgba(34,197,94,0.16),transparent_45%)]",
  monetization: "bg-[radial-gradient(circle_at_bottom,rgba(234,179,8,0.14),transparent_45%)]",
  roadmap: "bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.14),transparent_45%)]",
  init: "bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.18),transparent_30%)]",
  analytics: "bg-[radial-gradient(circle_at_center,rgba(96,165,250,0.14),transparent_32%)]",
  network: "bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.12),transparent_32%)]",
  monitoring: "bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.16),transparent_34%)]",
  ready: "bg-[radial-gradient(circle_at_center,rgba(52,211,153,0.18),transparent_34%)]",
};

const overlayStyles: Record<string, string> = {
  sparkles: "bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.14),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.08),transparent_25%)]",
  vision: "bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.12),transparent_28%),radial-gradient(circle_at_center_right,rgba(248,113,113,0.08),transparent_35%)]",
  audience: "bg-[radial-gradient(circle_at_top,rgba(34,197,94,0.12),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.08),transparent_30%)]",
  monetization: "bg-[radial-gradient(circle_at_top_right,rgba(234,179,8,0.12),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.08),transparent_30%)]",
  roadmap: "bg-[radial-gradient(circle_at_top_left,rgba(168,85,247,0.12),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(129,140,248,0.08),transparent_32%)]",
  init: "bg-[radial-gradient(circle_at_center,rgba(94,238,255,0.12),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(56,189,248,0.08),transparent_30%)]",
  analytics: "bg-[radial-gradient(circle_at_top_right,rgba(96,165,250,0.14),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(52,211,153,0.08),transparent_26%)]",
  network: "bg-[radial-gradient(circle_at_top_left,rgba(168,85,247,0.14),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.08),transparent_32%)]",
  monitoring: "bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.14),transparent_28%),radial-gradient(circle_at_center_left,rgba(34,211,238,0.08),transparent_32%)]",
  ready: "bg-[radial-gradient(circle_at_top,rgba(52,211,153,0.16),transparent_28%),radial-gradient(circle_at_bottom,rgba(168,85,247,0.08),transparent_30%)]",
};

const particleIndices = Array.from({ length: 14 }, (_, index) => index);

const highlightVariants = {
  hidden: { opacity: 0, y: 22, letterSpacing: "0.35em" },
  visible: { opacity: 1, y: 0, letterSpacing: "0.02em", transition: { duration: 0.46, ease: [0.22, 1, 0.36, 1] } },
};

const contentReveal = {
  hidden: { opacity: 0, y: 26 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.64, ease: [0.22, 1, 0.36, 1], delay: 0.24 } },
};

const progressVariants = {
  active: { width: 32, backgroundColor: "rgba(56,189,248,1)" },
  past: { width: 16, backgroundColor: "rgba(56,189,248,0.45)" },
  future: { width: 16, backgroundColor: "rgba(148,163,184,0.24)" },
};

const adminNodes = [
  { x: "10%", y: "18%", size: 5 },
  { x: "86%", y: "14%", size: 4 },
  { x: "28%", y: "64%", size: 6 },
  { x: "72%", y: "54%", size: 5 },
  { x: "52%", y: "26%", size: 7 },
];

const commandPanelNodes = [
  { x: "18%", y: "28%" },
  { x: "42%", y: "38%" },
  { x: "66%", y: "24%" },
  { x: "78%", y: "56%" },
];

const networkNodes = [
  { x: "24%", y: "26%", size: 5 },
  { x: "62%", y: "18%", size: 6 },
  { x: "42%", y: "56%", size: 5 },
  { x: "76%", y: "64%", size: 4 },
  { x: "16%", y: "58%", size: 5 },
];

const roadmapNodes = [
  { x: "14%", y: "32%" },
  { x: "34%", y: "22%" },
  { x: "58%", y: "46%" },
  { x: "78%", y: "34%" },
  { x: "34%", y: "68%" },
];

const CinematicIntro = ({ onComplete, mode = "user" }: { onComplete: () => void; mode?: CinematicMode }) => {
  const { t } = useTranslation();
  const [current, setCurrent] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const scenes = mode === "admin" ? adminScenes : userScenes;

  useEffect(() => {
    if (typeof window === "undefined") return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(media.matches);
    const handleChange = () => setPrefersReducedMotion(media.matches);
    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    if (current >= scenes.length) {
      onComplete();
      return;
    }
    const timer = setTimeout(() => setCurrent((p) => p + 1), SCENE_DURATION);
    return () => clearTimeout(timer);
  }, [current, onComplete, scenes.length]);

  if (current >= scenes.length) return null;

  const scene = scenes[current];
  const title = mode === "admin" ? t(`intro.admin.${scene.key}.title`) : t(`intro.${scene.key}.title`);
  const description = mode === "admin" ? t(`intro.admin.${scene.key}.desc`) : t(`intro.${scene.key}.desc`);
  const atmosphereClass = `${atmosphereStyles[scene.key] || ""} ${overlayStyles[scene.key] || ""}`;

  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-background flex flex-col items-center justify-center overflow-hidden"
      initial={prefersReducedMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.98, y: 10 }}
      animate={prefersReducedMotion ? { opacity: 1, scale: 1 } : { opacity: 1, scale: [1, 1.02, 1], y: [10, 0, 10], transition: { duration: 2.8, ease: [0.22, 1, 0.36, 1] } }}
      exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: -8, transition: { duration: 0.32, ease: "easeInOut" } }}
    >
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className={`absolute inset-0 bg-gradient-radial ${scene.gradient} ${atmosphereClass}`}
          animate={prefersReducedMotion ? {} : { scale: [1, 1.08, 1], opacity: [0.92, 1, 0.92] }}
          transition={{ duration: 3.2, ease: "easeInOut", repeat: Infinity }}
        />
        <motion.div
          className="absolute left-8 top-16 w-72 h-72 rounded-full bg-white/6 blur-3xl"
          animate={prefersReducedMotion ? {} : { x: [0, 12, 0], y: [0, -10, 0], opacity: [0.14, 0.54, 0.14] }}
          transition={{ duration: 5.8, ease: "easeInOut", repeat: Infinity }}
        />
        <motion.div
          className="absolute right-10 top-24 w-64 h-64 rounded-full bg-sky-400/10 blur-3xl"
          animate={prefersReducedMotion ? {} : { x: [0, -18, 0], y: [0, 14, 0], opacity: [0.12, 0.55, 0.12] }}
          transition={{ duration: 6.2, ease: "easeInOut", repeat: Infinity }}
        />
        <motion.div
          className="absolute inset-x-0 top-[18%] h-px bg-gradient-to-r from-transparent via-white/25 to-transparent"
          animate={prefersReducedMotion ? {} : { opacity: [0.1, 0.48, 0.1], x: [-18, 0, 18] }}
          transition={{ duration: 3.4, ease: "easeInOut", repeat: Infinity }}
        />
        <motion.div
          className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#020617]/90 via-transparent to-transparent"
          animate={prefersReducedMotion ? {} : { opacity: [0.08, 0.16, 0.08] }}
          transition={{ duration: 4.6, ease: "easeInOut", repeat: Infinity }}
        />
        {particleIndices.map((index) => (
          <motion.span
            key={index}
            aria-hidden="true"
            className={`absolute rounded-full shadow-[0_0_18px_rgba(56,189,248,0.16)] ${mode === "admin" ? "bg-cyan-200/20" : "bg-white/10"}`}
            style={{ width: 5 + (index % 3) * 2, height: 5 + (index % 3) * 2, top: `${8 + (index * 6) % 72}%`, left: `${(index * 14) % 90}%` }}
            animate={prefersReducedMotion ? { opacity: mode === "admin" ? 0.28 : 0.35 } : { y: [0, -10, 0], x: [0, 7, 0], opacity: [0.14, 0.64, 0.14] }}
            transition={{ duration: 4.8 + (index % 4) * 0.2, ease: "easeInOut", repeat: Infinity, delay: index * 0.08 }}
          />
        ))}
        {mode === "admin" && (
          <>
            <motion.div
              className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.08),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.08),transparent_25%)]"
              animate={prefersReducedMotion ? {} : { opacity: [0.05, 0.18, 0.05] }}
              transition={{ duration: 5.2, ease: "easeInOut", repeat: Infinity }}
            />
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(6)].map((_, index) => (
                <motion.span
                  key={index}
                  className="absolute h-px bg-white/5"
                  style={{ width: `${12 + index * 10}%`, top: `${18 + index * 9}%`, left: `${-4 + index * 4}%` }}
                  animate={prefersReducedMotion ? {} : { opacity: [0.03, 0.12, 0.03] }}
                  transition={{ duration: 4.8 + index * 0.4, ease: "easeInOut", repeat: Infinity }}
                />
              ))}
            </div>
          </>
        )}
        {mode === "user" && scene.key === "vision" && (
          <motion.div
            className="absolute inset-x-0 top-16 h-0.5 bg-gradient-to-r from-transparent via-white/40 to-transparent blur-sm"
            animate={prefersReducedMotion ? {} : { x: [-32, 0, 32], opacity: [0.12, 0.48, 0.12] }}
            transition={{ duration: 2.8, ease: "easeInOut", repeat: Infinity }}
          />
        )}
        {mode === "user" && scene.key === "audience" && (
          <div className="absolute inset-0">
            {networkNodes.map((node, index) => (
              <motion.span
                key={index}
                className="absolute rounded-full bg-white/20 shadow-[0_0_14px_rgba(34,197,94,0.28)]"
                style={{ width: node.size, height: node.size, top: node.y, left: node.x }}
                animate={prefersReducedMotion ? {} : { y: [0, -6, 0], opacity: [0.16, 0.55, 0.16] }}
                transition={{ duration: 4 + index * 0.4, repeat: Infinity, ease: "easeInOut", delay: index * 0.08 }}
              />
            ))}
          </div>
        )}
        {mode === "user" && scene.key === "monetization" && (
          <motion.div
            className="absolute inset-x-0 top-1/3 h-0.5 bg-gradient-to-r from-transparent via-[#fbbf24]/70 to-transparent blur-sm"
            animate={prefersReducedMotion ? {} : { x: [-18, 18, -18], opacity: [0.08, 0.46, 0.08] }}
            transition={{ duration: 3.6, ease: "easeInOut", repeat: Infinity }}
          />
        )}
        {mode === "user" && scene.key === "roadmap" && (
          <div className="absolute inset-0">
            {roadmapNodes.map((point, index) => (
              <motion.span
                key={index}
                className="absolute rounded-full bg-white/15 shadow-[0_0_18px_rgba(168,85,247,0.28)]"
                style={{ width: 5, height: 5, top: point.y, left: point.x }}
                animate={prefersReducedMotion ? {} : { scale: [1, 1.4, 1], opacity: [0.12, 0.58, 0.12] }}
                transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut", delay: index * 0.18 }}
              />
            ))}
          </div>
        )}
        {mode === "admin" && scene.key === "init" && (
          <motion.div
            className="absolute inset-0"
            animate={prefersReducedMotion ? {} : { opacity: [0.18, 0.4, 0.18], scale: [1, 1.02, 1] }}
            transition={{ duration: 5.2, ease: "easeInOut", repeat: Infinity }}
          />
        )}
        {mode === "admin" && scene.key === "analytics" && (
          <div className="absolute inset-0">
            <motion.div className="absolute left-10 top-24 w-40 h-24 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_0_48px_rgba(56,189,248,0.06)]" animate={prefersReducedMotion ? {} : { y: [0, -6, 0] }} transition={{ duration: 4.2, repeat: Infinity }} />
            <motion.div className="absolute right-12 top-28 w-32 h-20 rounded-3xl border border-white/10 bg-sky-500/10 backdrop-blur-xl shadow-[0_0_40px_rgba(56,189,248,0.08)]" animate={prefersReducedMotion ? {} : { x: [0, 6, 0] }} transition={{ duration: 4.6, repeat: Infinity }} />
            <motion.div className="absolute left-1/2 top-52 -translate-x-1/2 w-56 h-24 rounded-3xl border border-white/10 bg-violet-500/10 backdrop-blur-xl shadow-[0_0_40px_rgba(168,85,247,0.08)]" animate={prefersReducedMotion ? {} : { opacity: [0.2, 0.7, 0.2] }} transition={{ duration: 4.4, repeat: Infinity }} />
          </div>
        )}
        {mode === "admin" && scene.key === "network" && (
          <div className="absolute inset-0">
            {commandPanelNodes.map((point, index) => (
              <motion.span
                key={index}
                className="absolute rounded-full bg-cyan-200/20 shadow-[0_0_18px_rgba(56,189,248,0.18)]"
                style={{ width: 8, height: 8, top: point.y, left: point.x }}
                animate={prefersReducedMotion ? {} : { scale: [1, 1.6, 1], opacity: [0.15, 0.7, 0.15] }}
                transition={{ duration: 3.8, repeat: Infinity, delay: index * 0.12, ease: "easeInOut" }}
              />
            ))}
          </div>
        )}
        {mode === "admin" && scene.key === "monitoring" && (
          <div className="absolute inset-0">
            <motion.div
              className="absolute inset-x-0 top-28 h-0.5 bg-gradient-to-r from-transparent via-cyan-300/70 to-transparent blur-sm"
              animate={prefersReducedMotion ? {} : { x: [-36, 0, 36], opacity: [0.08, 0.5, 0.08] }}
              transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute left-16 top-20 w-24 h-24 rounded-full border border-cyan-300/20"
              animate={prefersReducedMotion ? {} : { rotate: [0, 360] }}
              transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            />
          </div>
        )}
        {mode === "admin" && scene.key === "ready" && (
          <div className="absolute inset-0">
            <motion.div
              className="absolute left-16 top-14 w-24 h-24 rounded-full bg-cyan-300/10 border border-cyan-300/20"
              animate={prefersReducedMotion ? {} : { scale: [1, 1.08, 1] }}
              transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute right-16 bottom-16 w-20 h-20 rounded-full bg-fuchsia-400/10 border border-fuchsia-400/20"
              animate={prefersReducedMotion ? {} : { y: [0, -8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        )}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={scene.key}
          initial={prefersReducedMotion ? { opacity: 0, y: 10 } : { opacity: 0, scale: 0.86, y: 30, rotateX: 16 }}
          animate={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 1, scale: 1, y: 0, rotateX: 0, transition: { duration: 0.72, ease: [0.22, 1, 0.36, 1] } }}
          exit={prefersReducedMotion ? { opacity: 0, y: -10 } : { opacity: 0, scale: 0.92, y: -26, rotateX: -10, transition: { duration: 0.52, ease: [0.22, 1, 0.36, 1] } }}
          className="text-center relative z-10 max-w-2xl px-4"
        >
          <motion.div
            className="w-20 h-20 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_rgba(56,189,248,0.18)] backdrop-blur-xl will-change-transform"
            initial={prefersReducedMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.78, rotateY: -18, rotateZ: -4 }}
            animate={prefersReducedMotion ? { opacity: 1, scale: 1 } : { opacity: [1, 1, 1], scale: [1, 1.08, 1], rotate: [0, 10, -8, 0], rotateY: [0, 16, -16, 0], transition: { duration: 4.8, ease: [0.22, 1, 0.36, 1], repeat: Infinity } }}
            whileHover={prefersReducedMotion ? {} : { scale: 1.06, rotate: 2 }}
          >
            <motion.div
              className="relative"
              initial={prefersReducedMotion ? {} : { scale: 0.94, opacity: 0.9 }}
              animate={prefersReducedMotion ? {} : { scale: [0.94, 1.02, 0.96], opacity: [0.9, 1, 0.9] }}
              transition={{ duration: 4.2, ease: "easeInOut", repeat: Infinity }}
            >
              <scene.icon className="h-10 w-10 text-cyan-300" />
            </motion.div>
          </motion.div>
          <motion.h2
            className="text-3xl md:text-4xl font-bold font-heading mb-3 leading-tight"
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
          >
            {String(title).split(" ").map((word, index) => (
              <motion.span
                key={`${scene.key}-word-${index}`}
                variants={highlightVariants}
                className="inline-block mr-2 whitespace-pre"
                style={{ textShadow: index === 0 ? "0 0 26px rgba(56,189,248,0.18)" : undefined }}
              >
                {word}
              </motion.span>
            ))}
          </motion.h2>
          <motion.p
            className="text-muted-foreground text-lg max-w-md mx-auto leading-relaxed"
            variants={contentReveal}
            initial="hidden"
            animate="visible"
            transition={{ ease: [0.22, 1, 0.36, 1], duration: 0.7, delay: 0.18 }}
          >
            {description}
          </motion.p>
        </motion.div>
      </AnimatePresence>

      {mode === "admin" ? (
        <div className="absolute bottom-24 w-full max-w-4xl px-4">
          <div className="relative h-3 rounded-full bg-white/10 overflow-hidden shadow-[0_0_24px_rgba(56,189,248,0.14)]">
            <motion.div
              className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-cyan-400 via-sky-500 to-violet-500 shadow-[0_0_30px_rgba(56,189,248,0.6)]"
              style={{ width: `${((current + 1) / scenes.length) * 100}%` }}
              animate={prefersReducedMotion ? {} : { x: [0, 6, 0] }}
              transition={{ duration: 2.8, ease: "easeInOut", repeat: Infinity }}
            />
            {scenes.map((item, index) => (
              <div
                key={item.key}
                className="absolute top-1/2 h-5 w-5 -translate-y-1/2 rounded-full border border-white/15 bg-background"
                style={{ left: `${(index / (scenes.length - 1)) * 100}%`, transform: `translate(-50%, -50%)` }}
              >
                <div className={`h-full w-full rounded-full ${index === current ? "bg-cyan-400 shadow-[0_0_18px_rgba(56,189,248,0.6)]" : index < current ? "bg-sky-400/80" : "bg-white/10"}`} />
              </div>
            ))}
          </div>
          <div className="mt-3 flex items-center justify-between text-xs uppercase tracking-[0.22em] text-white/70">
            {scenes.map((item, index) => (
              <span key={item.key} className={`min-w-[16%] text-center ${index === current ? "text-white" : "text-white/50"}`}>
                {item.key.toUpperCase()}
              </span>
            ))}
          </div>
        </div>
      ) : (
        <div className="absolute bottom-20 flex gap-2">
          {scenes.map((_, i) => (
            <motion.div
              key={i}
              className="h-1.5 rounded-full"
              variants={progressVariants}
              animate={i === current ? "active" : i < current ? "past" : "future"}
              transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
            />
          ))}
        </div>
      )}

      <motion.button
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
        whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
        whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
        onClick={onComplete}
        className="absolute bottom-8 rounded-full border border-white/10 bg-white/10 px-5 py-2 text-sm text-white/90 shadow-[0_0_30px_rgba(56,189,248,0.15)] backdrop-blur-xl transition duration-300 hover:border-white/20 hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-cyan-400/30"
      >
        <span className="relative inline-flex items-center gap-2">
          <span className="inline-flex h-2.5 w-2.5 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(56,189,248,0.5)]" />
          {t("intro.skip")} →
        </span>
      </motion.button>
    </motion.div>
  );
};

export default CinematicIntro;
