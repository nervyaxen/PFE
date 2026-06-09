import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Link, Navigate } from "react-router-dom";
import { Plus, FolderOpen, BarChart3, Brain, TrendingUp, Sparkles, Activity, ShieldAlert, Cpu } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { AreaChart, Area, ResponsiveContainer } from "recharts";
import { toast } from "@/hooks/use-toast";
import { localDB } from "@/lib/supabaseClient";

const Dashboard = () => {
  const { t } = useTranslation();
  const { user, premiumUnlocked } = useAuth();


  const [profile, setProfile] = useState({
    name: user.name || "",
    email: user.email || "",
    password: "",
    confirmPassword: "",
    avatar: user.avatar || "",
  });

  const [validationError, setValidationError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [backup, setBackup] = useState(profile);

  useEffect(() => {
    const init = {
      name: user.name || "",
      email: user.email || "",
      password: "",
      confirmPassword: "",
      avatar: user.avatar || "",
    };
    setProfile(init);
    setBackup(init);
    
    // Load persisted profile from Supabase if configured
    localDB.getProfile(user.id).then((p) => {
      if (p) {
        const fresh = { ...init, name: p.name, email: p.email, avatar: p.avatar };
        setProfile(fresh);
        setBackup(fresh);
      }
    });
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
    setValidationError("");
    setSuccessMsg("");
  };

  const handleAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setProfile({ ...profile, avatar: reader.result?.toString() || "" });
      setValidationError("");
      setSuccessMsg("");
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setValidationError("");
    setSuccessMsg("");

    if (!profile.name.trim()) {
      setValidationError("Name field cannot be left blank.");
      return;
    }
    if (!profile.email.includes("@")) {
      setValidationError("Please enter a valid email address.");
      return;
    }
    if (profile.password && profile.password !== profile.confirmPassword) {
      setValidationError("Passwords do not match.");
      return;
    }

    try {
      // Persist to Supabase / offline localDB
      await localDB.saveProfile(user.id, {
        name: profile.name,
        email: profile.email,
        avatar: profile.avatar
      });

      localStorage.setItem("profile", JSON.stringify(profile));
      setBackup(profile);
      setSuccessMsg("Settings Saved Successfully!");
      toast({
        title: "Settings Saved",
        description: "Your user profile coordinates are up to date."
      });
    } catch (err) {
      console.error(err);
      setValidationError("Failed to save coordinates to system server.");
    }
  };

  const handleUndo = () => {
    setProfile(backup);
    setValidationError("");
    setSuccessMsg("");
  };

  if (!user) return <Navigate to="/login" replace />;

  const stats = [
    { icon: FolderOpen, label: t("dash.totalProjects", "Total Projects"), value: "3" },
    { icon: BarChart3, label: t("dash.analyzed", "Analyzed"), value: "2" },
    { icon: TrendingUp, label: t("dash.successRate", "Avg. Score"), value: "87%" },
  ];

  const projects = [
    { id: "1", name: "E-Commerce Platform", status: "analyzed", score: 85 },
    { id: "2", name: "Food Delivery App", status: "analyzed", score: 72 },
    { id: "3", name: "EdTech SaaS", status: "pending", score: 0 },
  ];

  // Tiny charts mock data
  const trendData = [
    { value: 20 }, { value: 45 }, { value: 30 }, { value: 65 }, { value: 50 }, { value: 85 }, { value: 90 }
  ];

  const milestones = [
    { label: "Aesthetic Direction Design", completed: true, percent: 100 },
    { label: "SWOT Coordinates Audit", completed: true, percent: 100 },
    { label: "Apparel 3D Showroom Simulation", completed: premiumUnlocked, percent: premiumUnlocked ? 100 : 0 }
  ];

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 bg-gradient-hero">
      <div className="container mx-auto max-w-6xl space-y-8">

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold font-heading">
              {t("dash.welcome", "Welcome back")},{" "}
              <span className="text-gradient-neon">{user.name}</span>
            </h1>
            <p className="text-muted-foreground text-xs md:text-sm mt-1">{t("dash.subtitle", "Here is an overview of your projects")}</p>
          </div>

          {premiumUnlocked ? (
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 3 }}
              className="px-3 py-1.5 text-xs font-bold bg-neon/15 border border-neon/30 text-neon rounded-xl flex items-center gap-1.5 shadow-lg shadow-neon/5"
            >
              <Sparkles className="h-3.5 w-3.5" />
              PREMIUM ACTIVATED
            </motion.div>
          ) : (
            <Link to="/payment">
              <button className="px-3.5 py-1.5 text-xs font-bold rounded-xl bg-gold/20 border border-gold/30 text-gold hover:bg-gold/35 transition-all flex items-center gap-1.5">
                <ShieldAlert className="h-3.5 w-3.5" />
                UNLOCK ENTERPRISE SYSTEM
              </button>
            </Link>
          )}
        </motion.div>

        {/* STATS HERO GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="glass-panel rounded-2xl p-5 flex items-center gap-4 border-border/30 bg-black/40"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/30 flex items-center justify-center border border-border/40">
                <s.icon className="h-6 w-6 text-neon" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">{s.value}</div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* WIDGETS ROW (NEW ENHANCEMENT - MINIMAL, NO REDESIGN) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
          {/* Milestone progress indicators */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:col-span-4 glass-panel p-5 rounded-2xl border-border/30 bg-black/35 space-y-4"
          >
            <h3 className="text-xs uppercase font-bold text-foreground flex items-center gap-2">
              <Activity className="h-3.5 w-3.5 text-neon" />
              System Milestones
            </h3>
            <div className="space-y-3.5">
              {milestones.map((m) => (
                <div key={m.label} className="space-y-1.5">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-muted-foreground font-light">{m.label}</span>
                    <span className={`font-bold font-mono ${m.completed ? "text-neon" : "text-muted-foreground/60"}`}>
                      {m.completed ? "100%" : "0%"}
                    </span>
                  </div>
                  <div className="w-full h-1 bg-secondary/80 rounded-full">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${m.completed ? "bg-neon" : "bg-transparent"}`}
                      style={{ width: `${m.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Tiny sparkline trend graph */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="md:col-span-4 glass-panel p-5 rounded-2xl border-border/30 bg-black/35 flex flex-col justify-between"
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-xs uppercase font-bold text-foreground flex items-center gap-2">
                <Cpu className="h-3.5 w-3.5 text-neon" />
                Computation Trajectory
              </h3>
              <span className="text-[10px] text-neon font-mono font-bold">+24%</span>
            </div>
            <div className="h-16 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="tinySpark" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00f2fe" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#00f2fe" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="value" stroke="#00f2fe" strokeWidth={1.5} fill="url(#tinySpark)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <p className="text-[9px] text-muted-foreground font-light leading-relaxed mt-2">
              Evaluator activity indicates excellent optimization levels inside regional database nodes.
            </p>
          </motion.div>

          {/* Interactive Profile controls */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="md:col-span-4 glass-panel p-5 rounded-2xl border-border/30 bg-black/45 space-y-4"
          >
            <h3 className="text-xs uppercase font-bold text-foreground">Account Coordinates</h3>
            
            <div className="flex items-center gap-3">
              <div className="relative group shrink-0">
                <img
                  src={profile.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"}
                  className="w-12 h-12 rounded-full object-cover border border-neon/50"
                  alt="Avatar Preview"
                />
                <label className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center text-[8px] text-neon opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                  Upload
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatar}
                    className="hidden"
                  />
                </label>
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-foreground truncate">{profile.name}</p>
                <p className="text-[9px] text-muted-foreground truncate">{profile.email}</p>
              </div>
            </div>

            <div className="space-y-2">
              <input
                type="text"
                name="name"
                value={profile.name}
                onChange={handleChange}
                placeholder="Full Name"
                className="w-full bg-secondary/35 border border-border/60 rounded-xl px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-neon focus:ring-1 focus:ring-neon/30"
              />

              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleChange}
                placeholder="Email Address"
                className="w-full bg-secondary/35 border border-border/60 rounded-xl px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-neon focus:ring-1 focus:ring-neon/30"
              />

              <div className="grid grid-cols-2 gap-2">
                <input
                  type="password"
                  name="password"
                  value={profile.password}
                  onChange={handleChange}
                  placeholder="New Password"
                  className="w-full bg-secondary/35 border border-border/60 rounded-xl px-3 py-2 text-[10px] text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-neon focus:ring-1 focus:ring-neon/30"
                />
                <input
                  type="password"
                  name="confirmPassword"
                  value={profile.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm"
                  className="w-full bg-secondary/35 border border-border/60 rounded-xl px-3 py-2 text-[10px] text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-neon focus:ring-1 focus:ring-neon/30"
                />
              </div>
            </div>

            {validationError && (
              <p className="text-[10px] text-red-400 font-light font-mono bg-red-950/15 p-2 rounded-lg border border-red-500/25">
                ⚠ {validationError}
              </p>
            )}

            {successMsg && (
              <p className="text-[10px] text-neon font-light font-mono bg-neon/15 p-2 rounded-lg border border-neon/25">
                ✓ {successMsg}
              </p>
            )}

            <div className="grid grid-cols-2 gap-2 text-center pt-1">
              <button
                onClick={handleSave}
                className="py-1.5 rounded-lg bg-neon text-black text-[9px] font-bold glow-neon hover:opacity-90 transition-all"
              >
                Save Profile
              </button>
              <button
                onClick={handleUndo}
                className="py-1.5 rounded-lg border border-border bg-background/25 text-[9px] font-semibold text-muted-foreground hover:text-foreground transition-all"
              >
                Reset Setup
              </button>
            </div>
          </motion.div>
        </div>

        {/* PROJECTS SECTION */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-heading font-semibold">
              {t("dash.projects", "Your Projects")}
            </h2>
            <Link to="/new-project">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-neon text-black font-semibold glow-neon text-xs"
              >
                <Plus className="h-4 w-4" />
                {t("dash.newProject", "New Project")}
              </motion.button>
            </Link>
          </div>

          <div className="grid gap-3">
            {projects.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ x: 3 }}
              >
                <Link
                  to="/new-project"
                  className="glass-panel rounded-2xl p-4.5 flex items-center justify-between group block border-border/30 bg-black/25 hover:border-neon/30 transition-all"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-primary/20 border border-border/30 flex items-center justify-center">
                      <Brain className="h-4.5 w-4.5 text-neon" />
                    </div>
                    <div>
                      <div className="font-semibold text-xs group-hover:text-neon transition-colors">
                        {p.name}
                      </div>
                      <div className="text-[10px] text-muted-foreground capitalize mt-0.5">
                        {t(`dash.status.${p.status}`, p.status)}
                      </div>
                    </div>
                  </div>

                  {p.score > 0 && (
                    <div className="text-right">
                      <div className="text-sm font-bold text-gradient-gold">
                        {p.score}%
                      </div>
                      <div className="text-[10px] text-muted-foreground">
                        {t("dash.score", "Score")}
                      </div>
                    </div>
                  )}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;