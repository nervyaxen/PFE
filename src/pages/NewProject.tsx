import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Navigate, useNavigate } from "react-router-dom";
import {
  Lightbulb,
  Users,
  DollarSign,
  Target,
  TrendingUp,
  Shield,
  Rocket,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

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
  "Tunisia",
  "France",
  "United States",
  "Canada",
  "Germany",
  "United Kingdom",
  "Italy",
  "Spain",
  "Morocco",
  "Algeria",
  "UAE",
  "Saudi Arabia",
  "Qatar",
  "Egypt",
  "Turkey",
  "India",
  "China",
  "Japan",
  "Brazil",
  "Australia",
];

const NewProject = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [language, setLanguage] = useState("en");
  const [country, setCountry] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!user) return <Navigate to="/login" replace />;

  const update = (key: string, val: string) =>
    setAnswers((prev) => ({ ...prev, [key]: val }));

  const validate = () => {
    return sections.every((sec) =>
      [1, 2].every((q) => {
        const key = `${sec.key}_q${q}`;
        return answers[key] && answers[key].trim().length > 2;
      })
    );
  };

  // 🔥 ONLY THIS PART CHANGED (SAFE ADD)
  const buildPayload = () => {
    const cleaned: Record<string, string> = {};

    Object.keys(answers).forEach((key) => {
      cleaned[key] = answers[key]?.trim() || "";
    });

    return {
      answers: cleaned,

      // ✅ ADDED (as requested)
      language: language,
      address: country
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      setError("Please complete all fields (minimum 3 characters each).");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await fetch(
        "http://localhost:5678/webhook-test/analyze-project",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(buildPayload()),
        }
      );

      const raw = await res.text();
      console.log("📦 RAW RESPONSE FROM N8N:", raw);

      let data;
      try {
        data = JSON.parse(raw);
      } catch (err) {
        console.error("❌ JSON PARSE ERROR:", err);

        data = {
          score: 50,
          metrics: {
            marketFit: 50,
            audience: 50,
            revenue: 50,
            competition: 50,
            growth: 50,
            feasibility: 50,
          },
          analysis: {
            market: "Invalid AI response format",
            audience: "Invalid AI response format",
            revenue: "Invalid AI response format",
            competition: "Invalid AI response format",
            growth: "Invalid AI response format",
            risks: "Invalid AI response format",
          },
          recommendations: [
            "Fix AI output format",
            "Check n8n workflow",
            "Retry request",
          ],
        };
      }

      navigate("/results/new", { state: data });
    } catch (err) {
      console.error("🔥 NETWORK ERROR:", err);

      navigate("/results/new", {
        state: {
          score: 50,
          metrics: {
            marketFit: 50,
            audience: 50,
            revenue: 50,
            competition: 50,
            growth: 50,
            feasibility: 50,
          },
          analysis: {
            market: "Network error",
            audience: "Network error",
            revenue: "Network error",
            competition: "Network error",
            growth: "Network error",
            risks: "Network error",
          },
          recommendations: [
            "Check server",
            "Check n8n workflow",
            "Retry later",
          ],
        },
      });
    } finally {
      setLoading(false);
    }
  };

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
              <label className="text-sm text-muted-foreground mb-2 block">
                Language
              </label>

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
              <label className="text-sm text-muted-foreground mb-2 block">
                Address
              </label>

              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                disabled={loading}
                className="w-full px-4 py-2.5 rounded-xl bg-secondary/50 border border-border/50 text-foreground focus:outline-none focus:ring-2 focus:ring-neon/30 text-sm"
              >
                <option value="">Select country</option>
                {countries.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

          </motion.div>

          {/* ERROR */}
          {error && (
            <p className="text-center text-red-500 text-sm">{error}</p>
          )}

          {/* BUTTON */}
          <motion.div className="text-center pt-4">
            <button
              type="submit"
              disabled={loading}
              className="px-10 py-3.5 rounded-xl bg-neon text-white font-semibold text-lg"
            >
              {loading ? "Analyzing..." : t("newProject.submit")}
            </button>
          </motion.div>

        </form>
      </div>
    </div>
  );
};

export default NewProject;