import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Navigate } from "react-router-dom";
import {
  TrendingUp,
  Users,
  DollarSign,
  Target,
  Shield,
  Rocket,
  Star,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";

const Results = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  // -------------------------
  // STATE
  // -------------------------
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // -------------------------
  // POLLING SYSTEM (FIXED + SAFE)
  // -------------------------
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    const fetchResult = async () => {
      try {
        const res = await fetch(
          "https://notgivinashit.app.n8n.cloud/webhook-test/analyze-project"
        );

        if (!res.ok) return;

        const json = await res.json();

        // ✅ strict validation
        if (!json || typeof json.score !== "number") {
          console.log("AI still processing...");
          return;
        }

        // ✅ update state
        setData(json);
        setLoading(false);

        // ✅ STOP polling once result is ready
        clearInterval(interval);
      } catch (err) {
        console.log("AI still processing...");
      }
    };

    // initial call
    fetchResult();

    // polling
    interval = setInterval(fetchResult, 2000);

    // cleanup (IMPORTANT)
    return () => clearInterval(interval);
  }, []);

  // -------------------------
  // LOADING UI (CLEAN + PRO)
  // -------------------------
  if (loading || !data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1 }}
        >
          <Loader2 className="h-12 w-12 text-neon" />
        </motion.div>

        <p className="mt-4 text-muted-foreground animate-pulse">
          AI is analyzing your startup like a VC partner...
        </p>
      </div>
    );
  }

  // -------------------------
  // SAFE DATA (NO FALLBACK LIES)
  // -------------------------
  const safe = {
    score: data?.score ?? 0,
    metrics: data?.metrics ?? {},
    analysis: data?.analysis ?? {},
    summary: data?.executiveSummary ?? "",
    recommendations: data?.recommendations ?? [],
  };

  const metrics = [
    { key: "marketFit", icon: Target, color: "text-neon" },
    { key: "audience", icon: Users, color: "text-gold" },
    { key: "revenue", icon: DollarSign, color: "text-neon" },
    { key: "competition", icon: Shield, color: "text-gold" },
    { key: "growth", icon: TrendingUp, color: "text-neon" },
    { key: "feasibility", icon: Rocket, color: "text-gold" },
  ];

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="container mx-auto max-w-5xl">

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="text-3xl font-bold">{t("results.title")}</h1>
          <p className="text-muted-foreground mt-2">
            Real-time VC AI Analysis
          </p>
        </motion.div>

        {/* SCORE */}
        <motion.div className="glass-panel p-8 text-center rounded-2xl mb-8">
          <Star className="h-10 w-10 text-gold mx-auto mb-3" />
          <div className="text-6xl font-bold text-gradient-gold">
            {safe.score}%
          </div>
        </motion.div>

        {/* METRICS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {metrics.map((m, i) => {
            const value = safe.metrics?.[m.key] ?? 0;

            return (
              <motion.div
                key={m.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass-panel p-5 rounded-xl"
              >
                <div className="flex justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <m.icon className={`h-5 w-5 ${m.color}`} />
                    <span className="text-sm font-semibold">
                      {m.key}
                    </span>
                  </div>

                  <span className="font-bold">
                    {value}%
                  </span>
                </div>

                {/* BAR */}
                <div className="h-2 bg-secondary rounded-full">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${value}%` }}
                    transition={{ duration: 0.8 }}
                    className="h-2 bg-neon rounded-full"
                  />
                </div>

                {/* ANALYSIS */}
                <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
                  {safe.analysis?.[m.key] ||
                    "AI is generating deep VC-level analysis..."}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* SUMMARY */}
        {safe.summary && (
          <div className="glass-panel p-6 rounded-2xl mt-8">
            <h2 className="text-lg font-semibold mb-3">
              AI Summary
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {safe.summary}
            </p>
          </div>
        )}

        {/* RECOMMENDATIONS */}
        <div className="glass-panel p-6 rounded-2xl mt-6">
          <h2 className="text-lg font-semibold mb-3">
            Recommendations
          </h2>

          <ul className="space-y-2">
            {safe.recommendations.map((r: string, i: number) => (
              <li key={i} className="text-sm text-muted-foreground">
                • {r}
              </li>
            ))}
          </ul>
        </div>

      </div>
    </div>
  );
};

export default Results;