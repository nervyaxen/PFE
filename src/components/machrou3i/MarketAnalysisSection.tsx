import { motion, useReducedMotion } from "framer-motion";
import { TrendingUp, Gauge, Sparkles, DollarSign, BarChart3, LineChart } from "lucide-react";

export default function MarketAnalysisSection() {
  const reduceMotion = useReducedMotion();

  // Simulated chart data
  const roiData = [
    { month: "Jan", value: 45, forecast: 50 },
    { month: "Feb", value: 58, forecast: 62 },
    { month: "Mar", value: 72, forecast: 75 },
    { month: "Apr", value: 68, forecast: 80 },
    { month: "May", value: 85, forecast: 88 },
    { month: "Jun", value: 92, forecast: 95 },
  ];

  const costData = [
    { category: "Development", current: 45000, forecast: 48000 },
    { category: "Infrastructure", current: 12000, forecast: 15000 },
    { category: "Marketing", current: 25000, forecast: 30000 },
    { category: "Operations", current: 18000, forecast: 20000 },
  ];

  const maxROI = Math.max(...roiData.map(d => Math.max(d.value, d.forecast)));

  return (
    <section id="economy" className="relative min-h-screen px-6 py-16 md:py-20" aria-label="Economic & market analysis">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-2" data-narrate="Market Intelligence|Predict costs. Model ROI. Time the market.">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-primary">
              <TrendingUp className="h-5 w-5" />
            </span>
            <p className="text-xs font-semibold tracking-wide text-muted-foreground">Economic & market analysis</p>
          </div>

          <motion.h2
            className="mt-5 text-balance text-3xl font-semibold leading-tight md:text-4xl"
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            data-narrate="Predict costs. Model ROI. Time the market|Forecast panels animate on scroll—like a film cut between dashboards."
          >
            Predict costs. Model ROI. Time the market.
          </motion.h2>
          <p className="mt-3 max-w-xl text-pretty text-base text-muted-foreground">
            Forecast panels animate on scroll—like a film cut between dashboards.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* ROI Forecast Chart */}
          <div className="glass rounded-[2rem] p-6" data-narrate="ROI Forecast|Revenue and cost trajectories with confidence bands.">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">ROI Forecast</h3>
              <span className="inline-flex items-center gap-2 text-xs text-muted-foreground">
                <LineChart className="h-4 w-4" />
                6-month view
              </span>
            </div>

            <div className="space-y-4">
              <div className="relative h-48">
                {roiData.map((point, idx) => (
                  <motion.div
                    key={point.month}
                    className="absolute bottom-0 flex flex-col items-center"
                    style={{ left: `${(idx / (roiData.length - 1)) * 100}%` }}
                    initial={reduceMotion ? false : { opacity: 0, y: 20 }}
                    whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: idx * 0.1 }}
                    data-narrate={`${point.month} ROI|Current: ${point.value}% • Forecast: ${point.forecast}%`}
                  >
                    <div className="relative mb-2 flex items-end gap-1">
                      <motion.div
                        className="w-8 rounded-t"
                        style={{
                          height: `${(point.value / maxROI) * 100}%`,
                          background: "linear-gradient(180deg, hsl(var(--neon) / 0.7), hsl(var(--neon) / 0.4))",
                          minHeight: "8px",
                        }}
                        initial={reduceMotion ? false : { height: 0 }}
                        whileInView={reduceMotion ? undefined : { height: `${(point.value / maxROI) * 100}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: idx * 0.1 }}
                      />
                      <motion.div
                        className="w-8 rounded-t border-2 border-dashed border-gold/60"
                        style={{
                          height: `${(point.forecast / maxROI) * 100}%`,
                          background: "hsl(var(--gold) / 0.2)",
                          minHeight: "8px",
                        }}
                        initial={reduceMotion ? false : { height: 0 }}
                        whileInView={reduceMotion ? undefined : { height: `${(point.forecast / maxROI) * 100}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: idx * 0.1 + 0.2 }}
                      />
                    </div>
                    <span className="text-[10px] text-muted-foreground">{point.month}</span>
                  </motion.div>
                ))}
              </div>
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded bg-neon" />
                  <span>Current</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded border-2 border-dashed border-gold/60 bg-gold/20" />
                  <span>Forecast</span>
                </div>
              </div>
            </div>
          </div>

          {/* Cost Forecasting */}
          <div className="glass rounded-[2rem] p-6" data-narrate="Cost Forecasting|Explore best/base/worst cases in seconds.">
            <div className="mb-4 flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-gold" />
              <h3 className="text-lg font-semibold">Cost Forecasting</h3>
            </div>

            <div className="space-y-4">
              {costData.map((item, idx) => (
                <motion.div
                  key={item.category}
                  className="space-y-2"
                  initial={reduceMotion ? false : { opacity: 0, x: 20 }}
                  whileInView={reduceMotion ? undefined : { opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: idx * 0.1 }}
                  data-narrate={`${item.category}|Current: $${item.current.toLocaleString()} • Forecast: $${item.forecast.toLocaleString()}`}
                >
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{item.category}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground">${item.current.toLocaleString()}</span>
                      <span className="font-semibold text-gold">${item.forecast.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-surface/60">
                    <motion.div
                      className="h-full rounded-full"
                      style={{
                        background: `linear-gradient(90deg, hsl(var(--gold) / 0.6), hsl(var(--neon) / 0.6))`,
                        width: `${(item.forecast / 100000) * 100}%`,
                      }}
                      initial={reduceMotion ? false : { width: 0 }}
                      whileInView={reduceMotion ? undefined : { width: `${(item.forecast / 100000) * 100}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: idx * 0.1 }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Scenario Sliders */}
          <div className="glass rounded-[2rem] p-6" data-narrate="Scenario Analysis|Explore best/base/worst cases in seconds.">
            <div className="mb-4 flex items-center gap-2">
              <Gauge className="h-5 w-5 text-neon" />
              <h3 className="text-lg font-semibold">Scenario Sliders</h3>
            </div>

            <div className="space-y-4">
              {[
                { scenario: "Best Case", probability: 25, revenue: 120000, color: "neon" },
                { scenario: "Base Case", probability: 50, revenue: 95000, color: "gold" },
                { scenario: "Worst Case", probability: 25, revenue: 70000, color: "destructive" },
              ].map((item, idx) => (
                <motion.div
                  key={item.scenario}
                  className="rounded-xl bg-surface/40 p-4"
                  initial={reduceMotion ? false : { opacity: 0, scale: 0.9 }}
                  whileInView={reduceMotion ? undefined : { opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: idx * 0.1 }}
                  data-narrate={`${item.scenario}|Probability: ${item.probability}% • Revenue: $${item.revenue.toLocaleString()}`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold">{item.scenario}</p>
                      <p className="text-xs text-muted-foreground">${item.revenue.toLocaleString()} revenue</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold">{item.probability}%</p>
                      <p className="text-[10px] text-muted-foreground">probability</p>
                    </div>
                  </div>
                  <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-surface/60">
                    <motion.div
                      className="h-full rounded-full"
                      style={{
                        background: `hsl(var(--${item.color}) / 0.6)`,
                        width: `${item.probability}%`,
                      }}
                      initial={reduceMotion ? false : { width: 0 }}
                      whileInView={reduceMotion ? undefined : { width: `${item.probability}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: idx * 0.1 }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* AI Insights */}
          <div className="glass rounded-[2rem] p-6" data-narrate="AI Market Insights|Contextual notes as trends shift.">
            <div className="mb-4 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-neon" />
              <h3 className="text-lg font-semibold">AI Insights</h3>
            </div>

            <div className="space-y-3">
              {[
                { insight: "Market timing favorable", detail: "Q2 2026 shows strong growth signals", confidence: 88 },
                { insight: "Cost optimization opportunity", detail: "Infrastructure costs can be reduced by 15%", confidence: 75 },
                { insight: "Revenue acceleration expected", detail: "Based on current trajectory and market conditions", confidence: 82 },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  className="rounded-xl border border-neon/30 bg-neon/5 p-3"
                  initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                  whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: idx * 0.1 }}
                  data-narrate={`${item.insight}|${item.detail} • Confidence: ${item.confidence}%`}
                >
                  <p className="text-sm font-medium">{item.insight}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{item.detail}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="h-1 flex-1 overflow-hidden rounded-full bg-surface/60">
                      <motion.div
                        className="h-full rounded-full bg-neon"
                        style={{ width: `${item.confidence}%` }}
                        initial={reduceMotion ? false : { width: 0 }}
                        whileInView={reduceMotion ? undefined : { width: `${item.confidence}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: idx * 0.1 + 0.2 }}
                      />
                    </div>
                    <span className="text-[10px] text-muted-foreground">{item.confidence}%</span>
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
