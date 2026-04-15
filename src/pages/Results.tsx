import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Navigate, useLocation } from "react-router-dom";
import { TrendingUp, Users, DollarSign, Target, Shield, Rocket, Star } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Results = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const location = useLocation();

  const data = location.state;

  if (!user) return <Navigate to="/login" replace />;

  // ✅ SAFE DATA (never crash)
  const safe = data || {
    score: 50,
    metrics: {
      marketFit: 50,
      audience: 50,
      revenue: 50,
      competition: 50,
      growth: 50,
      feasibility: 50,
    },
    summary: "",
    analysis: {},
    recommendations: [],
  };

  // ✅ METRICS (mapped exactly to your UI)
  const metrics = [
    { key: "marketFit", icon: Target, score: safe.metrics?.marketFit, color: "text-neon", analysisKey: "market" },
    { key: "audience", icon: Users, score: safe.metrics?.audience, color: "text-gold", analysisKey: "audience" },
    { key: "revenue", icon: DollarSign, score: safe.metrics?.revenue, color: "text-neon", analysisKey: "revenue" },
    { key: "competition", icon: Shield, score: safe.metrics?.competition, color: "text-gold", analysisKey: "competition" },
    { key: "growth", icon: TrendingUp, score: safe.metrics?.growth, color: "text-neon", analysisKey: "growth" },
    { key: "feasibility", icon: Rocket, score: safe.metrics?.feasibility, color: "text-gold", analysisKey: "risks" },
  ];

  const overallScore = safe.score;

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="container mx-auto max-w-5xl">

        {/* HEADER */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <h1 className="text-3xl font-bold font-heading">{t("results.title")}</h1>
          <p className="text-muted-foreground mt-2">{t("results.subtitle")}</p>
        </motion.div>

        {/* SCORE */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="glass-panel rounded-2xl p-8 text-center mb-8 glow-neon"
        >
          <Star className="h-10 w-10 text-gold mx-auto mb-3" />
          <div className="text-6xl font-bold text-gradient-gold mb-2">
            {overallScore}%
          </div>
          <div className="text-muted-foreground">{t("results.overallScore")}</div>
        </motion.div>

        {/* METRICS + AI PARAGRAPHS */}
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

              {/* Progress */}
              <div className="w-full h-2 rounded-full bg-secondary">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${m.score || 0}%` }}
                  transition={{ delay: 0.5 + i * 0.1, duration: 0.8 }}
                  className="h-full rounded-full bg-neon"
                />
              </div>

              {/* 🔥 AI LONG PARAGRAPH */}
              <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
                {safe.analysis?.[m.analysisKey] ||
                  "No analysis available for this section."}
              </p>
            </motion.div>
          ))}
        </div>

        {/* 🔥 SUMMARY BLOCK */}
        {safe.summary && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel rounded-2xl p-6 mb-8"
          >
            <h2 className="text-xl font-heading font-semibold mb-3">
              AI Summary
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {safe.summary}
            </p>
          </motion.div>
        )}

        {/* 🔥 RECOMMENDATIONS */}
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
            {(safe.recommendations || []).map((rec: string, i: number) => (
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

      </div>
    </div>
  );
};

export default Results;