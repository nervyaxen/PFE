import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Navigate } from "react-router-dom";
import { Shield, Users, FolderOpen, Activity, Settings } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Admin = () => {
  const { t } = useTranslation();
  const { user, isAdmin } = useAuth();

  if (!user) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/dashboard" replace />;

  const stats = [
    { icon: Users, label: t("admin.totalUsers"), value: "1,247" },
    { icon: FolderOpen, label: t("admin.totalProjects"), value: "3,891" },
    { icon: Activity, label: t("admin.activeNow"), value: "42" },
  ];

  const users = [
    { name: "Ahmed B.", email: "ahmed@example.com", role: "user", projects: 5 },
    { name: "Marie D.", email: "marie@example.com", role: "user", projects: 3 },
    { name: "Admin", email: "admin@machrou3i.com", role: "admin", projects: 12 },
  ];

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-destructive/20 flex items-center justify-center">
            <Shield className="h-6 w-6 text-destructive" />
          </div>
          <div>
            <h1 className="text-3xl font-bold font-heading">{t("admin.title")}</h1>
            <p className="text-sm text-muted-foreground">{t("admin.subtitle")}</p>
          </div>
        </motion.div>

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

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="glass-panel rounded-2xl overflow-hidden"
        >
          <div className="p-5 border-b border-border/50 flex items-center justify-between">
            <h2 className="font-heading font-semibold flex items-center gap-2">
              <Settings className="h-5 w-5 text-muted-foreground" />
              {t("admin.userManagement")}
            </h2>
          </div>
          <div className="divide-y divide-border/30">
            {users.map((u, i) => (
              <motion.div key={u.email} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 + i * 0.05 }}
                className="flex items-center justify-between px-5 py-4 hover:bg-primary/5 transition-colors"
              >
                <div>
                  <div className="font-medium">{u.name}</div>
                  <div className="text-xs text-muted-foreground">{u.email}</div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`text-xs px-2.5 py-1 rounded-full ${u.role === "admin" ? "bg-destructive/20 text-destructive" : "bg-neon/20 text-neon"}`}>
                    {u.role}
                  </span>
                  <span className="text-sm text-muted-foreground">{u.projects} {t("admin.projects")}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Admin;
