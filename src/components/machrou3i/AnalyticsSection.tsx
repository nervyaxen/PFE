import { motion, useReducedMotion } from "framer-motion";
import { Users, Gauge, Sparkles, TrendingUp, Activity, Target } from "lucide-react";

export default function AnalyticsSection() {
  const reduceMotion = useReducedMotion();

  const heatmapData = Array.from({ length: 7 }, (_, day) =>
    Array.from({ length: 12 }, (_, hour) => ({
      value: Math.random() * 100,
      hour: hour + 8,
      day: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][day],
    }))
  );

  const skills = [
    { name: "Frontend", level: 85, team: 8 },
    { name: "Backend", level: 92, team: 6 },
    { name: "AI/ML", level: 68, team: 3 },
    { name: "DevOps", level: 75, team: 4 },
    { name: "Design", level: 80, team: 5 },
  ];

  const getHeatmapColor = (value: number) => {
    if (value > 70) return "hsl(var(--neon) / 0.6)";
    if (value > 40) return "hsl(var(--gold) / 0.5)";
    return "hsl(var(--muted) / 0.3)";
  };

  return (
    <section id="people" className="relative min-h-screen px-6 py-16 md:py-20" aria-label="People & team analysis">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-2" data-narrate="Team Intelligence|See collaboration the way it actually behaves.">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-primary">
              <Users className="h-5 w-5" />
            </span>
            <p className="text-xs font-semibold tracking-wide text-muted-foreground">People & team analysis</p>
          </div>

          <motion.h2
            className="mt-5 text-balance text-3xl font-semibold leading-tight md:text-4xl"
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            data-narrate="See collaboration the way it actually behaves|Heatmaps, skill graphs, and alignment signals—explained by the cursor narrator."
          >
            See collaboration the way it actually behaves.
          </motion.h2>
          <p className="mt-3 max-w-xl text-pretty text-base text-muted-foreground">
            Heatmaps, skill graphs, and alignment signals—explained by the cursor narrator.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Productivity Heatmap */}
          <div className="glass rounded-[2rem] p-6" data-narrate="Productivity Heatmap|Activity patterns across the week reveal collaboration peaks.">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Activity Heatmap</h3>
              <span className="inline-flex items-center gap-2 text-xs text-muted-foreground">
                <Activity className="h-4 w-4" />
                Weekly view
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex gap-1">
                <div className="w-12 text-xs text-muted-foreground" />
                {Array.from({ length: 12 }, (_, i) => (
                  <div key={i} className="flex-1 text-center text-[10px] text-muted-foreground">
                    {i + 8}h
                  </div>
                ))}
              </div>
              {heatmapData.map((day, dayIdx) => (
                <div key={dayIdx} className="flex gap-1">
                  <div className="w-12 text-xs font-medium">{day[0].day}</div>
                  {day.map((cell, hourIdx) => (
                    <motion.div
                      key={hourIdx}
                      className="flex-1 rounded"
                      style={{
                        backgroundColor: getHeatmapColor(cell.value),
                        height: "24px",
                      }}
                      initial={reduceMotion ? false : { scale: 0 }}
                      whileInView={reduceMotion ? undefined : { scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.2, delay: (dayIdx * 12 + hourIdx) * 0.01 }}
                      data-narrate={`${cell.day} ${cell.hour}:00|Activity level: ${Math.round(cell.value)}%`}
                      whileHover={reduceMotion ? undefined : { scale: 1.2, zIndex: 10 }}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Skill Coverage Graph */}
          <div className="glass rounded-[2rem] p-6" data-narrate="Skill Coverage|Identify gaps before they become blockers.">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Skill Coverage</h3>
              <span className="inline-flex items-center gap-2 text-xs text-muted-foreground">
                <Target className="h-4 w-4" />
                Team capacity
              </span>
            </div>

            <div className="space-y-4">
              {skills.map((skill, idx) => (
                <motion.div
                  key={skill.name}
                  className="space-y-2"
                  initial={reduceMotion ? false : { opacity: 0, x: 20 }}
                  whileInView={reduceMotion ? undefined : { opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: idx * 0.1 }}
                  data-narrate={`${skill.name}|${skill.level}% coverage • ${skill.team} team members`}
                >
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{skill.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">{skill.team} members</span>
                      <span className="font-semibold">{skill.level}%</span>
                    </div>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-surface/60">
                    <motion.div
                      className="h-full rounded-full"
                      style={{
                        background: `linear-gradient(90deg, hsl(var(--neon) / 0.6), hsl(var(--gold) / 0.6))`,
                        width: `${skill.level}%`,
                      }}
                      initial={reduceMotion ? false : { width: 0 }}
                      whileInView={reduceMotion ? undefined : { width: `${skill.level}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: idx * 0.1, ease: "easeOut" }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Velocity Health */}
          <div className="glass rounded-[2rem] p-6" data-narrate="Velocity Health|Spot overload, drift, and under-allocation.">
            <div className="mb-4 flex items-center gap-2">
              <Gauge className="h-5 w-5 text-gold" />
              <h3 className="text-lg font-semibold">Velocity Health</h3>
            </div>

            <div className="space-y-4">
              {[
                { team: "Frontend Team", velocity: 92, trend: "up", load: 78 },
                { team: "Backend Team", velocity: 88, trend: "stable", load: 85 },
                { team: "AI Team", velocity: 75, trend: "up", load: 65 },
              ].map((item, idx) => (
                <motion.div
                  key={item.team}
                  className="rounded-xl bg-surface/40 p-4"
                  initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                  whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: idx * 0.1 }}
                  data-narrate={`${item.team}|Velocity: ${item.velocity} • Load: ${item.load}% • Trend: ${item.trend}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{item.team}</span>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">Velocity</p>
                        <p className="text-sm font-semibold">{item.velocity}</p>
                      </div>
                      <div className="h-12 w-1 rounded-full bg-muted">
                        <motion.div
                          className="h-full w-full rounded-full bg-neon"
                          initial={reduceMotion ? false : { height: 0 }}
                          whileInView={reduceMotion ? undefined : { height: `${item.load}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.6, delay: idx * 0.1 }}
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Collaboration Chart */}
          <div className="glass rounded-[2rem] p-6" data-narrate="Collaboration Patterns|See how teams interact and communicate.">
            <div className="mb-4 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-neon" />
              <h3 className="text-lg font-semibold">Collaboration Patterns</h3>
            </div>

            <div className="space-y-3">
              {[
                { pair: "Frontend ↔ Backend", strength: 95, interactions: 1240 },
                { pair: "AI ↔ Backend", strength: 78, interactions: 890 },
                { pair: "Design ↔ Frontend", strength: 88, interactions: 1020 },
              ].map((item, idx) => (
                <motion.div
                  key={item.pair}
                  className="space-y-2"
                  initial={reduceMotion ? false : { opacity: 0, scale: 0.9 }}
                  whileInView={reduceMotion ? undefined : { opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: idx * 0.1 }}
                  data-narrate={`${item.pair}|Strength: ${item.strength}% • ${item.interactions} interactions this week`}
                >
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{item.pair}</span>
                    <span className="text-xs text-muted-foreground">{item.interactions} interactions</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-surface/60">
                    <motion.div
                      className="h-full rounded-full"
                      style={{
                        background: `linear-gradient(90deg, hsl(var(--neon) / 0.7), hsl(var(--gold) / 0.7))`,
                        width: `${item.strength}%`,
                      }}
                      initial={reduceMotion ? false : { width: 0 }}
                      whileInView={reduceMotion ? undefined : { width: `${item.strength}%` }}
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
