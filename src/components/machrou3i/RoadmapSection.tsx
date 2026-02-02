import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ClipboardList, Sparkles, TrendingUp, Layers, AlertTriangle, Calendar, CheckCircle2 } from "lucide-react";

interface Task {
  id: string;
  title: string;
  status: "pending" | "in-progress" | "completed" | "at-risk";
  deadline: string;
  risk: "low" | "medium" | "high";
}

export default function RoadmapSection() {
  const reduceMotion = useReducedMotion();
  const [tasks, setTasks] = useState<Task[]>([
    { id: "1", title: "AI Model Integration", status: "in-progress", deadline: "2026-02-15", risk: "medium" },
    { id: "2", title: "User Authentication", status: "completed", deadline: "2026-01-20", risk: "low" },
    { id: "3", title: "Dashboard Analytics", status: "pending", deadline: "2026-03-01", risk: "high" },
    { id: "4", title: "Mobile App Beta", status: "pending", deadline: "2026-02-28", risk: "medium" },
    { id: "5", title: "API Documentation", status: "in-progress", deadline: "2026-02-10", risk: "low" },
  ]);

  const [draggedTask, setDraggedTask] = useState<string | null>(null);

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "high": return "hsl(var(--destructive) / 0.3)";
      case "medium": return "hsl(var(--gold) / 0.3)";
      default: return "hsl(var(--neon) / 0.3)";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle2 className="h-4 w-4" />;
      case "in-progress": return <TrendingUp className="h-4 w-4" />;
      case "at-risk": return <AlertTriangle className="h-4 w-4" />;
      default: return <Calendar className="h-4 w-4" />;
    }
  };

  return (
    <section id="roadmaps" className="relative min-h-screen px-6 py-16 md:py-20" aria-label="Project roadmaps">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-2" data-narrate="Roadmap Intelligence|AI predicts next steps, deadlines, and risks dynamically.">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-primary">
              <ClipboardList className="h-5 w-5" />
            </span>
            <p className="text-xs font-semibold tracking-wide text-muted-foreground">Project roadmaps</p>
          </div>

          <motion.h2
            className="mt-5 text-balance text-3xl font-semibold leading-tight md:text-4xl"
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            data-narrate="Drag, drop, and let AI guide the next move|Cinematic planning: milestones, risks, and deadlines—always visible, always fluid."
          >
            Drag, drop, and let AI guide the next move.
          </motion.h2>
          <p className="mt-3 max-w-xl text-pretty text-base text-muted-foreground">
            Cinematic planning: milestones, risks, and deadlines—always visible, always fluid.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Task Board */}
          <div className="glass rounded-[2rem] p-6" data-narrate="Task Board|Drag tasks between lanes to reorganize your roadmap.">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Milestone Lanes</h3>
              <span className="inline-flex items-center gap-2 text-xs text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-neon animate-glow" />
                AI-guided
              </span>
            </div>

            <div className="space-y-3">
              {tasks.map((task, idx) => (
                <motion.div
                  key={task.id}
                  draggable
                  onDragStart={() => setDraggedTask(task.id)}
                  onDragEnd={() => setDraggedTask(null)}
                  className="glass glass-hover rounded-xl p-4 cursor-move"
                  style={{
                    borderLeft: `4px solid ${getRiskColor(task.risk)}`,
                    opacity: draggedTask === task.id ? 0.5 : 1,
                  }}
                  data-narrate={`${task.title}|${task.status} • Risk: ${task.risk} • Deadline: ${task.deadline}`}
                  whileHover={reduceMotion ? undefined : { scale: 1.02, y: -2 }}
                  initial={reduceMotion ? false : { opacity: 0, x: -20 }}
                  whileInView={reduceMotion ? undefined : { opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: idx * 0.1 }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(task.status)}
                        <p className="text-sm font-semibold">{task.title}</p>
                      </div>
                      <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {task.deadline}
                        </span>
                        <span className="flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          {task.risk} risk
                        </span>
                      </div>
                    </div>
                    <div
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: getRiskColor(task.risk) }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* AI Insights Panel */}
          <div className="space-y-6">
            <div className="glass rounded-[2rem] p-6" data-narrate="AI Next Steps|Suggested tasks, sequencing, and dependencies.">
              <div className="mb-4 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-neon" />
                <h3 className="text-lg font-semibold">AI Next Steps</h3>
              </div>
              <div className="space-y-3">
                {[
                  { suggestion: "Consider moving 'Dashboard Analytics' earlier", reason: "High risk, needs buffer time" },
                  { suggestion: "API Documentation can be parallelized", reason: "Low dependency, can start now" },
                  { suggestion: "Mobile App Beta may need more resources", reason: "Medium risk detected" },
                ].map((item, idx) => (
                  <motion.div
                    key={idx}
                    className="rounded-xl border border-neon/30 bg-neon/5 p-3"
                    initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                    whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: idx * 0.1 }}
                    data-narrate={`AI Suggestion|${item.suggestion} - ${item.reason}`}
                  >
                    <p className="text-sm font-medium">{item.suggestion}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{item.reason}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="glass rounded-[2rem] p-6" data-narrate="Risk Signals|Deadline pressure and delivery probability cues.">
              <div className="mb-4 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-gold" />
                <h3 className="text-lg font-semibold">Risk Signals</h3>
              </div>
              <div className="space-y-3">
                {[
                  { metric: "On-time probability", value: "78%", trend: "up" },
                  { metric: "Resource availability", value: "85%", trend: "stable" },
                  { metric: "Critical path health", value: "72%", trend: "down" },
                ].map((item, idx) => (
                  <motion.div
                    key={idx}
                    className="flex items-center justify-between rounded-xl bg-surface/40 p-3"
                    initial={reduceMotion ? false : { opacity: 0, x: 20 }}
                    whileInView={reduceMotion ? undefined : { opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: idx * 0.1 }}
                    data-narrate={`${item.metric}|${item.value} - Trend: ${item.trend}`}
                  >
                    <span className="text-sm">{item.metric}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold">{item.value}</span>
                      <div className={`h-2 w-2 rounded-full ${item.trend === "up" ? "bg-neon" : item.trend === "down" ? "bg-destructive" : "bg-gold"}`} />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
