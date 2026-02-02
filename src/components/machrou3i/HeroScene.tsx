import { useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { motion, useReducedMotion } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import { Float, Html, RoundedBox } from "@react-three/drei";
import { Laptop, Smartphone, Monitor, Sparkles } from "lucide-react";
import { useI18n } from "@/i18n";

function GlassPanel({ position, rotation, size }: { position: [number, number, number]; rotation: [number, number, number]; size: [number, number, number] }) {
  return (
    <Float speed={1.1} rotationIntensity={0.45} floatIntensity={0.35}>
      <RoundedBox args={size} position={position} rotation={rotation} radius={0.12} smoothness={4}>
        <meshPhysicalMaterial
          transparent
          opacity={0.38}
          roughness={0.1}
          metalness={0.2}
          clearcoat={1}
          clearcoatRoughness={0.15}
          transmission={0.8}
          thickness={0.9}
          ior={1.35}
          color="#0a1c14"
        />
      </RoundedBox>
    </Float>
  );
}

function Hero3D({ t }: { t: (k: string) => string }) {
  const panels = useMemo(
    () => [
      {
        position: [-1.4, 0.35, 0] as [number, number, number],
        rotation: [0.2, -0.35, 0.08] as [number, number, number],
        size: [1.7, 1.05, 0.08] as [number, number, number],
      },
      {
        position: [0.1, -0.05, -0.2] as [number, number, number],
        rotation: [0.12, 0.22, -0.04] as [number, number, number],
        size: [2.2, 1.35, 0.08] as [number, number, number],
      },
      {
        position: [1.55, 0.25, 0.15] as [number, number, number],
        rotation: [0.18, 0.55, -0.03] as [number, number, number],
        size: [1.55, 0.9, 0.08] as [number, number, number],
      },
    ],
    [],
  );

  return (
    <group>
      <ambientLight intensity={0.7} />
      <directionalLight position={[3, 4, 2]} intensity={1.2} />
      <pointLight position={[-4, 1, 2]} intensity={1.4} color="#1efad1" />
      <pointLight position={[4, 0, 2]} intensity={1.1} color="#f2c84b" />

      {panels.map((p, i) => (
        <GlassPanel key={i} position={p.position} rotation={p.rotation} size={p.size} />
      ))}

      <Float speed={1.4} rotationIntensity={0.7} floatIntensity={0.35}>
        <Html position={[0.05, 0.15, 0.12]} transform occlude style={{ pointerEvents: "none" }}>
          <div className="glass rounded-2xl px-4 py-3 neon-outline">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-primary">
                <Sparkles className="h-4 w-4 text-primary-foreground" />
              </span>
              <div>
                <p className="text-xs font-semibold tracking-wide text-shimmer">{t("hero.aiRoadmap")}</p>
                <p className="text-xs text-muted-foreground">{t("hero.risksDeadlines")}</p>
              </div>
            </div>
          </div>
        </Html>
      </Float>
    </group>
  );
}

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
              <Canvas camera={{ position: [0, 0.4, 4.2], fov: 48 }} dpr={[1, 2]}>
                <Hero3D t={t} />
              </Canvas>
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
