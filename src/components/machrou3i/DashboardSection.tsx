import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Gauge, ClipboardList, Sparkles, TrendingUp, Users, AlertTriangle, Activity, Target } from "lucide-react";
import { useI18n } from "@/i18n";

interface Widget {
  id: string;
  titleKey: string;
  value: string;
  change: string;
  trend: "up" | "down" | "stable";
  icon: React.ReactNode;
}

export default function DashboardSection() {
  const reduceMotion = useReducedMotion();
  const { t } = useI18n();
  const [widgets, setWidgets] = useState<Widget[]>([
    { id: "1", titleKey: "dashboard.activeProjects", value: "24", change: "+12%", trend: "up", icon: <ClipboardList className="h-5 w-5" /> },
    { id: "2", titleKey: "dashboard.teamMembers", value: "48", change: "+5", trend: "up", icon: <Users className="h-5 w-5" /> },
    { id: "3", titleKey: "dashboard.completionRate", value: "87%", change: "+4%", trend: "up", icon: <Target className="h-5 w-5" /> },
    { id: "4", titleKey: "dashboard.riskAlerts", value: "3", change: "-2", trend: "down", icon: <AlertTriangle className="h-5 w-5" /> },
    { id: "5", titleKey: "dashboard.velocity", value: "92", change: "+8%", trend: "up", icon: <Activity className="h-5 w-5" /> },
    { id: "6", titleKey: "dashboard.aiInsights", value: "15", change: "+3", trend: "up", icon: <Sparkles className="h-5 w-5" /> },
  ]);

  const [draggedWidget, setDraggedWidget] = useState<string | null>(null);

  return (
    <section id="dashboard" className="relative min-h-screen px-6 py-16 md:py-20" aria-label="Dashboard preview">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-2" data-narrate="Dashboard Preview|KPIs that feel alive—because the work is.">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-primary">
              <Gauge className="h-5 w-5" />
            </span>
            <p className="text-xs font-semibold tracking-wide text-muted-foreground">{t("dashboard.eyebrow")}</p>
          </div>

          <motion.h2
            className="mt-5 text-balance text-3xl font-semibold leading-tight md:text-4xl"
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            data-narrate="KPIs that feel alive—because the work is|Live panels, charts, and drag interactions—presented as a cinematic preview."
          >
            {t("dashboard.title")}
          </motion.h2>
          <p className="mt-3 max-w-xl text-pretty text-base text-muted-foreground">
            {t("dashboard.subtitle")}
          </p>
        </div>

        {/* Widget Grid */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {widgets.map((widget, idx) => (
            <motion.div
              key={widget.id}
              draggable
              onDragStart={() => setDraggedWidget(widget.id)}
              onDragEnd={() => setDraggedWidget(null)}
              className="glass glass-hover rounded-xl p-6 cursor-move"
              initial={reduceMotion ? false : { opacity: 0, scale: 0.9 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: idx * 0.1 }}
              whileHover={reduceMotion ? undefined : { y: -4, scale: 1.02 }}
              style={{ opacity: draggedWidget === widget.id ? 0.5 : 1 }}
              data-narrate={`${widget.title}|${widget.value} • ${widget.change} • Trend: ${widget.trend}`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">{t(widget.titleKey)}</p>
                  <div className="mt-2 flex items-baseline gap-2">
                    <p className="text-3xl font-bold">{widget.value}</p>
                    <span className={`text-sm ${
                      widget.trend === "up" ? "text-neon" : widget.trend === "down" ? "text-destructive" : "text-gold"
                    }`}>
                      {widget.change}
                    </span>
                  </div>
                </div>
                <div className="rounded-xl bg-primary/20 p-2 text-primary-foreground">
                  {widget.icon}
                </div>
              </div>
              <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-surface/60">
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    background: `linear-gradient(90deg, hsl(var(--neon) / 0.7), hsl(var(--gold) / 0.7))`,
                    width: `${Math.min(parseInt(widget.value) || 0, 100)}%`,
                  }}
                  initial={reduceMotion ? false : { width: 0 }}
                  whileInView={reduceMotion ? undefined : { width: `${Math.min(parseInt(widget.value) || 0, 100)}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: idx * 0.1 }}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {/* Activity Chart */}
          <div className="glass rounded-[2rem] p-6" data-narrate="Activity Trends|Visualize team activity over time.">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">{t("dashboard.activityTrends")}</h3>
              <span className="inline-flex items-center gap-2 text-xs text-muted-foreground">
                <Activity className="h-4 w-4" />
                {t("dashboard.last7Days")}
              </span>
            </div>

            <div className="relative h-48">
              {Array.from({ length: 7 }, (_, i) => {
                const value = Math.random() * 100;
                return (
                  <motion.div
                    key={i}
                    className="absolute bottom-0 flex flex-col items-center"
                    style={{ left: `${(i / 6) * 100}%` }}
                    initial={reduceMotion ? false : { opacity: 0, scaleY: 0 }}
                    whileInView={reduceMotion ? undefined : { opacity: 1, scaleY: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                    data-narrate={`Day ${i + 1}|Activity: ${Math.round(value)}%`}
                  >
                    <motion.div
                      className="w-8 rounded-t"
                      style={{
                        height: `${value}%`,
                        background: "linear-gradient(180deg, hsl(var(--neon) / 0.7), hsl(var(--neon) / 0.3))",
                        minHeight: "8px",
                      }}
                      initial={reduceMotion ? false : { height: 0 }}
                      whileInView={reduceMotion ? undefined : { height: `${value}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: i * 0.1 }}
                    />
                    <span className="mt-1 text-[10px] text-muted-foreground">D{i + 1}</span>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Recent Insights */}
          <div className="glass rounded-[2rem] p-6" data-narrate="Recent Insights|AI-generated insights and recommendations.">
            <div className="mb-4 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-neon" />
              <h3 className="text-lg font-semibold">{t("dashboard.recentInsights")}</h3>
            </div>

            <div className="space-y-3">
              {[
                { insightKey: "dashboard.insight1", type: "positive", time: "2h ago" },
                { insightKey: "dashboard.insight2", type: "positive", time: "5h ago" },
                { insightKey: "dashboard.insight3", type: "warning", time: "1d ago" },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  className="glass glass-hover rounded-xl p-3"
                  initial={reduceMotion ? false : { opacity: 0, x: 20 }}
                  whileInView={reduceMotion ? undefined : { opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: idx * 0.1 }}
                  data-narrate={`${t(item.insightKey)}|${item.type} • ${item.time}`}
                  whileHover={reduceMotion ? undefined : { x: 4 }}
                >
                  <div className="flex items-start gap-3">
                    <div className={`mt-0.5 h-2 w-2 rounded-full ${
                      item.type === "positive" ? "bg-neon animate-glow" : "bg-gold"
                    }`} />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{t(item.insightKey)}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{item.time}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <motion.p
          className="mt-6 text-center text-xs text-muted-foreground"
          initial={reduceMotion ? false : { opacity: 0 }}
          whileInView={reduceMotion ? undefined : { opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          data-narrate="Tip|Cursor over a widget to reveal its purpose."
        >
          {t("dashboard.tip")}
        </motion.p>
      </div>
    </section>
  );
}
