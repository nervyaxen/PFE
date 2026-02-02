import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { LogIn, Sparkles, Shield, Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { useI18n } from "@/i18n";

export default function AuthSection() {
  const reduceMotion = useReducedMotion();
  const { t } = useI18n();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    confirmPassword: "",
  });

  return (
    <section id="auth" className="relative min-h-screen px-6 py-16 md:py-20" aria-label="Login / Signup">
      <div className="mx-auto max-w-4xl">
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-2" data-narrate="Onboarding Flow|Onboarding that feels weightless.">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-primary">
              <LogIn className="h-5 w-5" />
            </span>
            <p className="text-xs font-semibold tracking-wide text-muted-foreground">{t("auth.eyebrow")}</p>
          </div>

          <motion.h2
            className="mt-5 text-balance text-3xl font-semibold leading-tight md:text-4xl"
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            data-narrate="Onboarding that feels weightless|Glassmorphic forms with neon focus—designed for conversion and calm."
          >
            Onboarding that feels weightless.
          </motion.h2>
          <p className="mt-3 mx-auto max-w-2xl text-pretty text-base text-muted-foreground">
            Glassmorphic forms with neon focus—designed for conversion and calm.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Auth Form */}
          <motion.div
            className="glass rounded-[2rem] p-6"
            initial={reduceMotion ? false : { opacity: 0, x: -20 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            data-narrate="Authentication Form|Smooth switching between login and signup as a single cinematic flow."
          >
            <div className="mb-6 flex gap-2">
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
                  isLogin
                    ? "bg-primary text-primary-foreground"
                    : "glass glass-hover"
                }`}
                data-narrate="Login|Switch to login form"
              >
                {t("nav.login")}
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
                  !isLogin
                    ? "bg-primary text-primary-foreground"
                    : "glass glass-hover"
                }`}
                data-narrate="Signup|Switch to signup form"
              >
                {t("nav.signup")}
              </button>
            </div>

            <motion.form
              className="space-y-4"
              initial={false}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {!isLogin && (
                <motion.div
                  initial={reduceMotion ? false : { opacity: 0, height: 0 }}
                  animate={reduceMotion ? undefined : { opacity: 1, height: "auto" }}
                  exit={reduceMotion ? undefined : { opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <label className="mb-2 block text-xs font-medium text-muted-foreground" data-narrate="Name Field|Enter your full name">
                    {t("labels.name")}
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="glass glass-hover w-full rounded-xl border border-border bg-surface/40 px-10 py-3 text-sm focus:border-neon focus:outline-none focus:ring-2 focus:ring-neon/20"
                      placeholder={t("placeholders.name")}
                    />
                  </div>
                </motion.div>
              )}

              <div>
                <label className="mb-2 block text-xs font-medium text-muted-foreground" data-narrate="Email Field|Enter your email address">
                  {t("labels.email")}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="glass glass-hover w-full rounded-xl border border-border bg-surface/40 px-10 py-3 text-sm focus:border-neon focus:outline-none focus:ring-2 focus:ring-neon/20"
                    placeholder={t("placeholders.email")}
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs font-medium text-muted-foreground" data-narrate="Password Field|Enter your secure password">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="glass glass-hover w-full rounded-xl border border-border bg-surface/40 px-10 py-3 pr-10 text-sm focus:border-neon focus:outline-none focus:ring-2 focus:ring-neon/20"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    data-narrate="Toggle Password|Show or hide password"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {!isLogin && (
                <motion.div
                  initial={reduceMotion ? false : { opacity: 0, height: 0 }}
                  animate={reduceMotion ? undefined : { opacity: 1, height: "auto" }}
                  exit={reduceMotion ? undefined : { opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <label className="mb-2 block text-xs font-medium text-muted-foreground" data-narrate="Confirm Password|Re-enter your password">
                    {t("labels.confirmPassword")}
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className="glass glass-hover w-full rounded-xl border border-border bg-surface/40 px-10 py-3 text-sm focus:border-neon focus:outline-none focus:ring-2 focus:ring-neon/20"
                      placeholder={t("placeholders.password")}
                    />
                  </div>
                </motion.div>
              )}

              {isLogin && (
                <div className="flex items-center justify-between text-xs">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded border-border" />
                    <span className="text-muted-foreground">{t("labels.rememberMe")}</span>
                  </label>
                  <a href="#" className="text-neon hover:underline" data-narrate="Forgot Password|Reset your password">
                    {t("labels.forgotPassword")}
                  </a>
                </div>
              )}

              <motion.button
                type="submit"
                className="w-full rounded-xl bg-neon px-4 py-3 text-sm font-semibold text-neon-foreground transition-all hover:bg-neon/90"
                whileHover={reduceMotion ? undefined : { scale: 1.02 }}
                whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                data-narrate={`${isLogin ? "Login" : "Sign Up"}|${isLogin ? "Access your account" : "Create your account"}`}
              >
                {isLogin ? t("nav.login") : t("nav.signup")}
              </motion.button>
            </motion.form>
          </motion.div>

          {/* Security Features */}
          <div className="space-y-6">
            <motion.div
              className="glass rounded-[2rem] p-6"
              initial={reduceMotion ? false : { opacity: 0, x: 20 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              data-narrate="Security Features|JWT + RBAC ready (architecture section below)."
            >
              <div className="mb-4 flex items-center gap-2">
                <Shield className="h-5 w-5 text-neon" />
                <h3 className="text-lg font-semibold">{t("auth.secureAuth")}</h3>
              </div>

              <div className="space-y-3">
                {[
                  { featureKey: "auth.jwtAuth", descKey: "auth.jwtAuthDesc" },
                  { featureKey: "auth.rbac", descKey: "auth.rbacDesc" },
                  { featureKey: "auth.encryptedStorage", descKey: "auth.encryptedStorageDesc" },
                  { featureKey: "auth.twoFactor", descKey: "auth.twoFactorDesc" },
                ].map((item, idx) => (
                  <motion.div
                    key={idx}
                    className="flex items-start gap-3"
                    initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                    whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: idx * 0.1 }}
                    data-narrate={`${t(item.featureKey)}|${t(item.descKey)}`}
                  >
                    <div className="mt-0.5 h-2 w-2 rounded-full bg-neon" />
                    <div>
                      <p className="text-sm font-medium">{t(item.featureKey)}</p>
                      <p className="text-xs text-muted-foreground">{t(item.descKey)}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              className="glass rounded-[2rem] p-6"
              initial={reduceMotion ? false : { opacity: 0, y: 20 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              data-narrate="Demo UI|We can wire real authentication when you're ready."
            >
              <div className="mb-4 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-gold" />
                <h3 className="text-lg font-semibold">{t("auth.guidedFocus")}</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                {t("auth.guidedFocusDesc")}
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
