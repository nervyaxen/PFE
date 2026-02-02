import { ReactNode, useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useI18n } from "@/i18n";

type Bullet = {
  icon: ReactNode;
  title: string;
  desc: string;
};

type Props = {
  id: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  icon: ReactNode;
  bullets: Bullet[];
  spotlight: string;
  variant: "connectors" | "tilt" | "metrics" | "charts" | "cards" | "core" | "admin" | "auth" | "dashboard" | "stack";
};

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function useVariantNarration(variant: Props["variant"]) {
  return useMemo(() => {
    switch (variant) {
      case "connectors":
        return "Ecosystem Connectors|Neon lines trace relationships across platforms.";
      case "tilt":
        return "Glass Tilt|Micro-tilt reacts to your cursor like studio-lit glass.";
      case "metrics":
        return "Metrics Whisper|Hover to translate charts into decisions.";
      case "charts":
        return "Forecast Motion|Scroll to reveal the curves with cinematic easing.";
      case "cards":
        return "Product Cards|Neon edge-light follows your attention.";
      case "core":
        return "AI Core|A glowing nucleus anchors premium automation.";
      case "admin":
        return "Admin Cockpit|Clean governance, presented as luxury glass.";
      case "auth":
        return "Onboarding Flow|Soft neon focus guides sign-in actions.";
      case "dashboard":
        return "Widget Narration|Hover widgets to learn what matters instantly.";
      case "stack":
        return "Blueprint|A clear architecture summary, ready for implementation.";
      default:
        return "Scene|A Machrou3i story moment.";
    }
  }, [variant]);
}

export default function StorySection({ id, eyebrow, title, subtitle, icon, bullets, spotlight, variant }: Props) {
  const reduceMotion = useReducedMotion();
  const { t } = useI18n();
  const variantNarration = useVariantNarration(variant);

  return (
    <section id={id} className="relative min-h-screen px-6 py-16 md:py-20" aria-label={eyebrow}>
      <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-[0.95fr_1.05fr] md:items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-2" data-narrate={variantNarration}>
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-primary">{icon}</span>
            <p className="text-xs font-semibold tracking-wide text-muted-foreground">{eyebrow}</p>
          </div>

          <motion.h2
            className="mt-5 text-balance text-3xl font-semibold leading-tight md:text-4xl"
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            data-narrate={`${eyebrow}|${spotlight}`}
          >
            {title}
          </motion.h2>
          <p className="mt-3 max-w-xl text-pretty text-base text-muted-foreground">{subtitle}</p>

          <div className="mt-6 grid gap-3" aria-label="Highlights">
            {bullets.map((b) => (
              <div
                key={b.title}
                className="glass glass-hover rounded-2xl p-4"
                data-narrate={`${b.title}|${b.desc}`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">{b.icon}</div>
                  <div>
                    <p className="text-sm font-semibold">{b.title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{b.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <ScenePanel variant={variant} reduceMotion={!!reduceMotion} />
      </div>
    </section>
  );
}

function ScenePanel({ variant, reduceMotion }: { variant: Props["variant"]; reduceMotion: boolean }) {
  const { t } = useI18n();
  const base = "glass rounded-[2rem] p-5 md:p-6 overflow-hidden relative";

  if (variant === "core") {
    return (
      <div className={base} data-narrate="AI Core|A premium nucleus: intelligence + automation.">
        <div className="absolute inset-0" style={{ background: "radial-gradient(700px 420px at 30% 35%, hsl(var(--neon) / 0.20), transparent 60%), radial-gradient(700px 420px at 70% 65%, hsl(var(--gold) / 0.16), transparent 55%)" }} />
        <div className="relative grid place-items-center py-14">
          <motion.div
            className="relative grid h-44 w-44 place-items-center rounded-full"
            style={{ background: "radial-gradient(circle at 35% 30%, hsl(var(--neon) / 0.35), transparent 55%), radial-gradient(circle at 65% 70%, hsl(var(--gold) / 0.30), transparent 58%), radial-gradient(circle at 50% 50%, hsl(var(--surface) / 0.85), hsl(var(--surface) / 0.2))" }}
            animate={reduceMotion ? undefined : { rotate: 360 }}
            transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          >
            <div className="h-20 w-20 rounded-2xl bg-primary neon-outline" />
          </motion.div>
          <p className="mt-6 text-sm text-muted-foreground">{t("story.corePill")}</p>
        </div>
      </div>
    );
  }

  // Generic panel with a signature micro-tilt + neon connectors
  return (
    <motion.div
      className={base}
      data-narrate="Interactive Glass|Hover to see neon, reflections, and micro-motion."
      onMouseMove={(e) => {
        if (reduceMotion) return;
        const el = e.currentTarget;
        const rect = el.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width;
        const py = (e.clientY - rect.top) / rect.height;
        const rx = clamp((0.5 - py) * 8, -8, 8);
        const ry = clamp((px - 0.5) * 10, -10, 10);
        el.style.setProperty("--rx", `${rx}deg`);
        el.style.setProperty("--ry", `${ry}deg`);
        el.style.setProperty("--mx", `${px * 100}%`);
        el.style.setProperty("--my", `${py * 100}%`);
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget;
        el.style.setProperty("--rx", `0deg`);
        el.style.setProperty("--ry", `0deg`);
      }}
      style={{ transform: "perspective(1100px) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg))" }}
    >
      <div
        className="absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(700px 380px at var(--mx, 30%) var(--my, 30%), hsl(var(--neon) / 0.16), transparent 60%), radial-gradient(700px 420px at 70% 70%, hsl(var(--gold) / 0.12), transparent 58%)",
        }}
      />
      <div className="relative">
        <div className="grid gap-4">
          <MiniGrid variant={variant} reduceMotion={reduceMotion} />
        </div>
      </div>
    </motion.div>
  );
}

function MiniGrid({ variant, reduceMotion }: { variant: Props["variant"]; reduceMotion: boolean }) {
  const { t } = useI18n();
  const chips = (() => {
    switch (variant) {
      case "admin":
        return ["Admin", "Manager", "User", "Policies", "Tables", "Audits"];
      case "auth":
        return ["Email", "Password", "SSO", "RBAC", "MFA", "Sessions"];
      case "dashboard":
        return ["KPIs", "Forecast", "Risks", "Workflows", "Heatmaps", "Trends"];
      case "charts":
        return ["ROI", "Costs", "Forecast", "Confidence", "Runway", "Signals"];
      case "metrics":
        return ["Skills", "Load", "Collab", "Focus", "Quality", "Speed"];
      case "cards":
        return ["KPIs", "Competitors", "Segments", "Pricing", "Benchmarks", "Churn"];
      case "connectors":
        return ["Web", "Mobile", "Desktop", "Shared", "Sync", "Realtime"];
      case "stack":
        return ["React", "Electron", "Node", "MongoDB", "n8n", "JWT"];
      default:
        return ["Roadmap", "Milestones", "Risks", "Deadlines", "AI", "Workflows"];
    }
  })();

  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold">{t("story.scenePreview")}</p>
        <span className="inline-flex items-center gap-2 text-xs text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-neon animate-glow" />
          {t("story.liveGlass")}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3">
        {chips.map((c, idx) => (
          <motion.div
            key={c}
            className="rounded-2xl border border-border/60 bg-surface/40 px-3 py-3"
            initial={reduceMotion ? false : { opacity: 0, y: 10 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.35, delay: idx * 0.04, ease: "easeOut" }}
            data-narrate={`${c}|A key element of this scene.`}
          >
            <div className="h-8 w-full rounded-xl" style={{ background: "linear-gradient(90deg, hsl(var(--neon) / 0.12), hsl(var(--gold) / 0.10))" }} />
            <p className="mt-2 text-xs font-semibold">{c}</p>
            <p className="mt-1 text-[11px] text-muted-foreground">{t("story.hoverForDetail")}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
