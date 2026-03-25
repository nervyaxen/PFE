import { motion, useReducedMotion } from "framer-motion";
import { Lightbulb } from "lucide-react";
import { useI18n } from "@/i18n";

export type ScenarioCardId = "targetStudents" | "becomeSaaS" | "goB2B";

type ScenarioCardsProps = {
  onApply?: (scenarioId: ScenarioCardId) => void;
  className?: string;
};

const SCENARIOS: { id: ScenarioCardId; hintKey: string }[] = [
  { id: "targetStudents", hintKey: "targetStudentsHint" },
  { id: "becomeSaaS", hintKey: "becomeSaaSHint" },
  { id: "goB2B", hintKey: "goB2BHint" },
];

export default function ScenarioCards({ onApply, className = "" }: ScenarioCardsProps) {
  const { t } = useI18n();
  const reduceMotion = useReducedMotion();

  return (
    <div className={className}>
      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
        {t("scenarios.title")}
      </p>
      <p className="text-xs text-muted-foreground mb-2">{t("scenarios.subtitle")}</p>
      <div className="flex flex-wrap gap-2">
        {SCENARIOS.map(({ id, hintKey }, idx) => (
          <motion.button
            key={id}
            type="button"
            className="glass glass-hover rounded-xl px-3 py-2.5 text-left w-full sm:max-w-[14rem] border border-border/50 hover:border-neon/40 transition-colors duration-300"
            initial={reduceMotion ? false : { opacity: 0, y: 8 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.08 }}
            whileHover={reduceMotion ? undefined : { y: -2 }}
            onClick={() => onApply?.(id)}
          >
            <span className="flex items-center gap-2 text-xs font-medium text-foreground">
              <Lightbulb className="h-3.5 w-3.5 text-gold shrink-0" />
              {t(`scenarios.${id}`)}
            </span>
            <p className="mt-1 text-[11px] text-muted-foreground">{t(`scenarios.${hintKey}`)}</p>
            {onApply && (
              <span className="mt-2 inline-block text-[10px] font-medium text-neon">
                {t("scenarios.applyScenario")} →
              </span>
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
