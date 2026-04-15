import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { LogIn, Mail, Lock, AlertCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Login = () => {
  const { t } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const ok = await login(email, password);
    setLoading(false);
    if (ok) navigate("/dashboard");
    else setError(t("auth.invalidCredentials"));
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-20 pb-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md"
      >
        <div className="glass-panel rounded-2xl p-8 border border-border/50">
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-16 h-16 rounded-2xl bg-primary/30 flex items-center justify-center mx-auto mb-4 glow-neon"
            >
              <LogIn className="h-8 w-8 text-neon" />
            </motion.div>
            <h1 className="text-2xl font-bold font-heading">{t("auth.loginTitle")}</h1>
            <p className="text-sm text-muted-foreground mt-2">{t("auth.loginSubtitle")}</p>
          </div>

          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 rounded-lg p-3 mb-6">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-1.5 block">{t("auth.email")}</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="admin@machrou3i.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-secondary/50 border border-border/50 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-neon/30 transition-all text-sm"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground mb-1.5 block">{t("auth.password")}</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-secondary/50 border border-border/50 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-neon/30 transition-all text-sm"
                />
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 rounded-xl bg-neon text-accent-foreground font-semibold glow-neon hover:opacity-90 transition-all disabled:opacity-50"
            >
              {loading ? "..." : t("auth.loginBtn")}
            </motion.button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            {t("auth.noAccount")}{" "}
            <Link to="/signup" className="text-neon hover:underline">{t("auth.signupLink")}</Link>
          </p>

          <div className="mt-6 p-3 rounded-lg bg-secondary/30 border border-border/30">
            <p className="text-xs text-muted-foreground text-center">
              <strong className="text-neon">Admin:</strong> admin@machrou3i.com / admin123<br />
              <strong className="text-gold">User:</strong> user@machrou3i.com / user123
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
