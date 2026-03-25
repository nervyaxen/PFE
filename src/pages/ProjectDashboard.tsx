import { useEffect, useState, useMemo, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate, useParams } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft, Target, Users, AlertTriangle, Activity, Zap,
  TrendingUp, ShieldAlert, Cpu, Briefcase, DollarSign, Loader2, RefreshCw
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  BarChart, Bar
} from "recharts";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/i18n";
import { findProjectById } from "@/lib/ai-guided-project";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

/* ---------- types ---------- */
interface RiskData { technical: number; market: number; financial: number; operational: number; security: number; summary?: string }
interface GrowthRow { month: string; users: number; revenue: number; costs?: number }
interface Milestone { id: string; phase: number; title: string; description: string; suggestedTimeline: string }

/* ---------- component ---------- */
export default function ProjectDashboard() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { t } = useI18n();
  const reduceMotion = useReducedMotion();

  // Local project data (from the old system)
  const localProject = findProjectById(projectId === "prj_1" ? "demo" : projectId);

  // State for dynamic AI data
  const [roadmap, setRoadmap] = useState<{ summary: string; milestones: Milestone[] } | null>(null);
  const [risk, setRisk] = useState<RiskData | null>(null);
  const [financial, setFinancial] = useState<{ growthData: GrowthRow[]; breakEvenMonth?: number; roi6Month?: number; summary?: string } | null>(null);
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const setLoadingFor = (key: string, val: boolean) => setLoading(prev => ({ ...prev, [key]: val }));
  const setErrorFor = (key: string, msg: string) => setErrors(prev => ({ ...prev, [key]: msg }));

  // Fetch an insight from the backend
  const fetchInsight = useCallback(async (type: string) => {
    setLoadingFor(type, true);
    setErrorFor(type, "");
    try {
      const res = await fetch(`${API}/projects/${projectId}/insights`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ analysisType: type }),
      });
      const data = await res.json();
      if (!res.ok || data.fallback) {
        setErrorFor(type, data.error || "AI could not generate the requested insight at the moment. Please try again.");
        return null;
      }
      return data.content;
    } catch {
      setErrorFor(type, "AI could not generate the requested insight at the moment. Please try again.");
      return null;
    } finally {
      setLoadingFor(type, false);
    }
  }, [projectId]);

  // Initial data load from local data + sessionStorage
  useEffect(() => {
    // Try local project data first
    if (localProject?.roadmap) {
      setRoadmap(localProject.roadmap);
    }
    // Try sessionStorage
    const cached = sessionStorage.getItem(`machrou3i-ai-result-${projectId}`);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (parsed.roadmap) setRoadmap(parsed.roadmap);
        if (parsed.riskAnalysis) setRisk(parsed.riskAnalysis);
        if (parsed.marketInsights) setFinancial({ growthData: parsed.marketInsights.growthData, summary: "" });
      } catch { /* use fallback */ }
    }

    // Fallback defaults if nothing loaded
    if (!roadmap && !localProject?.roadmap) {
      setRoadmap({
        summary: "AI-generated strategic roadmap pending. Click 'Generate' to query AI insights.",
        milestones: [
          { id: "m1", phase: 1, title: "Foundation & MVP", description: "Build core infrastructure and develop minimum viable product.", suggestedTimeline: "Month 1-2" },
          { id: "m2", phase: 2, title: "Beta Launch", description: "Launch beta, collect user feedback, and iterate on core features.", suggestedTimeline: "Month 3-4" },
          { id: "m3", phase: 3, title: "Scale & Growth", description: "Implement revenue model and scale to new markets.", suggestedTimeline: "Month 5-6" },
        ],
      });
    }
    if (!risk) {
      setRisk({ technical: 65, market: 55, financial: 45, operational: 50, security: 80 });
    }
    if (!financial) {
      setFinancial({
        growthData: [
          { month: "M1", users: 100, revenue: 0, costs: 8000 },
          { month: "M2", users: 500, revenue: 2000, costs: 12000 },
          { month: "M3", users: 2000, revenue: 8000, costs: 15000 },
          { month: "M4", users: 6000, revenue: 22000, costs: 18000 },
          { month: "M5", users: 14000, revenue: 50000, costs: 22000 },
          { month: "M6", users: 28000, revenue: 95000, costs: 28000 },
        ],
        breakEvenMonth: 3,
        roi6Month: 220,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  const riskChartData = useMemo(() => {
    if (!risk) return [];
    return [
      { subject: "Technical", A: risk.technical, fullMark: 100 },
      { subject: "Market", A: risk.market, fullMark: 100 },
      { subject: "Financial", A: risk.financial, fullMark: 100 },
      { subject: "Operational", A: risk.operational, fullMark: 100 },
      { subject: "Security", A: risk.security, fullMark: 100 },
    ];
  }, [risk]);

  const projectTitle = localProject?.step1?.name || "Project Intelligence";
  const projectDesc = localProject?.step1?.shortDescription || "Full AI-powered analytics and strategic overview.";

  const GenButton = ({ type, label }: { type: string; label: string }) => (
    <Button
      size="sm"
      variant="outline"
      disabled={loading[type]}
      className="glass border-neon/30 text-neon hover:bg-neon/10 text-xs"
      onClick={async () => {
        const result = await fetchInsight(type);
        if (result) {
          if (type === "roadmap") setRoadmap(result);
          else if (type === "risk") setRisk(result);
          else if (type === "financial") setFinancial(result);
        }
      }}
    >
      {loading[type] ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : <RefreshCw className="w-3 h-3 mr-1" />}
      {label}
    </Button>
  );

  return (
    <div className="relative min-h-screen pt-24 px-6 z-10 pb-20">
      <Helmet>
        <title>{projectTitle} – Machrou3i</title>
        <meta name="description" content={projectDesc} />
      </Helmet>

      {/* Parallax Background */}
      <div className="absolute inset-0 opacity-25 pointer-events-none mix-blend-screen"
        style={{ background: "radial-gradient(circle at 15% 25%, hsl(var(--neon)/0.2), transparent 45%), radial-gradient(circle at 85% 75%, hsl(var(--gold)/0.15), transparent 45%)" }}
      />

      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <motion.header
          initial={reduceMotion ? false : { opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
        >
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="glass rounded-xl" onClick={() => navigate("/workspace")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 mb-2 border-neon/30">
                <span className="h-2 w-2 rounded-full bg-neon animate-pulse" />
                <p className="text-[11px] font-bold tracking-widest uppercase text-neon">Active Intelligence Node</p>
              </div>
              <h1 className="text-3xl md:text-5xl font-bold tracking-tight">{projectTitle}</h1>
              <p className="mt-2 text-sm text-muted-foreground max-w-2xl">{projectDesc}</p>
            </div>
          </div>
          <div className="glass px-6 py-3 rounded-2xl border-neon/30 border shadow-[0_0_20px_-5px_hsl(var(--neon)/0.4)] text-center">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">AI Confidence</p>
            <p className="text-3xl font-bold text-neon glow-text">
              {((risk?.technical || 65) + (risk?.market || 55) + (risk?.security || 80)) / 3 > 60 ? "High" : "Medium"}
            </p>
          </div>
        </motion.header>

        {/* ─── AI Analytics Grid ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Market Trajectory — 2 cols */}
          <motion.div
            initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-2 cinematic-panel glass glass-hover rounded-[2rem] p-6 flex flex-col h-[420px] relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-primary/20 text-primary"><TrendingUp className="w-5 h-5" /></div>
                <div>
                  <h3 className="text-lg font-semibold">Market Trajectory</h3>
                  <p className="text-xs text-muted-foreground">AI forecasted 6-month growth projection</p>
                </div>
              </div>
              <GenButton type="financial" label="Regenerate" />
            </div>
            {errors.financial ? (
              <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground italic">{errors.financial}</div>
            ) : (
              <div className="flex-1 relative z-10">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={financial?.growthData || []}>
                    <defs>
                      <linearGradient id="colorU" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--neon))" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="hsl(var(--neon))" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorR" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--gold))" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="hsl(var(--gold))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border)/0.2)" vertical={false} />
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: "hsl(var(--background)/0.9)", borderColor: "hsl(var(--border))", borderRadius: "12px" }} />
                    <Area type="monotone" dataKey="users" name="Users" stroke="hsl(var(--neon))" strokeWidth={2.5} fillOpacity={1} fill="url(#colorU)" />
                    <Area type="monotone" dataKey="revenue" name="Revenue $" stroke="hsl(var(--gold))" strokeWidth={2.5} fillOpacity={1} fill="url(#colorR)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </motion.div>

          {/* Risk Radar — 1 col */}
          <motion.div
            initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
            className="cinematic-panel glass glass-hover rounded-[2rem] p-6 flex flex-col h-[420px]"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-destructive/20 text-destructive"><ShieldAlert className="w-5 h-5" /></div>
                <h3 className="text-lg font-semibold">Risk Analysis</h3>
              </div>
              <GenButton type="risk" label="Refresh" />
            </div>
            {errors.risk ? (
              <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground italic">{errors.risk}</div>
            ) : (
              <div className="flex-1">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={riskChartData}>
                    <PolarGrid stroke="hsl(var(--border)/0.4)" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                    <PolarRadiusAxis tick={false} axisLine={false} />
                    <Radar name="Risk Level" dataKey="A" stroke="hsl(var(--destructive))" fill="hsl(var(--destructive))" fillOpacity={0.3} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            )}
          </motion.div>
        </div>

        {/* ─── KPI Bar Row ─── */}
        {financial?.growthData && (
          <motion.div
            initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {[
              { icon: <Users className="w-5 h-5" />, label: "Projected Users (M6)", value: financial.growthData[financial.growthData.length - 1]?.users?.toLocaleString() || "–", color: "neon" },
              { icon: <DollarSign className="w-5 h-5" />, label: "Revenue (M6)", value: `$${(financial.growthData[financial.growthData.length - 1]?.revenue || 0).toLocaleString()}`, color: "gold" },
              { icon: <Activity className="w-5 h-5" />, label: "Break-Even", value: financial.breakEvenMonth ? `Month ${financial.breakEvenMonth}` : "M3", color: "primary" },
              { icon: <Zap className="w-5 h-5" />, label: "6-Month ROI", value: financial.roi6Month ? `${financial.roi6Month}%` : "–", color: "neon" },
            ].map((kpi) => (
              <div key={kpi.label} className="glass floating-panel rounded-2xl p-5 border border-border/40">
                <div className="flex items-center gap-3 mb-3">
                  <span className={`p-2 rounded-xl bg-${kpi.color}/10 text-${kpi.color}`}>{kpi.icon}</span>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">{kpi.label}</p>
                </div>
                <p className={`text-2xl font-bold text-${kpi.color} glow-text`}>{kpi.value}</p>
              </div>
            ))}
          </motion.div>
        )}

        {/* ─── AI Roadmap ─── */}
        <motion.div
          initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="cinematic-panel glass rounded-[2rem] p-6 md:p-10"
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gold/20 text-gold shadow-[0_0_15px_-2px_hsl(var(--gold)/0.4)]">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-2xl font-semibold">AI Generated Roadmap</h3>
                <p className="text-sm text-muted-foreground">{roadmap?.summary || "Strategic execution path."}</p>
              </div>
            </div>
            <GenButton type="roadmap" label="Regenerate" />
          </div>

          {errors.roadmap ? (
            <div className="text-center py-12 text-muted-foreground italic">{errors.roadmap}</div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {(roadmap?.milestones || []).map((m, i) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="glass glass-hover p-5 rounded-2xl relative overflow-hidden group"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Briefcase className="w-16 h-16" />
                  </div>
                  <div className="mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gold px-2 py-1 rounded-md bg-gold/10 inline-block mb-2">
                      Phase {m.phase}
                    </span>
                    <h4 className="text-lg font-semibold">{m.title}</h4>
                  </div>
                  <p className="text-sm text-muted-foreground mb-6 line-clamp-3">{m.description}</p>
                  <span className="absolute bottom-5 left-5 text-xs font-medium text-neon">{m.suggestedTimeline}</span>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* ─── Revenue vs Costs Bar Chart ─── */}
        {financial?.growthData?.[0]?.costs !== undefined && (
          <motion.div
            initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="cinematic-panel glass glass-hover rounded-[2rem] p-6 h-[350px] flex flex-col"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-xl bg-gold/20 text-gold"><DollarSign className="w-5 h-5" /></div>
              <div>
                <h3 className="text-lg font-semibold">Revenue vs Costs</h3>
                <p className="text-xs text-muted-foreground">Monthly financial breakdown</p>
              </div>
            </div>
            <div className="flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={financial.growthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border)/0.2)" vertical={false} />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: "hsl(var(--background)/0.9)", borderColor: "hsl(var(--border))", borderRadius: "12px" }} />
                  <Bar dataKey="revenue" name="Revenue" fill="hsl(var(--neon))" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="costs" name="Costs" fill="hsl(var(--destructive)/0.6)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
