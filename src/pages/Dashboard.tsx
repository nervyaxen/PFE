import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Link, Navigate } from "react-router-dom";
import { Plus, FolderOpen, BarChart3, Brain, TrendingUp } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Dashboard = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  const stats = [
    { icon: FolderOpen, label: t("dash.totalProjects"), value: "3" },
    { icon: BarChart3, label: t("dash.analyzed"), value: "2" },
    { icon: TrendingUp, label: t("dash.successRate"), value: "87%" },
  ];

  const projects = [
    { id: "1", name: "E-Commerce Platform", status: "analyzed", score: 85 },
    { id: "2", name: "Food Delivery App", status: "analyzed", score: 72 },
    { id: "3", name: "EdTech SaaS", status: "pending", score: 0 },
  ];

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold font-heading">
            {t("dash.welcome")}, <span className="text-gradient-neon">{user.name}</span>
          </h1>
          <p className="text-muted-foreground mt-1">{t("dash.subtitle")}</p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {stats.map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="glass-panel rounded-xl p-5 flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/30 flex items-center justify-center">
                <s.icon className="h-6 w-6 text-neon" />
              </div>
              <div>
                <div className="text-2xl font-bold">{s.value}</div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* New Project + Project List */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-heading font-semibold">{t("dash.projects")}</h2>
          <Link to="/new-project">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-neon text-accent-foreground font-semibold glow-neon text-sm"
            >
              <Plus className="h-4 w-4" />
              {t("dash.newProject")}
            </motion.button>
          </Link>
        </div>

        <div className="grid gap-4">
          {projects.map((p, i) => (
            <motion.div key={p.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
              whileHover={{ x: 4 }}
            >
              <Link to={`/results/${p.id}`} className="glass-panel rounded-xl p-5 flex items-center justify-between group block">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                    <Brain className="h-5 w-5 text-neon" />
                  </div>
                  <div>
                    <div className="font-semibold group-hover:text-neon transition-colors">{p.name}</div>
                    <div className="text-xs text-muted-foreground capitalize">{t(`dash.status.${p.status}`)}</div>
                  </div>
                </div>
                {p.score > 0 && (
                  <div className="text-right">
                    <div className="text-lg font-bold text-gradient-gold">{p.score}%</div>
                    <div className="text-xs text-muted-foreground">{t("dash.score")}</div>
                  </div>
                )}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
