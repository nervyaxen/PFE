import { motion, useReducedMotion } from "framer-motion";
import { Sparkles, Eye, Users, DollarSign, Swords, AlertTriangle, Map, LayoutDashboard } from "lucide-react";
import { useI18n } from "@/i18n";

const SCENE_ICONS = [
  Sparkles,
  Eye,
  Users,
  DollarSign,
  Swords,
  AlertTriangle,
  Map,
  LayoutDashboard,
];

export type StoryTimelineStep = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

const STEP_KEYS: Record<StoryTimelineStep, string> = {
  1: "spark",
  2: "vision",
  3: "audience",
  4: "monetization",
  5: "competition",
  6: "risks",
  7: "roadmap",
  8: "dashboard",
};

type StoryTimelineProps = {
  currentStep: number;
  totalSteps?: number;
  className?: string;
};

export default function StoryTimeline({ currentStep, totalSteps = 8, className = "" }: StoryTimelineProps) {
  const { t } = useI18n();
  const reduceMotion = useReducedMotion();

  return (
    <div className={className} role="progressbar" aria-valuenow={currentStep} aria-valuemin={1} aria-valuemax={totalSteps} aria-label={t("storyTimeline.title")}>
      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
        {t("storyTimeline.title")}
      </p>
      <div className="flex items-center gap-0 overflow-x-auto pb-1 scrollbar-none -mx-1 px-1">
        {(Array.from({ length: totalSteps }, (_, i) => i + 1) as StoryTimelineStep[]).flatMap((step, idx) => {
          const isPast = step < currentStep;
          const isCurrent = step === currentStep;
          const Icon = SCENE_ICONS[idx] ?? Sparkles;
          const stepKey = STEP_KEYS[step];
          const circle = (
            <motion.div
              key={`step-${step}`}
              className={`
                flex flex-shrink-0 h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-xl border transition-all duration-300
                ${isCurrent ? "bg-neon/20 border-neon text-neon shadow-[0_0_20px_-6px_hsl(var(--neon)/0.6)]" : ""}
                ${isPast ? "bg-primary/40 border-primary/60 text-primary-foreground" : ""}
                ${!isCurrent && !isPast ? "border-border/60 bg-surface/50 text-muted-foreground" : ""}
              `}
              initial={reduceMotion ? false : { opacity: 0, scale: 0.9 }}
              animate={reduceMotion ? undefined : { opacity: 1, scale: 1 }}
              transition={{ duration: 0.25, delay: idx * 0.04 }}
              title={t(`storyTimeline.${stepKey}`)}
            >
              <Icon className="h-3.5 w-3.5" />
            </motion.div>
          );
          const connector = idx < totalSteps - 1 ? (
            <div
              key={`conn-${step}`}
              className={`h-0.5 w-2 flex-shrink-0 rounded-full transition-colors duration-300 ${step < currentStep ? "bg-primary/70" : "bg-border/50"}`}
            />
          ) : null;
          return connector ? [circle, connector] : [circle];
        })}
      </div>
    </div>
  );
}
