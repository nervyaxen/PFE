import { motion, useReducedMotion } from "framer-motion";
import { Target, Building2, MapPin, AlertTriangle, TrendingUp } from "lucide-react";
import { useI18n } from "@/i18n";

export type MarketSignalData = {
  targeting?: string;
  industry?: string;
  region?: string;
  risksFlagged?: boolean;
  hasOpportunity?: boolean;
};

type MarketSignalIndicatorsProps = {
  data: MarketSignalData;
  className?: string;
};

const INDICATORS = [
  { key: "targeting", icon: Target, valueKey: "targeting" as const },
  { key: "industry", icon: Building2, valueKey: "industry" as const },
  { key: "region", icon: MapPin, valueKey: "region" as const },
];

export default function MarketSignalIndicators({ data, className = "" }: MarketSignalIndicatorsProps) {
  const { t } = useI18n();
  const reduceMotion = useReducedMotion();

  return (
    <div className={className}>
      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
        {t("marketSignals.label")}
      </p>
      <div className="flex flex-wrap gap-2">
        {INDICATORS.map(({ key, icon: Icon, valueKey }, idx) => {
          const value = data[valueKey];
          const display = value && String(value).trim() ? String(value) : "—";
          return (
            <motion.div
              key={key}
              className="flex items-center gap-2 rounded-xl bg-surface/50 border border-border/50 px-2.5 py-1.5 min-w-0"
              initial={reduceMotion ? false : { opacity: 0, scale: 0.96 }}
              animate={reduceMotion ? undefined : { opacity: 1, scale: 1 }}
              transition={{ duration: 0.25, delay: idx * 0.05 }}
            >
              <Icon className="h-3 w-3 text-neon shrink-0" />
              <span className="text-[11px] text-muted-foreground truncate max-w-[8rem]" title={display}>
                {display}
              </span>
            </motion.div>
          );
        })}
        {data.risksFlagged && (
          <motion.div
            className="flex items-center gap-2 rounded-xl bg-destructive/10 border border-destructive/30 px-2.5 py-1.5"
            initial={reduceMotion ? false : { opacity: 0, scale: 0.96 }}
            animate={reduceMotion ? undefined : { opacity: 1, scale: 1 }}
            transition={{ duration: 0.25, delay: 0.2 }}
          >
            <AlertTriangle className="h-3 w-3 text-destructive shrink-0" />
            <span className="text-[11px] text-destructive">{t("marketSignals.risksFlagged")}</span>
          </motion.div>
        )}
        {data.hasOpportunity && (
          <motion.div
            className="flex items-center gap-2 rounded-xl bg-neon/10 border border-neon/30 px-2.5 py-1.5"
            initial={reduceMotion ? false : { opacity: 0, scale: 0.96 }}
            animate={reduceMotion ? undefined : { opacity: 1, scale: 1 }}
            transition={{ duration: 0.25, delay: 0.25 }}
          >
            <TrendingUp className="h-3 w-3 text-neon shrink-0" />
            <span className="text-[11px] text-neon">{t("marketSignals.opportunity")}</span>
          </motion.div>
        )}
      </div>
    </div>
  );
}
