import { motion, useReducedMotion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useI18n } from "@/i18n";

type IdeaExpansionSuggestionsProps = {
  className?: string;
};

export default function IdeaExpansionSuggestions({ className = "" }: IdeaExpansionSuggestionsProps) {
  const { t } = useI18n();
  const reduceMotion = useReducedMotion();
  const suggestions = [
    t("ideaExpansion.suggestion1"),
    t("ideaExpansion.suggestion2"),
    t("ideaExpansion.suggestion3"),
  ];

  return (
    <div className={className}>
      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 flex items-center gap-1.5">
        <Sparkles className="h-3 w-3 text-neon" />
        {t("ideaExpansion.title")}
      </p>
      <p className="text-xs text-muted-foreground mb-2">{t("ideaExpansion.subtitle")}</p>
      <ul className="space-y-1.5">
        {suggestions.map((text, idx) => (
          <motion.li
            key={idx}
            className="flex items-start gap-2 text-xs text-muted-foreground rounded-xl py-2 px-3 bg-surface/50 border border-border/50 glass-hover floating-panel"
            initial={reduceMotion ? false : { opacity: 0, x: -8 }}
            animate={reduceMotion ? undefined : { opacity: 1, x: 0 }}
            transition={{ duration: 0.25, delay: idx * 0.06 }}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-neon/80 mt-1.5 shrink-0" />
            <span>{text}</span>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
