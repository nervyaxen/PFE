import { motion, useReducedMotion } from "framer-motion";
import { Boxes, TrendingUp, Layers, BarChart3, Target, Zap } from "lucide-react";

export default function ProductAnalysisSection() {
  const reduceMotion = useReducedMotion();

  const competitors = [
    { name: "Competitor A", adoption: 68, retention: 72, activation: 65, score: 68 },
    { name: "Competitor B", adoption: 75, retention: 80, activation: 70, score: 75 },
    { name: "Machrou3i", adoption: 82, retention: 88, activation: 85, score: 85 },
  ];

  const kpis = [
    { name: "User Adoption", value: 82, trend: "up", change: "+12%" },
    { name: "Retention Rate", value: 88, trend: "up", change: "+8%" },
    { name: "Activation Rate", value: 85, trend: "up", change: "+15%" },
    { name: "Feature Usage", value: 76, trend: "stable", change: "+2%" },
  ];

  return (
    <section id="product" className="relative min-h-screen px-6 py-16 md:py-20" aria-label="Product analysis">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-2" data-narrate="Product Intelligence|Benchmark the product—then out-ship everyone.">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-primary">
              <Boxes className="h-5 w-5" />
            </span>
            <p className="text-xs font-semibold tracking-wide text-muted-foreground">Product analysis</p>
          </div>

          <motion.h2
            className="mt-5 text-balance text-3xl font-semibold leading-tight md:text-4xl"
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            data-narrate="Benchmark the product—then out-ship everyone|Competitor metrics, KPIs, and product cards that float with neon edge light."
          >
            Benchmark the product—then out-ship everyone.
          </motion.h2>
          <p className="mt-3 max-w-xl text-pretty text-base text-muted-foreground">
            Competitor metrics, KPIs, and product cards that float with neon edge light.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* KPI Cockpit */}
          <div className="glass rounded-[2rem] p-6" data-narrate="KPI Cockpit|Adoption, retention, and activation in one view.">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">KPI Cockpit</h3>
              <span className="inline-flex items-center gap-2 text-xs text-muted-foreground">
                <Target className="h-4 w-4" />
                Live metrics
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {kpis.map((kpi, idx) => (
                <motion.div
                  key={kpi.name}
                  className="glass glass-hover rounded-xl p-4"
                  initial={reduceMotion ? false : { opacity: 0, scale: 0.9 }}
                  whileInView={reduceMotion ? undefined : { opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: idx * 0.1 }}
                  data-narrate={`${kpi.name}|${kpi.value}% • ${kpi.change} • Trend: ${kpi.trend}`}
                  whileHover={reduceMotion ? undefined : { y: -4 }}
                >
                  <p className="text-xs text-muted-foreground">{kpi.name}</p>
                  <div className="mt-2 flex items-baseline gap-2">
                    <p className="text-2xl font-bold">{kpi.value}%</p>
                    <span className={`text-xs ${kpi.trend === "up" ? "text-neon" : kpi.trend === "down" ? "text-destructive" : "text-gold"}`}>
                      {kpi.change}
                    </span>
                  </div>
                  <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-surface/60">
                    <motion.div
                      className="h-full rounded-full"
                      style={{
                        background: `linear-gradient(90deg, hsl(var(--neon) / 0.7), hsl(var(--gold) / 0.7))`,
                        width: `${kpi.value}%`,
                      }}
                      initial={reduceMotion ? false : { width: 0 }}
                      whileInView={reduceMotion ? undefined : { width: `${kpi.value}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: idx * 0.1 }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Competitive Deltas */}
          <div className="glass rounded-[2rem] p-6" data-narrate="Competitive Analysis|Understand where you win—and why.">
            <div className="mb-4 flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-gold" />
              <h3 className="text-lg font-semibold">Competitive Deltas</h3>
            </div>

            <div className="space-y-3">
              {competitors.map((comp, idx) => (
                <motion.div
                  key={comp.name}
                  className={`glass glass-hover rounded-xl p-4 ${comp.name === "Machrou3i" ? "neon-outline" : ""}`}
                  initial={reduceMotion ? false : { opacity: 0, x: 20 }}
                  whileInView={reduceMotion ? undefined : { opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: idx * 0.1 }}
                  data-narrate={`${comp.name}|Adoption: ${comp.adoption}% • Retention: ${comp.retention}% • Activation: ${comp.activation}%`}
                  whileHover={reduceMotion ? undefined : { scale: 1.02, y: -2 }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold">{comp.name}</p>
                      <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                        <span>Adopt: {comp.adoption}%</span>
                        <span>Retain: {comp.retention}%</span>
                        <span>Activate: {comp.activation}%</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">{comp.score}</p>
                      <p className="text-[10px] text-muted-foreground">score</p>
                    </div>
                  </div>
                  <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-surface/60">
                    <motion.div
                      className="h-full rounded-full"
                      style={{
                        background: comp.name === "Machrou3i" 
                          ? `linear-gradient(90deg, hsl(var(--neon) / 0.8), hsl(var(--gold) / 0.8))`
                          : `hsl(var(--muted) / 0.5)`,
                        width: `${comp.score}%`,
                      }}
                      initial={reduceMotion ? false : { width: 0 }}
                      whileInView={reduceMotion ? undefined : { width: `${comp.score}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: idx * 0.1 }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Product Lanes */}
          <div className="glass rounded-[2rem] p-6 md:col-span-2" data-narrate="Product Lanes|Map features across versions and platforms.">
            <div className="mb-4 flex items-center gap-2">
              <Layers className="h-5 w-5 text-neon" />
              <h3 className="text-lg font-semibold">Product Lanes</h3>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {[
                { version: "v2.0", features: ["AI Insights", "Advanced Analytics", "Workflow Automation"], progress: 85 },
                { version: "v1.5", features: ["Dashboard", "Team Analytics", "Basic Reports"], progress: 100 },
                { version: "v1.0", features: ["Core PM", "Task Management", "Basic Auth"], progress: 100 },
              ].map((lane, idx) => (
                <motion.div
                  key={lane.version}
                  className="glass glass-hover rounded-xl p-4"
                  initial={reduceMotion ? false : { opacity: 0, y: 20 }}
                  whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: idx * 0.1 }}
                  data-narrate={`${lane.version}|${lane.features.length} features • Progress: ${lane.progress}%`}
                  whileHover={reduceMotion ? undefined : { y: -4 }}
                >
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-sm font-semibold">{lane.version}</p>
                    <span className="text-xs text-muted-foreground">{lane.progress}%</span>
                  </div>
                  <div className="space-y-2">
                    {lane.features.map((feature, fIdx) => (
                      <div key={fIdx} className="flex items-center gap-2 text-xs">
                        <div className={`h-1.5 w-1.5 rounded-full ${lane.progress === 100 ? "bg-neon" : "bg-gold"}`} />
                        <span className="text-muted-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-surface/60">
                    <motion.div
                      className="h-full rounded-full"
                      style={{
                        background: `linear-gradient(90deg, hsl(var(--neon) / 0.7), hsl(var(--gold) / 0.7))`,
                        width: `${lane.progress}%`,
                      }}
                      initial={reduceMotion ? false : { width: 0 }}
                      whileInView={reduceMotion ? undefined : { width: `${lane.progress}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: idx * 0.1 }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
