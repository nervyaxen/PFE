import { motion, useReducedMotion } from "framer-motion";
import { Sparkles, AlertTriangle, TrendingUp, Target, Zap, Brain } from "lucide-react";

export default function AIInsightsSection() {
  const reduceMotion = useReducedMotion();

  const riskPredictions = [
    { project: "Project Alpha", risk: "high", probability: 78, reason: "Resource constraints detected", deadline: "2026-02-15" },
    { project: "Project Beta", risk: "medium", probability: 45, reason: "Timeline pressure increasing", deadline: "2026-03-01" },
    { project: "Project Gamma", risk: "low", probability: 22, reason: "On track with buffer", deadline: "2026-02-28" },
  ];

  const marketInsights = [
    { insight: "Market demand increasing", confidence: 92, impact: "high", trend: "up" },
    { insight: "Competitor activity detected", confidence: 75, impact: "medium", trend: "stable" },
    { insight: "Technology shift opportunity", confidence: 88, impact: "high", trend: "up" },
  ];

  const productRecommendations = [
    { recommendation: "Prioritize mobile features", reason: "User feedback indicates high demand", priority: "high" },
    { recommendation: "Enhance AI accuracy", reason: "Current model shows 15% improvement potential", priority: "medium" },
    { recommendation: "Expand integration options", reason: "Market analysis suggests API-first approach", priority: "high" },
  ];

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "high": return "hsl(var(--destructive) / 0.3)";
      case "medium": return "hsl(var(--gold) / 0.3)";
      default: return "hsl(var(--neon) / 0.3)";
    }
  };

  return (
    <section id="ai-insights" className="relative min-h-screen px-6 py-16 md:py-20" aria-label="AI-powered insights">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-2" data-narrate="AI Intelligence|Risk prediction for projects and milestones.">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-primary">
              <Brain className="h-5 w-5" />
            </span>
            <p className="text-xs font-semibold tracking-wide text-muted-foreground">AI-powered insights</p>
          </div>

          <motion.h2
            className="mt-5 text-balance text-3xl font-semibold leading-tight md:text-4xl"
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            data-narrate="AI-Powered Intelligence|Risk prediction, economic viability, market trends, and product analysis—explained dynamically."
          >
            AI-Powered Intelligence
          </motion.h2>
          <p className="mt-3 max-w-xl text-pretty text-base text-muted-foreground">
            Risk prediction, economic viability, market trends, and product analysis—explained dynamically.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Risk Predictions */}
          <div className="glass rounded-[2rem] p-6" data-narrate="Risk Predictions|AI predicts project risks and suggests mitigation strategies.">
            <div className="mb-4 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <h3 className="text-lg font-semibold">Risk Predictions</h3>
            </div>

            <div className="space-y-3">
              {riskPredictions.map((prediction, idx) => (
                <motion.div
                  key={prediction.project}
                  className="glass glass-hover rounded-xl p-4"
                  style={{ borderLeft: `4px solid ${getRiskColor(prediction.risk)}` }}
                  initial={reduceMotion ? false : { opacity: 0, x: -20 }}
                  whileInView={reduceMotion ? undefined : { opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: idx * 0.1 }}
                  data-narrate={`${prediction.project}|Risk: ${prediction.risk} • Probability: ${prediction.probability}% • ${prediction.reason}`}
                  whileHover={reduceMotion ? undefined : { y: -2, scale: 1.02 }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-semibold">{prediction.project}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{prediction.reason}</p>
                      <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                        <span>Deadline: {prediction.deadline}</span>
                        <span className="capitalize">Risk: {prediction.risk}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">{prediction.probability}%</p>
                      <p className="text-[10px] text-muted-foreground">probability</p>
                    </div>
                  </div>
                  <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-surface/60">
                    <motion.div
                      className="h-full rounded-full"
                      style={{
                        background: getRiskColor(prediction.risk),
                        width: `${prediction.probability}%`,
                      }}
                      initial={reduceMotion ? false : { width: 0 }}
                      whileInView={reduceMotion ? undefined : { width: `${prediction.probability}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: idx * 0.1 }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Market Trends */}
          <div className="glass rounded-[2rem] p-6" data-narrate="Market Trends|Economic viability and market predictions.">
            <div className="mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-gold" />
              <h3 className="text-lg font-semibold">Market Trends</h3>
            </div>

            <div className="space-y-3">
              {marketInsights.map((insight, idx) => (
                <motion.div
                  key={idx}
                  className="glass glass-hover rounded-xl p-4"
                  initial={reduceMotion ? false : { opacity: 0, x: 20 }}
                  whileInView={reduceMotion ? undefined : { opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: idx * 0.1 }}
                  data-narrate={`${insight.insight}|Confidence: ${insight.confidence}% • Impact: ${insight.impact} • Trend: ${insight.trend}`}
                  whileHover={reduceMotion ? undefined : { y: -2, scale: 1.02 }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-semibold">{insight.insight}</p>
                      <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="capitalize">Impact: {insight.impact}</span>
                        <span className="capitalize">Trend: {insight.trend}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">{insight.confidence}%</p>
                      <p className="text-[10px] text-muted-foreground">confidence</p>
                    </div>
                  </div>
                  <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-surface/60">
                    <motion.div
                      className="h-full rounded-full"
                      style={{
                        background: `linear-gradient(90deg, hsl(var(--gold) / 0.7), hsl(var(--neon) / 0.7))`,
                        width: `${insight.confidence}%`,
                      }}
                      initial={reduceMotion ? false : { width: 0 }}
                      whileInView={reduceMotion ? undefined : { width: `${insight.confidence}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: idx * 0.1 }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Product Recommendations */}
          <div className="glass rounded-[2rem] p-6 md:col-span-2" data-narrate="Product Recommendations|AI suggests product improvements based on analysis.">
            <div className="mb-4 flex items-center gap-2">
              <Zap className="h-5 w-5 text-neon" />
              <h3 className="text-lg font-semibold">Product Recommendations</h3>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {productRecommendations.map((rec, idx) => (
                <motion.div
                  key={idx}
                  className="glass glass-hover rounded-xl p-4"
                  initial={reduceMotion ? false : { opacity: 0, y: 20 }}
                  whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: idx * 0.1 }}
                  data-narrate={`${rec.recommendation}|${rec.reason} • Priority: ${rec.priority}`}
                  whileHover={reduceMotion ? undefined : { y: -4 }}
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span className={`text-xs font-semibold capitalize ${
                      rec.priority === "high" ? "text-destructive" : "text-gold"
                    }`}>
                      {rec.priority} priority
                    </span>
                    <Sparkles className="h-4 w-4 text-neon" />
                  </div>
                  <p className="text-sm font-semibold">{rec.recommendation}</p>
                  <p className="mt-2 text-xs text-muted-foreground">{rec.reason}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <motion.div
          className="mt-6 glass rounded-[2rem] p-6 text-center"
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          data-narrate="AI Core|Panels float and glow as user scrolls—AI recommendations explained dynamically on hover."
        >
          <Brain className="mx-auto mb-3 h-12 w-12 text-neon" />
          <p className="text-sm font-semibold">AI recommendations explained dynamically on hover</p>
          <p className="mt-1 text-xs text-muted-foreground">Panels float and glow as you scroll</p>
        </motion.div>
      </div>
    </section>
  );
}
