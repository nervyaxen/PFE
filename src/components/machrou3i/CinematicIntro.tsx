import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  Sparkles,
  Eye,
  Users,
  DollarSign,
  Map,
  SkipForward,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/i18n";

// START SAFE MODIFICATION — 5-Scene Intro that shows every refresh
export const INTRO_STORAGE_KEY = "machrou3i-ai-creator-intro-seen";
const SCENE_DURATION_MS = 4500;

// Reduced from 8 to 5 curated scenes
const STEP_KEYS = [
  "spark",
  "vision",
  "audience",
  "monetization",
  "roadmap",
] as const;

const SCENE_ICONS = [
  Sparkles,
  Eye,
  Users,
  DollarSign,
  Map,
];

type CinematicIntroProps = {
  onComplete: () => void;
};

// Keep these exports for backward compatibility, but they are no longer
// used to gate whether the intro plays (it now plays every refresh).
export function hasSeenIntro(): boolean {
  // Always return false so the intro plays on every refresh
  return false;
}

export function markIntroSeen(): void {
  try {
    localStorage.setItem(INTRO_STORAGE_KEY, "1");
  } catch {
    /* ignore */
  }
}

export function clearIntroSeen(): void {
  try {
    localStorage.removeItem(INTRO_STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

export default function CinematicIntro({ onComplete }: CinematicIntroProps) {
  const { t } = useI18n();
  const reduceMotion = useReducedMotion();
  const [sceneIndex, setSceneIndex] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  const handleComplete = useCallback(() => {
    if (isExiting) return;
    setIsExiting(true);
    markIntroSeen();
    onComplete();
  }, [onComplete, isExiting]);

  const handleSkip = useCallback(() => {
    handleComplete();
  }, [handleComplete]);

  useEffect(() => {
    if (isExiting) return;
    const timer = setTimeout(() => {
      if (sceneIndex < STEP_KEYS.length - 1) {
        setSceneIndex((i) => i + 1);
      } else {
        handleComplete();
      }
    }, SCENE_DURATION_MS);
    return () => clearTimeout(timer);
  }, [sceneIndex, isExiting, handleComplete]);

  const stepKey = STEP_KEYS[sceneIndex];
  const Icon = SCENE_ICONS[sceneIndex] ?? Sparkles;

  return (
    <div className="fixed inset-0 z-[60] bg-hero flex flex-col overflow-hidden">
      {/* Parallax background layers */}
      <div
        className="parallax-layer opacity-40"
        style={{
          background:
            "radial-gradient(1400px 800px at 20% 10%, hsl(var(--neon) / 0.25), transparent 55%), radial-gradient(1200px 600px at 80% 80%, hsl(var(--gold) / 0.2), transparent 50%)",
        }}
      />
      <div
        className="parallax-layer opacity-60"
        style={{
          background:
            "radial-gradient(600px 400px at 70% 20%, hsl(var(--primary) / 0.15), transparent 60%)",
        }}
      />

      {/* Skip button */}
      <div className="absolute top-20 right-4 sm:right-6 z-10">
        <Button
          variant="ghost"
          size="sm"
          className="glass glass-hover rounded-xl text-muted-foreground hover:text-foreground"
          onClick={handleSkip}
        >
          <SkipForward className="h-4 w-4 mr-2" />
          {t("aiCreator.introSkip")}
        </Button>
      </div>

      {/* Progress dots — 5 dots */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {STEP_KEYS.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full transition-all duration-500 ${i <= sceneIndex ? "bg-neon w-6" : "bg-border/60 w-1.5"
              }`}
          />
        ))}
      </div>

      {/* Scene content */}
      <div className="flex-1 flex items-center justify-center px-6 py-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={sceneIndex}
            className="cinematic-scene w-full max-w-2xl mx-auto text-center"
            initial={reduceMotion ? false : { opacity: 0, scale: 0.96, y: 20 }}
            animate={reduceMotion ? undefined : { opacity: 1, scale: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, scale: 0.98, y: -20 }}
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <motion.div
              className="inline-flex items-center justify-center w-20 h-20 rounded-2xl glass depth-shadow-elevated mb-6"
              initial={reduceMotion ? false : { opacity: 0, rotateY: -15 }}
              animate={reduceMotion ? undefined : { opacity: 1, rotateY: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              style={{ transformStyle: "preserve-3d", perspective: 1000 }}
            >
              <Icon className="h-10 w-10 text-neon" />
            </motion.div>
            <motion.p
              className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2"
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={reduceMotion ? undefined : { opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              {t("cinematic.chapter", { n: sceneIndex + 1 })} · {t(`storyTimeline.${stepKey}`)}
            </motion.p>
            <motion.h2
              className="text-2xl sm:text-3xl md:text-4xl font-semibold text-shimmer mb-4"
              initial={reduceMotion ? false : { opacity: 0, y: 10 }}
              animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.25 }}
            >
              {t(`aiCreator.introScenes.${stepKey}.title`)}
            </motion.h2>
            <motion.p
              className="text-sm sm:text-base text-muted-foreground max-w-lg mx-auto"
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={reduceMotion ? undefined : { opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.35 }}
            >
              {t(`aiCreator.introScenes.${stepKey}.hint`)}
            </motion.p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center">
        <p className="text-[11px] text-muted-foreground">
          {sceneIndex < STEP_KEYS.length - 1
            ? t("aiCreator.introNextHint")
            : t("aiCreator.introFinalHint")}
        </p>
      </div>
    </div>
  );
}
// END SAFE MODIFICATION
