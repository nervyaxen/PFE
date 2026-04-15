import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { CreditCard, Lock, Shield, CheckCircle, Sparkles } from "lucide-react";
import { z } from "zod";

const cardSchema = z.object({
  name: z.string().trim().min(2).max(100),
  number: z.string().regex(/^\d{4}\s?\d{4}\s?\d{4}\s?\d{4}$/, "Invalid card number"),
  expiry: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "MM/YY format"),
  cvc: z.string().regex(/^\d{3,4}$/, "3-4 digits"),
});

const plans = [
  { id: "free", price: 0 },
  { id: "pro", price: 29, popular: true },
  { id: "enterprise", price: 99 },
];

const Payment = () => {
  const { t } = useTranslation();
  const [selected, setSelected] = useState("pro");
  const [form, setForm] = useState({ name: "", number: "", expiry: "", cvc: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const formatCard = (v: string) => {
    const digits = v.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
  };

  const formatExpiry = (v: string) => {
    const digits = v.replace(/\D/g, "").slice(0, 4);
    if (digits.length > 2) return digits.slice(0, 2) + "/" + digits.slice(2);
    return digits;
  };

  const update = (field: string, value: string) => {
    let formatted = value;
    if (field === "number") formatted = formatCard(value);
    if (field === "expiry") formatted = formatExpiry(value);
    if (field === "cvc") formatted = value.replace(/\D/g, "").slice(0, 4);
    setForm(prev => ({ ...prev, [field]: formatted }));
    setErrors(prev => ({ ...prev, [field]: "" }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = cardSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach(err => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setSuccess(true);
    }, 2500);
  };

  const plan = plans.find(p => p.id === selected)!;

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="container mx-auto max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel text-neon text-sm mb-4">
            <Shield className="h-4 w-4" />
            {t("payment.badge")}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold font-heading text-gradient-neon mb-3">{t("payment.title")}</h1>
          <p className="text-muted-foreground text-sm max-w-lg mx-auto">{t("payment.subtitle")}</p>
        </motion.div>

        <AnimatePresence mode="wait">
          {success ? (
            <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              className="glass-panel rounded-2xl p-12 text-center max-w-md mx-auto"
            >
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", damping: 10 }}>
                <CheckCircle className="h-16 w-16 text-neon mx-auto mb-4" />
              </motion.div>
              <h2 className="text-xl font-bold font-heading text-foreground mb-2">{t("payment.successTitle")}</h2>
              <p className="text-sm text-muted-foreground">{t("payment.successDesc")}</p>
            </motion.div>
          ) : (
            <motion.div key="form" className="grid md:grid-cols-5 gap-6">
              {/* Plan Selection */}
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="md:col-span-2 space-y-3">
                <p className="text-sm font-medium text-foreground mb-2">{t("payment.selectPlan")}</p>
                {plans.map((p, i) => (
                  <motion.button key={p.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                    onClick={() => setSelected(p.id)}
                    className={`w-full text-start p-4 rounded-xl transition-all duration-300 ${
                      selected === p.id
                        ? "glass-panel glow-neon border-neon/30"
                        : "glass-panel hover:border-muted-foreground/30"
                    }`}
                    style={{ transformStyle: "preserve-3d", transform: selected === p.id ? "perspective(600px) rotateY(-2deg) scale(1.02)" : "none" }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`text-sm font-semibold ${selected === p.id ? "text-neon" : "text-foreground"}`}>
                          {t(`pricing.${p.id}.name`)}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">{t(`pricing.${p.id}.desc`)}</p>
                      </div>
                      <p className="text-lg font-bold text-foreground">${p.price}<span className="text-xs text-muted-foreground">{t("pricing.per")}</span></p>
                    </div>
                    {p.popular && (
                      <span className="inline-block mt-2 px-2 py-0.5 text-[10px] font-semibold rounded-full bg-neon/20 text-neon">
                        {t("pricing.pro.badge")}
                      </span>
                    )}
                  </motion.button>
                ))}

                {/* Security badges */}
                <div className="flex items-center gap-3 pt-3">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Lock className="h-3 w-3" />
                    <span className="text-[10px]">{t("payment.encrypted")}</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Shield className="h-3 w-3" />
                    <span className="text-[10px]">{t("payment.secure")}</span>
                  </div>
                </div>
              </motion.div>

              {/* Payment Form */}
              <motion.form initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}
                onSubmit={handleSubmit}
                className="md:col-span-3 glass-panel rounded-2xl p-6"
                style={{ transformStyle: "preserve-3d", transform: "perspective(800px) rotateY(1deg)" }}
              >
                <div className="flex items-center gap-2 mb-6">
                  <CreditCard className="h-4 w-4 text-neon" />
                  <span className="text-sm font-medium text-foreground">{t("payment.cardDetails")}</span>
                </div>

                <div className="space-y-4">
                  {/* Name */}
                  <div>
                    <label className="text-xs text-muted-foreground mb-1.5 block">{t("payment.nameOnCard")}</label>
                    <input value={form.name} onChange={e => update("name", e.target.value)}
                      className={`w-full bg-background/50 border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 transition-all ${errors.name ? "border-destructive" : "border-border"}`}
                      placeholder="John Doe" maxLength={100}
                    />
                    {errors.name && <p className="text-[10px] text-destructive mt-1">{errors.name}</p>}
                  </div>

                  {/* Card Number */}
                  <div>
                    <label className="text-xs text-muted-foreground mb-1.5 block">{t("payment.cardNumber")}</label>
                    <input value={form.number} onChange={e => update("number", e.target.value)}
                      className={`w-full bg-background/50 border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 transition-all tracking-widest ${errors.number ? "border-destructive" : "border-border"}`}
                      placeholder="4242 4242 4242 4242" inputMode="numeric"
                    />
                    {errors.number && <p className="text-[10px] text-destructive mt-1">{errors.number}</p>}
                  </div>

                  {/* Expiry + CVC */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-muted-foreground mb-1.5 block">{t("payment.expiry")}</label>
                      <input value={form.expiry} onChange={e => update("expiry", e.target.value)}
                        className={`w-full bg-background/50 border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 transition-all ${errors.expiry ? "border-destructive" : "border-border"}`}
                        placeholder="MM/YY" inputMode="numeric"
                      />
                      {errors.expiry && <p className="text-[10px] text-destructive mt-1">{errors.expiry}</p>}
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground mb-1.5 block">{t("payment.cvc")}</label>
                      <input value={form.cvc} onChange={e => update("cvc", e.target.value)}
                        className={`w-full bg-background/50 border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 transition-all ${errors.cvc ? "border-destructive" : "border-border"}`}
                        placeholder="123" inputMode="numeric" type="password"
                      />
                      {errors.cvc && <p className="text-[10px] text-destructive mt-1">{errors.cvc}</p>}
                    </div>
                  </div>
                </div>

                {/* Summary + Pay */}
                <div className="mt-6 pt-4 border-t border-border/50">
                  <div className="flex items-center justify-between text-sm mb-4">
                    <span className="text-muted-foreground">{t(`pricing.${selected}.name`)}</span>
                    <span className="font-bold text-foreground">${plan.price}{t("pricing.per")}</span>
                  </div>
                  <button type="submit" disabled={processing}
                    className="w-full py-3 rounded-xl font-semibold text-sm bg-neon text-accent-foreground hover:opacity-90 disabled:opacity-40 transition-all glow-neon flex items-center justify-center gap-2"
                  >
                    {processing ? (
                      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                        <Sparkles className="h-4 w-4" />
                      </motion.div>
                    ) : (
                      <Lock className="h-4 w-4" />
                    )}
                    {processing ? t("payment.processing") : t("payment.payNow")}
                  </button>
                </div>
              </motion.form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Payment;
