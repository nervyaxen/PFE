/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { generateEnterpriseAnalysis } from "@/lib/geminiService";
import { localDB } from "@/lib/supabaseClient";
import { jsPDF } from "jspdf";
import {
  Sparkles,
  Building,
  Users,
  Target,
  AlertCircle,
  TrendingUp,
  Download,
  History,
  CheckCircle,
  Plus,
  Loader2,
  HelpCircle,
  ChevronRight,
  TrendingDown,
  Info
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from "recharts";
import { toast } from "@/hooks/use-toast";

export default function Enterprise() {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const isRtl = i18n.dir() === "rtl";

  const [form, setForm] = useState({
    name: "",
    industry: "",
    teamSize: "5",
    goal: "",
    challenge: ""
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [historyList, setHistoryList] = useState<any[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    if (user) {
      localDB.getEnterpriseAnalyses(user.id).then((data) => {
        setHistoryList(data);
      });
    }
  }, [user]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.industry || !form.goal || !form.challenge) {
      toast({
        title: "Missing Fields",
        description: "Please fill out all enterprise characteristics.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const data = await generateEnterpriseAnalysis({
        name: form.name,
        industry: form.industry,
        teamSize: form.teamSize,
        goal: form.goal,
        challenge: form.challenge,
        lang: i18n.language
      });

      if (user) {
        const saved = await localDB.saveEnterpriseAnalysis(user.id, {
          input: form,
          output: data
        });
        setHistoryList((prev) => [saved, ...prev]);
        await localDB.logUserAction(user.id, "generate_enterprise_analysis", { name: form.name });
      }

      setResult(data);
      toast({
        title: "Analysis Ready!",
        description: "AI has successfully generated your enterprise roadmap."
      });
    } catch (err) {
      console.error(err);
      toast({
        title: "Consultation Failed",
        description: "Gemini experienced an oversight. Using default fallback.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSelectHistory = (item: any) => {
    setForm(item.input);
    setResult(item.output);
    setShowHistory(false);
    toast({
      title: "History Loaded",
      description: `Viewing ${item.input.name} workspace details.`
    });
  };

  const handleExportPDF = () => {
    if (!result) return;
    try {
      const doc = new jsPDF({ unit: "pt", format: "a4" });
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 40;
      let y = 60;

      const addText = (text: string, options?: { size?: number; style?: "normal" | "bold" }) => {
        if (options?.size) doc.setFontSize(options.size);
        doc.setFont("helvetica", options?.style === "bold" ? "bold" : "normal");
        const lines = doc.splitTextToSize(text, pageWidth - margin * 2);
        doc.text(lines, margin, y);
        y += lines.length * (options?.size ? options.size * 1.3 : 14) + 10;
        if (y > doc.internal.pageSize.getHeight() - margin) {
          doc.addPage();
          y = margin;
        }
      };

      addText(result.executiveSummary || "ENTERPRISE INTELLIGENCE ANALYSIS", { size: 18, style: "bold" });
      addText(`Enterprise: ${form.name}`);
      addText(`Industry: ${form.industry}`);
      addText(`Team Size: ${form.teamSize}`);
      addText(`Goal: ${form.goal}`);
      addText(`Challenge: ${form.challenge}`);

      addText("SWOT Analysis", { size: 14, style: "bold" });
      addText(`Strengths:\n${result.swot?.strengths?.map((s: string) => `- ${s}`).join("\n") || "N/A"}`);
      addText(`Weaknesses:\n${result.swot?.weaknesses?.map((w: string) => `- ${w}`).join("\n") || "N/A"}`);
      addText(`Opportunities:\n${result.swot?.opportunities?.map((o: string) => `- ${o}`).join("\n") || "N/A"}`);
      addText(`Threats:\n${result.swot?.threats?.map((t: string) => `- ${t}`).join("\n") || "N/A"}`);

      addText("Team Structure Advice", { size: 14, style: "bold" });
      addText(result.teamAnalysis?.structure || "N/A");
      addText(`Key Roles to Hire:\n${result.teamAnalysis?.memberInsights?.map((m: any) => `- ${m.role}: ${m.importance} (Est. budget: ${m.hiringCost})`).join("\n") || "N/A"}`);

      addText("Revenue Strategy", { size: 14, style: "bold" });
      addText(`${result.revenueOptimizer?.opportunities?.map((o: string) => `- Opportunity: ${o}`).join("\n") || "N/A"}`);
      addText(`Key Growth Indicators (KPIs):\n${result.revenueOptimizer?.kpis?.map((k: string) => `- KPI: ${k}`).join("\n") || "N/A"}`);

      addText("Growth Roadmap", { size: 14, style: "bold" });
      addText(result.growthIntelligence || "N/A");

      addText("Investor Valuation Insights", { size: 14, style: "bold" });
      addText(result.investorInsights || "N/A");

      const filename = `machrou3i-enterprise-${form.name.toLowerCase().replace(/\s+/g, "-")}.pdf`;
      doc.save(filename);

      toast({
        title: "Export Success",
        description: "Enterprise report saved as PDF."
      });
    } catch (e) {
      console.error(e);
      toast({
        title: "Export Failed",
        description: "Unable to generate the Enterprise PDF report."
      });
    }
  };

  const chartData = result?.revenueOptimizer?.projectedGrowth
    ? result.revenueOptimizer.projectedGrowth.map((val: number, index: number) => ({
        month: `M${index + 1}`,
        Growth: val
      }))
    : [];

  const radarData = result?.swot
    ? [
        { subject: "Strengths", A: 90, B: 110, fullMark: 150 },
        { subject: "Opportunities", A: 85, B: 130, fullMark: 150 },
        { subject: "Weaknesses", A: 50, B: 130, fullMark: 150 },
        { subject: "Threats", A: 60, B: 100, fullMark: 150 }
      ]
    : [];

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 bg-gradient-hero">
      <div className="container mx-auto max-w-6xl">
        {/* Header banner */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <span className="inline-flex items-center gap-1 text-[10px] font-mono tracking-widest text-neon uppercase bg-neon/10 px-3 py-1 rounded-full mb-3">
              <Sparkles className="h-3 w-3" />
              Advanced Analytics Module
            </span>
            <h1 className="text-3xl md:text-4xl font-bold font-heading text-gradient-neon">
              {t("enterprise.title", "Enterprise Intelligence Center")}
            </h1>
            <p className="text-muted-foreground text-xs md:text-sm mt-1">
              {t("enterprise.subtitle", "Simulate core structures, forecast revenue trajectories, and compile board-ready reports.")}
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="px-4 py-2 text-xs font-semibold rounded-xl border border-border bg-secondary/35 text-foreground hover:bg-secondary/60 transition-all flex items-center gap-2"
            >
              <History className="h-3.5 w-3.5" />
              {t("enterprise.history", "History")} ({historyList.length})
            </button>
            {result && (
              <button
                onClick={handleExportPDF}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-neon text-black glow-neon hover:opacity-90 transition-all flex items-center gap-2"
              >
                <Download className="h-3.5 w-3.5" />
                {t("enterprise.export", "Export Data")}
              </button>
            )}
          </div>
        </div>

        {/* History drawer overlay */}
        <AnimatePresence>
          {showHistory && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="glass-panel border border-neon/30 p-6 rounded-2xl mb-8"
            >
              <h3 className="text-sm font-bold uppercase tracking-wider text-neon mb-4">
                Saved Sessions
              </h3>
              {historyList.length === 0 ? (
                <p className="text-xs text-muted-foreground">No historical queries yet.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {historyList.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleSelectHistory(item)}
                      className="p-3 text-start glass-panel rounded-xl hover:border-neon/30 transition-all"
                    >
                      <p className="text-xs font-bold text-foreground truncate">{item.input.name}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{item.input.industry}</p>
                      <span className="text-[9px] text-neon/60 mt-1 block font-mono">
                        {new Date(item.created_at).toLocaleDateString()}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid lg:grid-cols-12 gap-8 items-stretch">
          {/* Inputs Section */}
          <div className="lg:col-span-4 flex flex-col justify-start">
            <form onSubmit={handleGenerate} className="glass-panel rounded-2xl p-6 space-y-4 bg-black/45 border-border/30">
              <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Building className="h-4 w-4 text-neon" />
                Enterprise Coordinates
              </h2>

              <div className="space-y-1">
                <label className="text-[10px] uppercase text-muted-foreground tracking-wider">Enterprise Name</label>
                <input
                  type="text"
                  placeholder="e.g. Acme Labs"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-secondary/35 border border-border/60 rounded-xl px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-neon focus:ring-1 focus:ring-neon/30"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase text-muted-foreground tracking-wider">Industry / Vertical</label>
                <input
                  type="text"
                  placeholder="e.g. Agritech, FinSaaS"
                  value={form.industry}
                  onChange={(e) => setForm({ ...form, industry: e.target.value })}
                  className="w-full bg-secondary/35 border border-border/60 rounded-xl px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-neon focus:ring-1 focus:ring-neon/30"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase text-muted-foreground tracking-wider">Core Team Size ({form.teamSize} members)</label>
                <input
                  type="range"
                  min="1"
                  max="120"
                  value={form.teamSize}
                  onChange={(e) => setForm({ ...form, teamSize: e.target.value })}
                  className="w-full h-1 bg-secondary rounded appearance-none cursor-pointer accent-neon"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase text-muted-foreground tracking-wider">Primary Expansion Goal</label>
                <textarea
                  placeholder="e.g. Scale customer acquisition 3x and launch mobile beta"
                  value={form.goal}
                  onChange={(e) => setForm({ ...form, goal: e.target.value })}
                  className="w-full bg-secondary/35 border border-border/60 rounded-xl px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-neon focus:ring-1 focus:ring-neon/30 h-16 resize-none"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase text-muted-foreground tracking-wider">Critical Bottleneck / Challenge</label>
                <textarea
                  placeholder="e.g. Heavy regional merchant processing friction and high CAC"
                  value={form.challenge}
                  onChange={(e) => setForm({ ...form, challenge: e.target.value })}
                  className="w-full bg-secondary/35 border border-border/60 rounded-xl px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-neon focus:ring-1 focus:ring-neon/30 h-16 resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3 rounded-xl font-semibold text-xs bg-neon text-black glow-neon hover:opacity-95 disabled:opacity-40 transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4.5 w-4.5 animate-spin" />
                    Consulting AI...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-3.5 w-3.5" />
                    Generate Intelligence
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Output Results Section */}
          <div className="lg:col-span-8 flex flex-col justify-between">
            <AnimatePresence mode="wait">
              {loading && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex-1 flex flex-col items-center justify-center glass-panel rounded-2xl p-12 text-center border-neon/20 bg-black/35"
                >
                  <Loader2 className="h-12 w-12 text-neon animate-spin mb-4" />
                  <h3 className="text-lg font-heading font-semibold text-foreground">AI Intelligence Agent is Active</h3>
                  <p className="text-xs text-muted-foreground max-w-sm mt-1">
                    Analyzing workforce structures, formulating SWOT coordinates, and simulating growth indices.
                  </p>
                </motion.div>
              )}

              {!result && !loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex-1 flex flex-col items-center justify-center glass-panel rounded-2xl p-12 text-center border-dashed border-border/60 bg-black/20"
                >
                  <Building className="h-10 w-10 text-muted-foreground/60 mb-3" />
                  <h3 className="text-sm font-semibold text-foreground">Awaiting coordinates</h3>
                  <p className="text-xs text-muted-foreground max-w-xs mt-1">
                    Fill out the enterprise details to launch the dynamic SWOT matrix, team structure analysis, and revenue modeling.
                  </p>
                </motion.div>
              )}

              {result && !loading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  {/* Executive summary banner */}
                  <div className="glass-panel p-5 rounded-2xl border-neon/20 bg-gradient-to-r from-neon/5 to-transparent">
                    <h3 className="text-xs uppercase font-mono tracking-widest text-neon mb-2 flex items-center gap-1.5">
                      <CheckCircle className="h-3.5 w-3.5" />
                      Executive Summary
                    </h3>
                    <p className="text-xs md:text-sm text-foreground/90 leading-relaxed font-light whitespace-pre-line">
                      {result.executiveSummary}
                    </p>
                  </div>

                  {/* SWOT & Revenue trajectory charts */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="glass-panel p-5 rounded-2xl flex flex-col items-stretch">
                      <h4 className="text-xs uppercase text-muted-foreground font-semibold mb-3 flex items-center gap-1.5">
                        <Users className="h-3.5 w-3.5 text-neon" />
                        SWOT Radar
                      </h4>
                      <div className="h-48 w-full flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                            <PolarGrid stroke="#2c2c35" />
                            <PolarAngleAxis dataKey="subject" stroke="#a1a1aa" fontSize={9} />
                            <PolarRadiusAxis angle={30} domain={[0, 150]} stroke="#2c2c35" tick={false} />
                            <Radar name="SWOT Alignment" dataKey="A" stroke="#00f2fe" fill="#00f2fe" fillOpacity={0.2} />
                          </RadarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    <div className="glass-panel p-5 rounded-2xl flex flex-col items-stretch">
                      <h4 className="text-xs uppercase text-muted-foreground font-semibold mb-3 flex items-center gap-1.5">
                        <TrendingUp className="h-3.5 w-3.5 text-neon" />
                        Projected Growth Index
                      </h4>
                      <div className="h-48 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={chartData}>
                            <defs>
                              <linearGradient id="colorGrowth" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#00f2fe" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#00f2fe" stopOpacity={0} />
                              </linearGradient>
                            </defs>
                            <XAxis dataKey="month" stroke="#71717a" fontSize={9} />
                            <YAxis stroke="#71717a" fontSize={9} />
                            <Tooltip contentStyle={{ backgroundColor: "#141416", borderColor: "#27272a", fontSize: 10 }} />
                            <Area type="monotone" dataKey="Growth" stroke="#00f2fe" fillOpacity={1} fill="url(#colorGrowth)" strokeWidth={2} />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>

                  {/* SWOT details card grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="p-3.5 rounded-xl border border-neon/10 bg-neon/5">
                      <p className="text-[10px] uppercase font-bold text-neon">Strengths</p>
                      <ul className="text-[9px] text-muted-foreground mt-1.5 space-y-1">
                        {result.swot?.strengths?.map((s: string, idx: number) => (
                          <li key={idx} className="truncate" title={s}>• {s}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-3.5 rounded-xl border border-gold/15 bg-gold/5">
                      <p className="text-[10px] uppercase font-bold text-gold">Weaknesses</p>
                      <ul className="text-[9px] text-muted-foreground mt-1.5 space-y-1">
                        {result.swot?.weaknesses?.map((w: string, idx: number) => (
                          <li key={idx} className="truncate" title={w}>• {w}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-3.5 rounded-xl border border-neon/10 bg-neon/5">
                      <p className="text-[10px] uppercase font-bold text-neon">Opportunities</p>
                      <ul className="text-[9px] text-muted-foreground mt-1.5 space-y-1">
                        {result.swot?.opportunities?.map((o: string, idx: number) => (
                          <li key={idx} className="truncate" title={o}>• {o}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-3.5 rounded-xl border border-red-500/10 bg-red-500/5">
                      <p className="text-[10px] uppercase font-bold text-red-400">Threats</p>
                      <ul className="text-[9px] text-muted-foreground mt-1.5 space-y-1">
                        {result.swot?.threats?.map((t: string, idx: number) => (
                          <li key={idx} className="truncate" title={t}>• {t}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Team analysis & Member Hiring Insights */}
                  <div className="glass-panel p-5 rounded-2xl">
                    <h3 className="text-xs uppercase font-mono tracking-widest text-neon mb-3">
                      Optimal Team Structure
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                      {result.teamAnalysis?.structure}
                    </p>
                    <div className="grid md:grid-cols-2 gap-3">
                      {result.teamAnalysis?.memberInsights?.map((member: any, idx: number) => (
                        <div key={idx} className="p-3 rounded-xl border border-border/40 bg-black/15 flex items-center justify-between">
                          <div>
                            <p className="text-xs font-semibold text-foreground">{member.role}</p>
                            <p className="text-[10px] text-muted-foreground mt-0.5">{member.importance}</p>
                          </div>
                          <span className="text-[9px] bg-secondary/50 border border-border/80 text-neon px-2.5 py-1 rounded-md shrink-0">
                            {member.hiringCost}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Growth intelligence roadmaps & Revenue advice */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="glass-panel p-5 rounded-2xl space-y-3">
                      <h4 className="text-xs uppercase font-mono tracking-widest text-neon">Growth Intelligence</h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {result.growthIntelligence}
                      </p>
                    </div>

                    <div className="glass-panel p-5 rounded-2xl space-y-3">
                      <h4 className="text-xs uppercase font-mono tracking-widest text-neon">Investor Insights</h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {result.investorInsights}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
