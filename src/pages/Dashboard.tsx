import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Link, Navigate } from "react-router-dom";
import { Plus, FolderOpen, BarChart3, Brain, TrendingUp } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";

const Dashboard = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  // =========================
  // PROFILE STATE (NEW)
  // =========================
  const [profile, setProfile] = useState({
    name: user.name || "",
    email: user.email || "",
    password: "",
    avatar: user.avatar || "",
  });

  const [backup, setBackup] = useState(profile);

  useEffect(() => {
    const init = {
      name: user.name || "",
      email: user.email || "",
      password: "",
      avatar: user.avatar || "",
    };
    setProfile(init);
    setBackup(init);
  }, [user]);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleAvatar = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setProfile({ ...profile, avatar: reader.result?.toString() || "" });
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    try {
      // =========================
      // FUTURE SUPABASE READY
      // =========================
      // await supabase.auth.updateUser({
      //   email: profile.email,
      //   password: profile.password,
      //   data: { name: profile.name, avatar: profile.avatar }
      // });

      localStorage.setItem("profile", JSON.stringify(profile));
      setBackup(profile);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUndo = () => {
    setProfile(backup);
  };

  // =========================
  // EXISTING DATA
  // =========================
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

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold font-heading">
            {t("dash.welcome")},{" "}
            <span className="text-gradient-neon">{user.name}</span>
          </h1>
          <p className="text-muted-foreground mt-1">{t("dash.subtitle")}</p>
        </motion.div>

        {/* =========================
            PROFILE SECTION (NEW)
        ========================= */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel rounded-xl p-6 mb-8"
        >
          <h2 className="text-xl font-heading font-semibold mb-4 text-neon">
            Profile Settings
          </h2>

          <div className="flex flex-col md:flex-row gap-6">

            {/* AVATAR */}
            <div className="flex flex-col items-center gap-3">
              <img
                src={profile.avatar || "https://via.placeholder.com/100"}
                className="w-24 h-24 rounded-full object-cover border border-neon"
              />

              <input
                type="file"
                accept="image/*"
                onChange={handleAvatar}
                className="text-xs"
              />
            </div>

            {/* FIELDS */}
            <div className="flex-1 grid gap-3">

              <input
                name="name"
                value={profile.name}
                onChange={handleChange}
                placeholder="Name"
                className="glass-panel px-4 py-2 rounded-lg outline-none"
              />

              <input
                name="email"
                value={profile.email}
                onChange={handleChange}
                placeholder="Email"
                className="glass-panel px-4 py-2 rounded-lg outline-none"
              />

              <input
                name="password"
                value={profile.password}
                onChange={handleChange}
                type="password"
                placeholder="New Password"
                className="glass-panel px-4 py-2 rounded-lg outline-none"
              />

              {/* BUTTONS */}
              <div className="flex gap-3 mt-2">

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSave}
                  className="px-5 py-2 rounded-lg bg-neon text-black font-semibold glow-neon"
                >
                  Save
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleUndo}
                  className="px-5 py-2 rounded-lg border border-muted text-muted-foreground"
                >
                  Undo
                </motion.button>

              </div>
            </div>
          </div>
        </motion.div>

        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
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

        {/* PROJECT HEADER */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-heading font-semibold">
            {t("dash.projects")}
          </h2>
          <Link to="/new-project">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-neon text-accent-foreground font-semibold glow-neon text-sm"
            >
              <Plus className="h-4 w-4" />
              {t("dash.newProject")}
            </motion.button>
          </Link>
        </div>

        {/* PROJECTS */}
        <div className="grid gap-4">
          {projects.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ x: 4 }}
            >
              <Link
                to={`/results/${p.id}`}
                className="glass-panel rounded-xl p-5 flex items-center justify-between group block"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                    <Brain className="h-5 w-5 text-neon" />
                  </div>
                  <div>
                    <div className="font-semibold group-hover:text-neon transition-colors">
                      {p.name}
                    </div>
                    <div className="text-xs text-muted-foreground capitalize">
                      {t(`dash.status.${p.status}`)}
                    </div>
                  </div>
                </div>

                {p.score > 0 && (
                  <div className="text-right">
                    <div className="text-lg font-bold text-gradient-gold">
                      {p.score}%
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {t("dash.score")}
                    </div>
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