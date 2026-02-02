import { motion, useReducedMotion } from "framer-motion";
import { Sparkles, Layers, Gauge, Check, Zap, Crown } from "lucide-react";
import { Link } from "react-router-dom";
import { useI18n } from "@/i18n";

export default function PricingSection() {
  const reduceMotion = useReducedMotion();
  const { t } = useI18n();

  const tiers = [
    {
      id: "starter",
      nameKey: "premium.tierStarter",
      price: "$29",
      periodKey: "premium.periodMonth",
      descriptionKey: "premium.descStarter",
      featureKeys: [
        "premium.featureBasicPm",
        "premium.featureTeamAnalytics",
        "premium.featureStandardReports",
        "premium.featureEmailSupport",
        "premium.featureUpTo5Projects",
      ],
      highlight: false,
    },
    {
      id: "professional",
      nameKey: "premium.tierProfessional",
      price: "$79",
      periodKey: "premium.periodMonth",
      descriptionKey: "premium.descProfessional",
      featureKeys: [
        "premium.featureEverythingStarter",
        "premium.featureAIInsights",
        "premium.featureAdvancedAnalytics",
        "premium.featurePrioritySupport",
        "premium.featureUnlimitedProjects",
        "premium.featureCustomWorkflows",
        "premium.featureTeamCollaboration",
      ],
      highlight: true,
    },
    {
      id: "enterprise",
      nameKey: "premium.tierEnterprise",
      price: "Custom",
      periodKey: "",
      descriptionKey: "premium.descEnterprise",
      featureKeys: [
        "premium.featureEverythingProfessional",
        "premium.featureDedicatedAI",
        "premium.featureFullAutomation",
        "premium.feature24_7Support",
        "premium.featureCustomIntegrations",
        "premium.featureAdvancedSecurity",
        "premium.featureOnPremise",
        "premium.featureAccountManager",
      ],
      highlight: false,
    },
  ];

  return (
    <section id="premium" className="relative min-h-screen px-6 py-16 md:py-20" aria-label="Premium intelligence">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-2" data-narrate="Premium Intelligence|Automation that feels like a superpower.">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-primary">
              <Sparkles className="h-5 w-5" />
            </span>
            <p className="text-xs font-semibold tracking-wide text-muted-foreground">{t("premium.eyebrow")}</p>
          </div>

          <motion.h2
            className="mt-5 text-balance text-3xl font-semibold leading-tight md:text-4xl"
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            data-narrate="Automation that feels like a superpower|AI intelligence + workflow automation—designed for teams that move fast."
          >
            {t("premium.title")}
          </motion.h2>
          <p className="mt-3 mx-auto max-w-2xl text-pretty text-base text-muted-foreground">
            {t("premium.subtitle")}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {tiers.map((tier, idx) => (
            <motion.div
              key={tier.name}
              className={`glass glass-hover rounded-[2rem] p-6 relative ${tier.highlight ? "neon-outline scale-105" : ""}`}
              initial={reduceMotion ? false : { opacity: 0, y: 30 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              data-narrate={`${t(tier.nameKey)} Plan|${t(tier.descriptionKey)} • ${tier.featureKeys.length} features`}
              whileHover={reduceMotion ? undefined : { y: -8, scale: tier.highlight ? 1.08 : 1.03 }}
            >
              {tier.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <div className="glass gold-outline rounded-full px-3 py-1">
                    <span className="text-xs font-semibold flex items-center gap-1">
                      <Crown className="h-3 w-3" />
                      {t("labels.popular")}
                    </span>
                  </div>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-xl font-bold">{t(tier.nameKey)}</h3>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-4xl font-bold">{tier.price}</span>
                  {tier.periodKey && <span className="text-muted-foreground">{t(tier.periodKey)}</span>}
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{t(tier.descriptionKey)}</p>
              </div>

              <div className="space-y-3">
                {tier.featureKeys.map((featureKey, fIdx) => (
                  <motion.div
                    key={fIdx}
                    className="flex items-start gap-2"
                    initial={reduceMotion ? false : { opacity: 0, x: -10 }}
                    whileInView={reduceMotion ? undefined : { opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.2, delay: idx * 0.1 + fIdx * 0.05 }}
                    data-narrate={`${t(featureKey)}|Included in ${t(tier.nameKey)} plan`}
                  >
                    <Check className="h-4 w-4 mt-0.5 text-neon flex-shrink-0" />
                    <span className="text-sm">{t(featureKey)}</span>
                  </motion.div>
                ))}
              </div>

              <Link to="/payment">
                <motion.button
                  className={`mt-6 w-full rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
                    tier.highlight
                      ? "bg-neon text-neon-foreground hover:bg-neon/90"
                      : "glass glass-hover border border-border"
                  }`}
                  whileHover={reduceMotion ? undefined : { scale: 1.02 }}
                  whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                  data-narrate={`${t("buttons.getStarted")}|Choose ${t(tier.nameKey)} plan`}
                >
                  {t("buttons.getStarted")}
                </motion.button>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-12 glass rounded-[2rem] p-6"
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          data-narrate="Premium Features|Unlock full intelligence, deeper predictions, richer recommendations."
        >
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { icon: <Sparkles className="h-5 w-5" />, titleKey: "premium.unlockIntelligence", descKey: "premium.unlockIntelligenceDesc" },
              { icon: <Layers className="h-5 w-5" />, titleKey: "premium.workflowOrchestration", descKey: "premium.workflowOrchestrationDesc" },
              { icon: <Gauge className="h-5 w-5" />, titleKey: "premium.boostPerformance", descKey: "premium.boostPerformanceDesc" },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                className="text-center"
                initial={reduceMotion ? false : { opacity: 0, scale: 0.9 }}
                whileInView={reduceMotion ? undefined : { opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.3 + idx * 0.1 }}
                data-narrate={`${t(item.titleKey)}|${t(item.descKey)}`}
              >
                <div className="mx-auto mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                  {item.icon}
                </div>
                <h4 className="text-sm font-semibold">{t(item.titleKey)}</h4>
                <p className="mt-1 text-xs text-muted-foreground">{t(item.descKey)}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
