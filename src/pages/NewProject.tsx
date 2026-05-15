import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { Navigate } from "react-router-dom";
import {
  Lightbulb,
  Users,
  DollarSign,
  Target,
  TrendingUp,
  Shield,
  Rocket,
  Star,
  Loader2,
  AlertTriangle,
} from "lucide-react";

const sections = [
  { key: "idea", icon: Lightbulb },
  { key: "market", icon: Target },
  { key: "audience", icon: Users },
  { key: "finance", icon: DollarSign },
  { key: "competitors", icon: Shield },
  { key: "growth", icon: TrendingUp },
  { key: "roadmap", icon: Rocket },
];

const countries = [
  "Tunisia", "France", "United States", "Canada", "Germany",
  "United Kingdom", "Italy", "Spain", "Morocco", "Algeria",
  "UAE", "Saudi Arabia", "Qatar", "Egypt", "Turkey",
  "India", "China", "Japan", "Brazil", "Australia",
];

type AnalysisData = {
  score?: number;
  metrics?: {
    marketFit?: number;
    audience?: number;
    revenue?: number;
    competition?: number;
    growth?: number;
    feasibility?: number;
  };
  summary?: string;
  executiveSummary?: string;
  analysis?: Record<string, string>;
  recommendations?: string[];
};

const NewProject = () => {
  const { t } = useTranslation();

  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [language, setLanguage] = useState("en");
  const [country, setCountry] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<AnalysisData | null>(null);

  const resultsRef = useRef<HTMLDivElement | null>(null);

  if (!Users) return <Navigate to="/login" replace />;

  const update = (key: string, val: string) =>
    setAnswers((prev) => ({ ...prev, [key]: val }));

  const validate = () =>
    sections.every((sec) =>
      [1, 2].every((q) => {
        const key = `${sec.key}_q${q}`;
        return answers[key] && answers[key].trim().length > 2;
      })
    );

  const buildPayload = () => {
    const cleaned: Record<string, string> = {};
    Object.keys(answers).forEach((key) => {
      cleaned[key] = answers[key]?.trim() || "";
    });
    return { answers: cleaned, language, address: country };
  };

  const runAnalysis = async () => {
    setError("");
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch(
        "https://notgivinashit.app.n8n.cloud/webhook/analyze-project",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(buildPayload()),
        }
      );

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      // =========================
      // GET RAW RESPONSE
      // =========================
      const raw = await res.text();

      console.log("📦 RAW WEBHOOK RESPONSE:", raw);

      // =========================
      // PARSE RESPONSE
      // =========================
      const parsed = JSON.parse(raw);

      // sometimes n8n returns array
      const incoming = Array.isArray(parsed)
        ? parsed[0]
        : parsed;

      console.log("✅ PARSED:", incoming);

      // =========================
      // TRANSFORM TO FRONTEND SHAPE
      // =========================
      const normalized: AnalysisData = {
        score:
          incoming.OverallViabilityScore ||
          incoming.score ||
          0,

        metrics: {
          marketFit:
            incoming.MarketFit ||
            incoming.metrics?.marketFit ||
            0,

          audience:
            incoming.AudienceMatch ||
            incoming.metrics?.audience ||
            0,

          revenue:
            incoming.RevenuePotential ||
            incoming.metrics?.revenue ||
            0,

          competition:
            incoming.CompetitiveEdge ||
            incoming.metrics?.competition ||
            0,

          growth:
            incoming.GrowthPotential ||
            incoming.metrics?.growth ||
            0,

          feasibility:
            incoming.Feasibility ||
            incoming.metrics?.feasibility ||
            0,
        },

        analysis: {
          market:
            incoming.analysis?.market ||
            "No market analysis available.",

          audience:
            incoming.analysis?.audience ||
            "No audience analysis available.",

          revenue:
            incoming.analysis?.revenue ||
            "No revenue analysis available.",

          competition:
            incoming.analysis?.competition ||
            "No competition analysis available.",

          growth:
            incoming.analysis?.growth ||
            "No growth analysis available.",

          risks:
            incoming.analysis?.feasibility ||
            incoming.analysis?.risks ||
            "No feasibility analysis available.",

          executive:
            incoming.analysis?.executive ||
            "No executive summary available.",
        },

        executiveSummary:
          incoming.analysis?.executive ||
          incoming.executiveSummary ||
          incoming.summary ||
          "",

        recommendations:
          incoming.recommendations || [
            "Improve differentiation strategy.",
            "Strengthen monetization clarity.",
            "Validate demand with real customers.",
            "Increase defensibility through technology.",
            "Focus on scalable acquisition channels.",
          ],
      };

      console.log("🔥 NORMALIZED RESULT:", normalized);

      // =========================
      // SAVE RESULT
      // =========================
      setResult(normalized);

      // =========================
      // AUTO SCROLL
      // =========================
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 200);

    } catch (err) {
      console.error("🔥 ANALYSIS ERROR:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      setError("Please complete all fields (minimum 3 characters each).");
      return;
    }
    runAnalysis();
  };

  // ===== Results helpers =====
  const metrics = result
    ? [
      { key: "marketFit", icon: Target, score: result.metrics?.marketFit, color: "text-neon", analysisKey: "market" },
      { key: "audience", icon: Users, score: result.metrics?.audience, color: "text-gold", analysisKey: "audience" },
      { key: "revenue", icon: DollarSign, score: result.metrics?.revenue, color: "text-neon", analysisKey: "revenue" },
      { key: "competition", icon: Shield, score: result.metrics?.competition, color: "text-gold", analysisKey: "competition" },
      { key: "growth", icon: TrendingUp, score: result.metrics?.growth, color: "text-neon", analysisKey: "growth" },
      { key: "feasibility", icon: Rocket, score: result.metrics?.feasibility, color: "text-gold", analysisKey: "risks" },
    ]
    : [];

  const summaryText = result?.executiveSummary || result?.summary || "";

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="container mx-auto max-w-4xl">

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="text-3xl font-bold font-heading">
            {t("newProject.title")}
          </h1>
          <p className="text-muted-foreground mt-2">
            {t("newProject.subtitle")}
          </p>
        </motion.div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {sections.map((sec, i) => (
            <motion.div
              key={sec.key}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="glass-panel rounded-2xl p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary/30 flex items-center justify-center glow-neon">
                  <sec.icon className="h-5 w-5 text-neon" />
                </div>
                <h2 className="text-lg font-heading font-semibold">
                  {t(`newProject.${sec.key}.title`)}
                </h2>
              </div>

              <div className="space-y-4">
                {[1, 2].map((q) => {
                  const key = `${sec.key}_q${q}`;
                  return (
                    <div key={q}>
                      <label className="text-sm text-muted-foreground mb-1.5 block">
                        {t(`newProject.${sec.key}.q${q}`)}
                      </label>
                      <textarea
                        value={answers[key] || ""}
                        onChange={(e) => update(key, e.target.value)}
                        rows={3}
                        required
                        disabled={loading}
                        className="w-full px-4 py-2.5 rounded-xl bg-secondary/50 border border-border/50 text-foreground focus:outline-none focus:ring-2 focus:ring-neon/30 text-sm resize-none disabled:opacity-50"
                      />
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ))}

          {/* 🌐 LANGUAGE + COUNTRY */}
          <motion.div className="glass-panel rounded-2xl p-6 space-y-5">
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                disabled={loading}
                className="w-full px-4 py-2.5 rounded-xl bg-secondary/50 border border-border/50 text-foreground focus:outline-none focus:ring-2 focus:ring-neon/30 text-sm"
              >
                <option value="en">English</option>
                <option value="fr">Français</option>
                <option value="ar">العربية</option>
              </select>
            </div>

            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Address</label>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                disabled={loading}
                className="w-full px-4 py-2.5 rounded-xl bg-secondary/50 border border-border/50 text-foreground focus:outline-none focus:ring-2 focus:ring-neon/30 text-sm"
              >
                <option value="">Select country</option>
                {countries.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </motion.div>

          {/* ERROR */}
          {error && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-panel rounded-2xl p-5 border border-red-500/40 flex items-start gap-3"
            >
              <AlertTriangle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-red-400 font-medium">{error}</p>
                {result === null && (
                  <button
                    type="button"
                    onClick={runAnalysis}
                    className="mt-2 text-xs text-neon underline"
                  >
                    Retry
                  </button>
                )}
              </div>
            </motion.div>
          )}

          {/* BUTTON */}
          <motion.div className="text-center pt-4">
            <button
              type="submit"
              disabled={loading}
              className="px-10 py-3.5 rounded-xl bg-neon text-white font-semibold text-lg disabled:opacity-60"
            >
              {loading ? "Analyzing..." : t("newProject.submit")}
            </button>
          </motion.div>
        </form>

        {/* LOADING / RESULTS */}
        <AnimatePresence mode="wait">
          {loading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="glass-panel rounded-2xl p-10 mt-10 text-center glow-neon"
            >
              <Loader2 className="h-10 w-10 text-neon mx-auto mb-4 animate-spin" />
              <p className="text-lg font-heading font-semibold">
                Analyzing your project…
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                This may take a few seconds.
              </p>
            </motion.div>
          )}

          {result && !loading && (
            <motion.div
              key="results"
              ref={resultsRef}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-12"
            >
              {/* SCORE */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="glass-panel rounded-2xl p-8 text-center mb-8 glow-neon"
              >
                <Star className="h-10 w-10 text-gold mx-auto mb-3" />
                <div className="text-6xl font-bold text-gradient-gold mb-2">
                  {result.score ?? 0}%
                </div>
                <div className="text-muted-foreground">
                  {t("results.overallScore")}
                </div>
              </motion.div>

              {/* METRICS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {metrics.map((m, i) => (
                  <motion.div
                    key={m.key}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.08 }}
                    className="glass-panel rounded-xl p-5"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <m.icon className={`h-5 w-5 ${m.color}`} />
                        <span className="text-sm font-semibold">
                          {t(`results.metrics.${m.key}`)}
                        </span>
                      </div>
                      <span className="text-lg font-bold">
                        {Math.round(m.score || 0)}%
                      </span>
                    </div>

                    <div className="w-full h-2 rounded-full bg-secondary">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${m.score || 0}%` }}
                        transition={{ delay: 0.5 + i * 0.1, duration: 0.8 }}
                        className="h-full rounded-full bg-neon"
                      />
                    </div>

                    <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
                      {result.analysis?.[m.analysisKey] ||
                        "No analysis available for this section."}
                    </p>
                  </motion.div>
                ))}
              </div>

              {/* SUMMARY */}
              {summaryText && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-panel rounded-2xl p-6 mb-8"
                >
                  <h2 className="text-xl font-heading font-semibold mb-3">
                    AI Summary
                  </h2>
                  <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                    {summaryText}
                  </p>
                </motion.div>
              )}

              {/* RECOMMENDATIONS */}
              {result.recommendations && result.recommendations.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="glass-panel rounded-2xl p-6"
                >
                  <h2 className="text-xl font-heading font-semibold mb-4">
                    {t("results.recommendations")}
                  </h2>
                  <ul className="space-y-3">
                    {result.recommendations.map((rec, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-neon/20 flex items-center justify-center shrink-0 mt-0.5">
                          <span className="text-xs font-bold text-neon">{i + 1}</span>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {rec}
                        </p>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default NewProject;
