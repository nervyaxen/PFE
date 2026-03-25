import { motion, useReducedMotion } from "framer-motion";
import { MessageSquare, Sparkles } from "lucide-react";
import { useI18n } from "@/i18n";
import type { AiProjectDraftState } from "@/lib/ai-guided-project";

function getStepSummary(draft: AiProjectDraftState, step: number): string {
  switch (step) {
    case 1:
      return draft.step1.name
        ? [draft.step1.name, draft.step1.shortDescription, draft.step1.category].filter(Boolean).join(" · ") || ""
        : "";
    case 2:
      return [draft.step2.solution, draft.step2.problem].filter(Boolean).slice(0, 1).join("") || "";
    case 3:
      return [draft.step3.targetUsers, draft.step3.industry, draft.step3.region].filter(Boolean).join(" · ") || "";
    case 4:
      return [draft.step4.revenueModel, draft.step4.pricingModel].filter(Boolean).join(" · ") || "";
    case 5:
      return [draft.step5.competitors, draft.step5.advantages].filter(Boolean).slice(0, 1).join("") || "";
    case 6:
      return [draft.step6.marketRisks, draft.step6.technicalRisks].filter(Boolean).slice(0, 1).join("") || "";
    case 7:
      return draft.roadmap?.summary?.slice(0, 120) + (draft.roadmap && draft.roadmap.summary.length > 120 ? "…" : "") || "";
    case 8:
      return "";
    default:
      return "";
  }
}

const STEP_HINTS: Record<number, string> = {
  1: "aiCreator.stepHints.step1",
  2: "aiCreator.stepHints.step2",
  3: "aiCreator.stepHints.step3",
  4: "aiCreator.stepHints.step4",
  5: "aiCreator.stepHints.step5",
  6: "aiCreator.stepHints.step6",
  7: "aiCreator.stepHints.step7",
};

type StepConclusionHintProps = {
  draft: AiProjectDraftState;
  currentStep: number;
  className?: string;
};

export default function StepConclusionHint({ draft, currentStep, className = "" }: StepConclusionHintProps) {
  const { t } = useI18n();
  const reduceMotion = useReducedMotion();
  const summary = getStepSummary(draft, currentStep);
  const hintKey = STEP_HINTS[currentStep];
  if (currentStep >= 8) return null;

  return (
    <motion.div
      className={`rounded-xl border border-border/50 bg-surface/40 px-4 py-3 glass depth-shadow ${className}`}
      initial={reduceMotion ? false : { opacity: 0, y: 8 }}
      animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2 mb-1">
        <Sparkles className="h-3 w-3 text-neon" />
        {t("cinematic.concludingHint")}
      </p>
      {summary && <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{summary}</p>}
      {hintKey && (
        <p className="text-[11px] text-muted-foreground/90 flex items-start gap-2">
          <MessageSquare className="h-3 w-3 text-neon/80 mt-0.5 shrink-0" />
          <span>{t(hintKey)}</span>
        </p>
      )}
    </motion.div>
  );
}
