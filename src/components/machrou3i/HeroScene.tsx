import { useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { motion, useReducedMotion } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import { Float, Html, RoundedBox } from "@react-three/drei";
import { Laptop, Smartphone, Monitor, Sparkles } from "lucide-react";
import { useI18n } from "@/i18n";

import HeroVideoPlaceholder from "./HeroVideoPlaceholder";

export default function HeroScene() {
  const reduceMotion = useReducedMotion();
  const { t } = useI18n();

  return (
    <section className="relative min-h-screen px-6 pb-10 pt-16" aria-label="Machrou3i hero">
      <Helmet>
        <meta property="og:title" content="Machrou3i – Intelligence for Projects" />
        <meta property="og:description" content="Plan, analyze, predict, build — a luxury, cinematic platform story." />
      </Helmet>

      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[1.05fr_0.95fr] md:items-center">
        <div>
          <div
            className="inline-flex items-center gap-2 rounded-full glass px-3 py-2"
            data-narrate="Cinematic Mode|Scroll vertically—each section is a scene with snap transitions."
          >
            <span className="h-2 w-2 rounded-full bg-neon animate-glow" />
            <p className="text-xs text-muted-foreground">{t("hero.eyebrow")}</p>
          </div>

          <h1 className="mt-5 text-balance text-4xl font-semibold leading-[1.05] md:text-6xl" data-narrate="Machrou3i|Intelligence for Projects—presented like a film.">
            <span className="text-shimmer animate-shimmer">{t("titles.machrou3i")}</span>
            <span className="block">– {t("titles.intelligenceForProjects")}</span>
          </h1>

          <p className="mt-4 max-w-xl text-pretty text-base text-muted-foreground md:text-lg" data-narrate="Plan • Analyze • Predict • Build|Your roadmap, your data, your decisions—sharpened by AI.">
            {t("titles.planAnalyzePredictBuild")}
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <a
              href="#premium"
              className="glass glass-hover neon-outline inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold"
              data-narrate="Primary CTA|Jump to premium intelligence and automation."
            >
              {t("buttons.explorePremium")}
            </a>
            <a
              href="#dashboard"
              className="glass glass-hover gold-outline inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold"
              data-narrate="Secondary CTA|See the dashboard preview scene."
            >
              {t("buttons.watchDashboard")}
            </a>
          </div>

          <div className="mt-7 grid grid-cols-3 gap-3" aria-label="Platforms">
            {[{ Icon: Monitor, label: t("hero.web") }, { Icon: Smartphone, label: t("hero.mobile") }, { Icon: Laptop, label: t("hero.desktop") }].map(({ Icon, label }) => (
              <div
                key={label}
                className="glass rounded-2xl px-4 py-3 text-center glass-hover"
                data-narrate={`${label} Surface|A dedicated experience, powered by one shared core.`}
              >
                <motion.div
                  className="mx-auto mb-2 grid h-10 w-10 place-items-center rounded-xl bg-primary"
                  animate={reduceMotion ? undefined : { rotateY: [0, 14, 0], rotateX: [0, -8, 0] }}
                  transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Icon className="h-5 w-5 text-primary-foreground" />
                </motion.div>
                <p className="text-xs font-semibold">{label}</p>
                <p className="text-[11px] text-muted-foreground">{t("hero.sameCodebase")}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 -z-10 rounded-[2rem]" style={{ background: "radial-gradient(circle at 30% 20%, hsl(var(--neon) / 0.18), transparent 60%), radial-gradient(circle at 70% 60%, hsl(var(--gold) / 0.14), transparent 55%)" }} />
          <div className="glass rounded-[2rem] p-3 md:p-4" data-narrate="3D Dashboard|Floating glass panels suggest a premium dashboard in depth.">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem]">
              <HeroVideoPlaceholder />
              <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(900px 400px at 80% 10%, hsl(var(--gold) / 0.08), transparent 55%), radial-gradient(900px 500px at 10% 80%, hsl(var(--neon) / 0.10), transparent 60%)" }} />
            </div>
          </div>
          <p className="mt-3 text-xs text-muted-foreground" data-narrate="Tip|Hover any card to hear the cursor narrator.">
            {t("hero.tip")}
          </p>
        </div>
      </div>

      <div className="pointer-events-none absolute left-1/2 top-0 h-[1px] w-[92%] max-w-6xl -translate-x-1/2" style={{ background: "linear-gradient(90deg, transparent, hsl(var(--gold) / 0.35), hsl(var(--neon) / 0.35), transparent)" }} />
    </section>
  );
}
