/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Navigate, useNavigate } from "react-router-dom";
import {
  Shield,
  Users,
  FolderOpen,
  Settings,
  Ban,
  Trash2,
  Bell,
  Cpu,
  DollarSign,
  Terminal,
  ActivitySquare,
  Loader2,
  LogOut
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { localDB } from "@/lib/supabaseClient";
import AdminDashboardLayout from "@/components/AdminDashboardLayout";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { toast } from "@/hooks/use-toast";

interface ManagedUser {
  id: string;
  name: string;
  email: string;
  role: string;
  projects: number;
  blocked: boolean;
}

export default function Admin() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user, isAdmin, logout, uploadAvatar, updateProfile, changePassword } = useAuth();

  const [selectedTab, setSelectedTab] = useState<"overview" | "profile">("overview");
  const [profileName, setProfileName] = useState("");
  const [profileEmail, setProfileEmail] = useState("");
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const [usersList, setUsersList] = useState<ManagedUser[]>([
    { id: "1", name: "Ahmed Ben Ali", email: "ahmed@example.com", role: "user", projects: 5, blocked: false },
    { id: "2", name: "Marie Dubois", email: "marie@example.com", role: "user", projects: 3, blocked: false },
    { id: "3", name: "User Machrou3i", email: "user@machrou3i.com", role: "user", projects: 8, blocked: false },
    { id: "4", name: "Admin Operator", email: "admin@machrou3i.com", role: "admin", projects: 12, blocked: false }
  ]);

  const [logs, setLogs] = useState<any[]>([]);
  const [stats, setStats] = useState({
    activeUsers: 4,
    aiUsageCount: 28,
    premiumUnlockCount: 3,
    totalProjectsCount: 12
  });

  useEffect(() => {
    if (user) {
      setProfileName(user.name);
      setProfileEmail(user.email);
      setAvatarPreview(user.avatar || "");
    }
  }, [user]);

  const [notificationMsg, setNotificationMsg] = useState("");
  const [blockingUserId, setBlockingUserId] = useState<string | null>(null);

  useEffect(() => {
    if (user && isAdmin) {
      localDB.getAdminLogs().then((data) => setLogs(data));
      localDB.getSystemStats().then((data) => setStats(data));
    }
  }, [user, isAdmin]);

  if (!user) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/dashboard" replace />;

  const handleBlockUser = (userId: string) => {
    setBlockingUserId(userId);
    setTimeout(() => {
      setUsersList((prev) =>
        prev.map((u) => {
          if (u.id === userId) {
            const nextState = !u.blocked;
            toast({
              title: nextState ? "Account Suspended" : "Account Reactivated",
              description: `${u.name} status updated successfully.`
            });
            return { ...u, blocked: nextState };
          }
          return u;
        })
      );
      setBlockingUserId(null);
    }, 800);
  };

  const handleDeleteUser = (userId: string, name: string) => {
    if (confirm(`Are you absolutely sure you want to permanently delete ${name}? This action is irreversible.`)) {
      setUsersList((prev) => prev.filter((u) => u.id !== userId));
      toast({
        title: "Account Purged",
        description: `${name} has been removed from all databases.`,
        variant: "destructive"
      });
    }
  };

  const handleBroadcastNotification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notificationMsg) return;
    toast({
      title: "Global Broadcast Sent",
      description: `Push notification dispatched: "${notificationMsg}"`
    });
    setNotificationMsg("");
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setProfileLoading(true);

    const success = await updateProfile({ name: profileName, avatar: avatarPreview });
    if (success) {
      toast({
        title: "Profile Updated",
        description: "Your admin profile and display settings are now saved.",
      });
    } else {
      toast({
        title: "Update Failed",
        description: "Unable to save profile updates right now. Please try again.",
        variant: "destructive",
      });
    }

    setProfileLoading(false);
  };

  const handleAvatarUpload = async (file: File) => {
    if (!user) return;
    setProfileLoading(true);
    const publicUrl = await uploadAvatar(file);
    if (publicUrl) {
      setAvatarPreview(publicUrl);
      const saved = await updateProfile({ avatar: publicUrl });
      if (saved) {
        toast({
          title: "Avatar Updated",
          description: "Your admin avatar is now connected to Supabase storage.",
        });
      }
    } else {
      toast({
        title: "Upload Failed",
        description: "Avatar upload did not complete. Check your network or bucket settings.",
        variant: "destructive",
      });
    }
    setProfileLoading(false);
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) return;
    setPasswordLoading(true);

    const success = await changePassword(currentPassword, newPassword);
    if (success) {
      toast({
        title: "Password Changed",
        description: "Your admin password has been refreshed successfully.",
      });
      setCurrentPassword("");
      setNewPassword("");
    } else {
      toast({
        title: "Password Change Failed",
        description: "Current password was not recognized or update could not be completed.",
        variant: "destructive",
      });
    }

    setPasswordLoading(false);
  };

  // Structured metrics charts
  const analyticsData = [
    { name: "Mon", Users: 120, AI: 45, Unlocks: 1 },
    { name: "Tue", Users: 150, AI: 60, Unlocks: 2 },
    { name: "Wed", Users: 240, AI: 95, Unlocks: 3 },
    { name: "Thu", Users: 180, AI: 70, Unlocks: 1 },
    { name: "Fri", Users: 290, AI: 120, Unlocks: 4 },
    { name: "Sat", Users: 310, AI: 140, Unlocks: 6 },
    { name: "Sun", Users: 280, AI: 110, Unlocks: 5 }
  ];

  return (
    <AdminDashboardLayout title={t("admin.title", "Administrator OS")} subtitle={t("admin.subtitle", "Secure operations, role management, and self-service admin controls.")}>
      <div className="space-y-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-destructive/10 border border-destructive/20 flex items-center justify-center glow-neon">
              <Shield className="h-6 w-6 text-destructive" />
            </div>
            <div>
              <h1 className="text-3xl font-bold font-heading text-gradient-neon">{t("admin.title")}</h1>
              <p className="text-sm text-muted-foreground">{t("admin.subtitle")}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={async () => {
              await logout();
              navigate("/login");
            }}
            className="inline-flex items-center gap-2 rounded-xl border border-border/50 bg-secondary/70 px-4 py-2 text-xs font-semibold text-muted-foreground hover:bg-secondary/90 hover:text-destructive transition-all"
          >
            <LogOut className="h-4 w-4" />
            {t("nav.logout", "Logout")}
          </button>
        </motion.div>

        <div className="flex flex-wrap items-center justify-between gap-3 px-4 md:px-0">
          <div className="text-sm text-muted-foreground">Secure admin operations, audit trails, and profile controls.</div>
          <div className="flex flex-wrap gap-2">
            {[
              { key: "overview", label: "Overview" },
              { key: "profile", label: "Profile" },
            ].map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setSelectedTab(tab.key as "overview" | "profile")}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                  selectedTab === tab.key
                    ? "bg-neon text-black shadow-neon/30"
                    : "bg-secondary/70 text-muted-foreground hover:bg-secondary/90"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Real-time cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {[
            { icon: Users, label: "Active Users", value: stats.activeUsers, color: "text-neon", bg: "bg-neon/5" },
            { icon: FolderOpen, label: "System Projects", value: stats.totalProjectsCount, color: "text-gold", bg: "bg-gold/5" },
            { icon: Cpu, label: "AI API Invocations", value: stats.aiUsageCount, color: "text-neon", bg: "bg-neon/5" },
            { icon: DollarSign, label: "Premium Conversions", value: stats.premiumUnlockCount, color: "text-gold", bg: "bg-gold/5" }
          ].map((c, i) => (
            <motion.div
              key={c.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-panel p-5 rounded-2xl flex items-center gap-4 border-border/30 bg-black/40"
            >
              <div className={`w-11 h-11 rounded-xl ${c.bg} flex items-center justify-center border border-border/40`}>
                <c.icon className={`h-5 w-5 ${c.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{c.value}</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold mt-0.5">{c.label}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Analytics Charts Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="glass-panel p-5 rounded-2xl border-border/30 bg-black/35 flex flex-col justify-between">
            <h3 className="text-xs uppercase text-muted-foreground font-semibold mb-4 flex items-center gap-2">
              <ActivitySquare className="h-4 w-4 text-neon" />
              Visitor & Activity Analytics
            </h3>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analyticsData}>
                  <defs>
                    <linearGradient id="adminUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00f2fe" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#00f2fe" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" stroke="#71717a" fontSize={9} />
                  <YAxis stroke="#71717a" fontSize={9} />
                  <Tooltip contentStyle={{ backgroundColor: "#141416", borderColor: "#27272a", fontSize: 10 }} />
                  <Area type="monotone" dataKey="Users" stroke="#00f2fe" fillOpacity={1} fill="url(#adminUsers)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass-panel p-5 rounded-2xl border-border/30 bg-black/35 flex flex-col justify-between">
            <h3 className="text-xs uppercase text-muted-foreground font-semibold mb-4 flex items-center gap-2">
              <Cpu className="h-4 w-4 text-gold" />
              AI System Consumption Stats
            </h3>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analyticsData}>
                  <XAxis dataKey="name" stroke="#71717a" fontSize={9} />
                  <YAxis stroke="#71717a" fontSize={9} />
                  <Tooltip contentStyle={{ backgroundColor: "#141416", borderColor: "#27272a", fontSize: 10 }} />
                  <Bar dataKey="AI" fill="#00f2fe" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-12 gap-6 items-stretch">
          {selectedTab === "overview" ? (
            <div className="md:col-span-8 glass-panel rounded-2xl overflow-hidden border-border/30 bg-black/25">
              <div className="p-5 border-b border-border/50 flex items-center justify-between">
                <h2 className="text-sm font-bold font-heading flex items-center gap-2">
                  <Settings className="h-4.5 w-4.5 text-muted-foreground" />
                  {t("admin.userManagement")}
                </h2>
              </div>
              <div className="divide-y divide-border/20">
                {usersList.map((u) => (
                  <div key={u.email} className="flex flex-col sm:flex-row sm:items-center justify-between px-5 py-4 gap-3 hover:bg-white/[0.02] transition-colors">
                    <div>
                      <div className="font-semibold text-xs flex items-center gap-2">
                        {u.name}
                        {u.blocked && (
                          <span className="inline-flex items-center gap-0.5 text-[8px] bg-red-500/10 text-red-400 border border-red-500/20 px-1.5 py-0.5 rounded font-mono font-bold uppercase">
                            <Ban className="h-2 w-2" /> Suspended
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-muted-foreground mt-0.5">{u.email}</div>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-4">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${u.role === "admin" ? "bg-red-500/10 text-red-400" : "bg-neon/15 text-neon"}`}>
                        {u.role.toUpperCase()}
                      </span>
                      <span className="text-[10px] text-muted-foreground">{u.projects} projects</span>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleBlockUser(u.id)}
                          disabled={blockingUserId !== null}
                          className={`p-1.5 rounded-lg border transition-colors ${
                            u.blocked
                              ? "bg-red-500/15 border-red-500/40 text-red-400 hover:bg-red-500/25"
                              : "bg-secondary/40 border-transparent text-muted-foreground hover:text-red-400 hover:border-red-500/30"
                          }`}
                          title={u.blocked ? "Reactivate User" : "Suspend User"}
                        >
                          {blockingUserId === u.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Ban className="h-3.5 w-3.5" />}
                        </button>
                        <button
                          onClick={() => handleDeleteUser(u.id, u.name)}
                          className="p-1.5 rounded-lg bg-secondary/40 text-muted-foreground hover:text-red-400 hover:border-red-500/30 border border-transparent transition-colors"
                          title="Delete User permanently"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="md:col-span-8 glass-panel rounded-2xl overflow-hidden border-border/30 bg-black/25">
              <div className="p-5 border-b border-border/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-sm font-bold font-heading flex items-center gap-2">
                    <Shield className="h-4.5 w-4.5 text-neon" />
                    Admin Profile Settings
                  </h2>
                  <p className="text-[11px] text-muted-foreground">Manage your admin identity, avatar, and secure access policies.</p>
                </div>
                <span className="inline-flex items-center gap-2 rounded-full bg-green-500/10 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-green-300 border border-green-500/30">
                  Admin Mode
                </span>
              </div>
              <div className="p-5 space-y-6">
                <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
                  <div className="rounded-3xl border border-border/30 bg-slate-950/80 p-5">
                    <div className="flex flex-col items-center gap-3 text-center">
                      <div className="relative">
                        {avatarPreview ? (
                          <img
                            src={avatarPreview}
                            alt="Admin avatar"
                            className="h-28 w-28 rounded-full border border-border/50 object-cover"
                          />
                        ) : (
                          <div className="h-28 w-28 rounded-full border border-border/50 bg-white/5 flex items-center justify-center text-[11px] text-muted-foreground">
                            No avatar
                          </div>
                        )}
                        <label className="absolute -bottom-1 right-0 inline-flex cursor-pointer items-center gap-2 rounded-full bg-neon px-3 py-1 text-[11px] font-semibold text-black shadow-neon/25">
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(event) => {
                              if (event.target.files?.[0]) {
                                handleAvatarUpload(event.target.files[0]);
                              }
                            }}
                          />
                          {profileLoading ? "Uploading..." : "Change Avatar"}
                        </label>
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{user?.name}</p>
                        <p className="text-[11px] text-muted-foreground">{user?.email}</p>
                      </div>
                    </div>
                  </div>

                  <form onSubmit={handleSaveProfile} className="space-y-4 rounded-3xl border border-border/30 bg-slate-950/80 p-6">
                    <div>
                      <label className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Full Name</label>
                      <input
                        value={profileName}
                        onChange={(event) => setProfileName(event.target.value)}
                        className="mt-2 w-full rounded-2xl border border-border/30 bg-black/70 px-4 py-3 text-sm text-foreground outline-none transition focus:border-neon focus:ring-2 focus:ring-neon/20"
                        placeholder="Admin Name"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Email</label>
                      <input
                        value={profileEmail}
                        readOnly
                        className="mt-2 w-full rounded-2xl border border-border/30 bg-secondary/30 px-4 py-3 text-sm text-foreground outline-none"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={profileLoading}
                      className="w-full rounded-2xl bg-neon px-4 py-3 text-sm font-semibold text-black transition hover:opacity-95"
                    >
                      {profileLoading ? "Saving profile..." : "Save Admin Profile"}
                    </button>
                  </form>
                </div>

                <section className="rounded-3xl border border-border/30 bg-slate-950/80 p-6">
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Password Security</p>
                      <p className="text-[11px] text-muted-foreground mt-1">Re-authenticate before you change your admin password.</p>
                    </div>
                    <span className="text-[11px] text-neon">Secure</span>
                  </div>
                  <form onSubmit={handlePasswordChange} className="space-y-4">
                    <div>
                      <label className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Current Password</label>
                      <input
                        type="password"
                        value={currentPassword}
                        onChange={(event) => setCurrentPassword(event.target.value)}
                        className="mt-2 w-full rounded-2xl border border-border/30 bg-black/70 px-4 py-3 text-sm text-foreground outline-none transition focus:border-neon focus:ring-2 focus:ring-neon/20"
                        placeholder="••••••••"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">New Password</label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(event) => setNewPassword(event.target.value)}
                        className="mt-2 w-full rounded-2xl border border-border/30 bg-black/70 px-4 py-3 text-sm text-foreground outline-none transition focus:border-neon focus:ring-2 focus:ring-neon/20"
                        placeholder="New secure password"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={passwordLoading}
                      className="w-full rounded-2xl bg-gold px-4 py-3 text-sm font-semibold text-black transition hover:opacity-95"
                    >
                      {passwordLoading ? "Updating password..." : "Update Password"}
                    </button>
                  </form>
                </section>
              </div>
            </div>
          )}

          {/* Activity Logs & Global Broadcast Notifications */}
          <div className="md:col-span-4 flex flex-col gap-6">
            {/* Broadcast card */}
            <div className="glass-panel p-5 rounded-2xl border-border/30 bg-black/45 space-y-4">
              <h3 className="text-xs uppercase font-bold text-foreground flex items-center gap-2">
                <Bell className="h-4 w-4 text-neon" />
                Global Broadcast
              </h3>
              <form onSubmit={handleBroadcastNotification} className="space-y-3">
                <textarea
                  placeholder="Broadcast message to all active dashboards..."
                  value={notificationMsg}
                  onChange={(e) => setNotificationMsg(e.target.value)}
                  className="w-full bg-secondary/35 border border-border/60 rounded-xl px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-neon focus:ring-1 focus:ring-neon/30 h-16 resize-none"
                  required
                />
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl text-xs font-semibold bg-neon text-black glow-neon hover:opacity-95 transition-all"
                >
                  Send Push Notification
                </button>
              </form>
            </div>

            {/* Event logs card */}
            <div className="glass-panel p-5 rounded-2xl border-border/30 bg-black/25 flex-1 flex flex-col justify-between">
              <h3 className="text-xs uppercase font-bold text-foreground flex items-center gap-2 mb-3">
                <Terminal className="h-4 w-4 text-neon" />
                Event Audit Logs
              </h3>
              <div className="space-y-2 max-h-56 overflow-y-auto custom-scroll pr-1 flex-1">
                {logs.length === 0 ? (
                  <p className="text-[10px] text-muted-foreground font-light">No platform actions logged yet.</p>
                ) : (
                  logs.map((log) => (
                    <div key={log.id} className="p-2 rounded bg-black/20 border border-border/10">
                      <p className="text-[9px] text-foreground font-mono truncate">{log.action.toUpperCase()}</p>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-[8px] text-muted-foreground">ID: {log.user_id}</span>
                        <span className="text-[8px] text-neon/70 font-mono">
                          {new Date(log.created_at).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminDashboardLayout>
  );
}
