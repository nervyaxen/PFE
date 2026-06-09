import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { CreditCard, Lock, Shield, CheckCircle, Sparkles, Smartphone, Landmark, HelpCircle, Check, AlertCircle } from "lucide-react";
import { z } from "zod";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

const cardSchema = z.object({
  name: z.string().trim().min(2).max(100),
  number: z.string().regex(/^\d{4}\s?\d{4}\s?\d{4}\s?\d{4}$/, "Invalid card number"),
  expiry: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "MM/YY format"),
  cvc: z.string().regex(/^\d{3,4}$/, "3-4 digits"),
});

const flouciSchema = z.object({
  phone: z.string().regex(/^\+216\s?\d{8}$/, "Must be a valid Tunisian number (+216 12345678)"),
});

const plans = [
  { id: "free", price: 0 },
  { id: "pro", price: 29, popular: true },
  { id: "enterprise", price: 99 },
];

export default function Payment() {
  const { t } = useTranslation();
  const { unlockPremium } = useAuth();

  const [selectedPlan, setSelectedPlan] = useState("pro");
  const [paymentMethod, setPaymentMethod] = useState("card"); // card, flouci, wallet
  const [form, setForm] = useState({ name: "", number: "", expiry: "", cvc: "" });
  const [flouciPhone, setFlouciPhone] = useState("+216 ");
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [failAnimation, setFailAnimation] = useState(false);

  const formatCard = (v: string) => {
    const digits = v.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
  };

  const formatExpiry = (v: string) => {
    const digits = v.replace(/\D/g, "").slice(0, 4);
    if (digits.length > 2) return digits.slice(0, 2) + "/" + digits.slice(2);
    return digits;
  };

  const applyTestValues = (field: string, value: string) => {
    if (value.toLowerCase() === "test") {
      if (field === "name") return "John Doe";
      if (field === "number") return "4242 4242 4242 4242";
      if (field === "expiry") return "12/34";
      if (field === "cvc") return "123";
    }
    return value;
  };

  const update = (field: string, value: string) => {
    let formatted = value;
    formatted = applyTestValues(field, formatted);

    if (field === "number") formatted = formatCard(formatted);
    if (field === "expiry") formatted = formatExpiry(formatted);
    if (field === "cvc") formatted = formatted.replace(/\D/g, "").slice(0, 4);

    setForm(prev => ({ ...prev, [field]: formatted }));
    setErrors(prev => ({ ...prev, [field]: "" }));
  };

  const handleFlouciTestFill = (value: string) => {
    if (value.toLowerCase() === "test") {
      setFlouciPhone("+216 98765432");
    } else {
      setFlouciPhone(value);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setFailAnimation(false);

    if (paymentMethod === "card") {
      const result = cardSchema.safeParse(form);
      if (!result.success) {
        const fieldErrors: Record<string, string> = {};
        result.error.errors.forEach(err => {
          if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
        });
        setErrors(fieldErrors);
        setFailAnimation(true);
        return;
      }
    } else if (paymentMethod === "flouci") {
      const result = flouciSchema.safeParse({ phone: flouciPhone.trim() });
      if (!result.success) {
        setErrors({ phone: result.error.errors[0].message });
        setFailAnimation(true);
        return;
      }
    }

    setProcessing(true);
    setTimeout(async () => {
      try {
        await unlockPremium();
        setProcessing(false);
        setSuccess(true);
        toast({
          title: "Premium Unlocked! 🔒🚀",
          description: "All premium enterprise metrics and custom showrooms have been enabled successfully.",
        });
      } catch (err) {
        console.error("Premium unlock failed", err);
        setProcessing(false);
        setFailAnimation(true);
      }
    }, 2200);
  };

  const plan = plans.find(p => p.id === selectedPlan)!;

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 bg-gradient-hero">
      <div className="container mx-auto max-w-4xl space-y-8">
        
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel text-neon text-xs mb-4 uppercase tracking-wider font-mono">
            <Shield className="h-4 w-4" />
            TUNISIA INTEGRATED SECURE GATE
          </div>
          <h1 className="text-3xl md:text-4xl font-bold font-heading text-gradient-neon mb-3">Upgrade Your Project</h1>
          <p className="text-muted-foreground text-xs md:text-sm max-w-lg mx-auto">
            Choose your corporate plan, select a secure local or international checkout channel, and compile your insights.
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {success ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-panel rounded-2xl p-12 text-center max-w-md mx-auto border-neon/30 glow-neon"
            >
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", damping: 10 }}>
                <CheckCircle className="h-16 w-16 text-neon mx-auto mb-4" />
              </motion.div>
              <h2 className="text-xl font-bold font-heading text-foreground mb-2">Payment Successful!</h2>
              <p className="text-sm text-muted-foreground mb-4">Your premium subscription is now active. Welcome to Machrou3i Pro.</p>
              <span className="text-[10px] uppercase font-mono tracking-widest text-neon animate-pulse block">ALL GATEWAYS UNLOCKED</span>
            </motion.div>
          ) : (
            <div className="grid md:grid-cols-12 gap-8 items-stretch">
              
              {/* Left Column: Plan Select + Method Select */}
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="md:col-span-5 space-y-6">
                
                {/* 1. Plan Selector */}
                <div className="space-y-3">
                  <h3 className="text-xs uppercase font-bold text-muted-foreground tracking-wider">1. Select Subscription Tier</h3>
                  {plans.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setSelectedPlan(p.id)}
                      className={`w-full text-start p-4 rounded-xl transition-all duration-300 ${
                        selectedPlan === p.id
                          ? "glass-panel glow-neon border-neon/40 bg-black/40"
                          : "glass-panel hover:border-border/60"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className={`text-xs font-bold ${selectedPlan === p.id ? "text-neon" : "text-foreground"}`}>
                            {p.id === "free" ? "Explorer Plan" : p.id === "pro" ? "Professional Pro" : "Enterprise Hub"}
                          </p>
                          <p className="text-[9px] text-muted-foreground mt-0.5">Full AI limits & history logs</p>
                        </div>
                        <p className="text-sm font-bold text-foreground">${p.price}<span className="text-[9px] text-muted-foreground">/mo</span></p>
                      </div>
                    </button>
                  ))}
                </div>

                {/* 2. Tunisia / Global Payment Method Switcher */}
                <div className="space-y-3">
                  <h3 className="text-xs uppercase font-bold text-muted-foreground tracking-wider">2. Payment Gateway Method</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "card", label: "CB / Card", icon: CreditCard },
                      { id: "flouci", label: "Flouci / Wallet", icon: Smartphone },
                      { id: "wallet", label: "Google / Apple Pay", icon: Landmark }
                    ].map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => { setPaymentMethod(m.id); setErrors({}); }}
                        className={`p-3.5 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
                          paymentMethod === m.id
                            ? "border-neon bg-neon/10 text-neon font-bold"
                            : "border-border/40 bg-secondary/15 text-muted-foreground hover:text-foreground hover:border-border"
                        }`}
                      >
                        <m.icon className="h-4.5 w-4.5" />
                        <span className="text-[9px] font-semibold leading-tight">{m.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Secure Trust indicators */}
                <div className="p-4 rounded-xl bg-black/20 border border-border/30 space-y-2">
                  <div className="flex items-center gap-2 text-muted-foreground text-[10px]">
                    <Lock className="h-3 w-3 text-neon" />
                    <span>256-bit encrypted SSL checkout connection.</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground text-[10px]">
                    <Shield className="h-3 w-3 text-neon" />
                    <span>Compliant with CIB and Stripe security frameworks.</span>
                  </div>
                </div>

              </motion.div>

              {/* Right Column: Checkout form parameters */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`md:col-span-7 glass-panel rounded-2xl p-6 bg-black/45 flex flex-col justify-between border-border/30 ${
                  failAnimation ? "border-red-500/50 animate-shake" : ""
                }`}
              >
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="flex justify-between items-center pb-2 border-b border-border/20">
                    <span className="text-xs uppercase font-bold text-foreground tracking-wider flex items-center gap-1.5">
                      <Landmark className="h-4 w-4 text-neon" />
                      Gateway Billing Invoice
                    </span>
                    <div className="flex items-center gap-1">
                      {/* Tunisia local flags or visual indicators */}
                      <span className="text-[9px] font-mono text-muted-foreground bg-secondary/60 px-2 py-0.5 rounded">TND Optimized</span>
                    </div>
                  </div>

                  <AnimatePresence mode="wait">
                    {/* Method 1: Credit Card / CB */}
                    {paymentMethod === "card" && (
                      <motion.div
                        key="card-form"
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="space-y-4"
                      >
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase text-muted-foreground tracking-wider block">Cardholder Name</label>
                          <input
                            type="text"
                            placeholder="John Doe (type 'test' to auto fill)"
                            value={form.name}
                            onChange={(e) => update("name", e.target.value)}
                            className={`w-full bg-secondary/25 border rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none focus:border-neon ${
                              errors.name ? "border-red-500/50" : "border-border/60"
                            }`}
                          />
                          {errors.name && <p className="text-[9px] text-red-400 font-mono">{errors.name}</p>}
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] uppercase text-muted-foreground tracking-wider block">Credit Card Number</label>
                          <input
                            type="text"
                            placeholder="4242 4242 4242 4242"
                            value={form.number}
                            onChange={(e) => update("number", e.target.value)}
                            className={`w-full bg-secondary/25 border rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none focus:border-neon tracking-widest ${
                              errors.number ? "border-red-500/50" : "border-border/60"
                            }`}
                          />
                          {errors.number && <p className="text-[9px] text-red-400 font-mono">{errors.number}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-[10px] uppercase text-muted-foreground tracking-wider block">Expiration Date</label>
                            <input
                              type="text"
                              placeholder="MM/YY"
                              value={form.expiry}
                              onChange={(e) => update("expiry", e.target.value)}
                              className={`w-full bg-secondary/25 border rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none focus:border-neon text-center ${
                                errors.expiry ? "border-red-500/50" : "border-border/60"
                              }`}
                            />
                            {errors.expiry && <p className="text-[9px] text-red-400 font-mono">{errors.expiry}</p>}
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] uppercase text-muted-foreground tracking-wider block">CVV / CVC Code</label>
                            <input
                              type="password"
                              placeholder="***"
                              maxLength={3}
                              value={form.cvc}
                              onChange={(e) => update("cvc", e.target.value)}
                              className={`w-full bg-secondary/25 border rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none focus:border-neon text-center ${
                                errors.cvc ? "border-red-500/50" : "border-border/60"
                              }`}
                            />
                            {errors.cvc && <p className="text-[9px] text-red-400 font-mono">{errors.cvc}</p>}
                          </div>
                        </div>

                        {/* Supported card logo icons */}
                        <div className="flex gap-2 items-center pt-2">
                          <span className="text-[9px] text-muted-foreground">Supported Networks:</span>
                          <span className="text-[9px] bg-secondary/50 px-2 py-0.5 rounded text-foreground font-semibold">Visa</span>
                          <span className="text-[9px] bg-secondary/50 px-2 py-0.5 rounded text-foreground font-semibold">Mastercard</span>
                          <span className="text-[9px] bg-secondary/50 px-2 py-0.5 rounded text-foreground font-semibold">Carte Bancaire</span>
                          <span className="text-[9px] bg-secondary/50 px-2 py-0.5 rounded text-foreground font-semibold">Stripe Secure</span>
                        </div>
                      </motion.div>
                    )}

                    {/* Method 2: Flouci Wallet */}
                    {paymentMethod === "flouci" && (
                      <motion.div
                        key="flouci-form"
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="space-y-4"
                      >
                        <div className="p-4 rounded-xl border border-neon/20 bg-neon/5 space-y-2">
                          <span className="text-[10px] font-bold text-neon font-mono uppercase block">Flouci Mobile Pay</span>
                          <p className="text-xs text-muted-foreground leading-relaxed font-light">
                            Accept instant merchant transaction cuts directly from your Tunisian mobile wallet via the central D17 clearing network.
                          </p>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] uppercase text-muted-foreground tracking-wider block">Wallet Phone Number</label>
                          <input
                            type="text"
                            placeholder="+216 98765432 (type 'test' to auto fill)"
                            value={flouciPhone}
                            onChange={(e) => handleFlouciTestFill(e.target.value)}
                            className={`w-full bg-secondary/25 border rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none focus:border-neon ${
                              errors.phone ? "border-red-500/50" : "border-border/60"
                            }`}
                          />
                          {errors.phone && <p className="text-[9px] text-red-400 font-mono">{errors.phone}</p>}
                        </div>
                      </motion.div>
                    )}

                    {/* Method 3: Google Pay / Apple Pay */}
                    {paymentMethod === "wallet" && (
                      <motion.div
                        key="wallet-form"
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="space-y-4"
                      >
                        <div className="p-5 rounded-xl border border-border/30 bg-black/30 text-center space-y-4">
                          <p className="text-xs text-muted-foreground leading-relaxed max-w-xs mx-auto">
                            Instantly authenticate via secure device tokens using pre-saved credit credentials.
                          </p>
                          <div className="flex gap-2 justify-center">
                            <button
                              type="button"
                              onClick={() => { setForm({ name: "Google Wallet User", number: "4242 4242 4242 4242", expiry: "12/34", cvc: "123" }); }}
                              className="px-4 py-2.5 rounded-xl bg-white text-black text-xs font-bold hover:bg-zinc-200 transition-colors"
                            >
                              Pay with Google Pay
                            </button>
                            <button
                              type="button"
                              onClick={() => { setForm({ name: "Apple Wallet User", number: "4242 4242 4242 4242", expiry: "12/34", cvc: "123" }); }}
                              className="px-4 py-2.5 rounded-xl bg-white text-black text-xs font-bold hover:bg-zinc-200 transition-colors"
                            >
                              Pay with Apple Pay
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="pt-4 border-t border-border/20 space-y-4">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-muted-foreground">Order total:</span>
                      <span className="font-bold text-foreground text-sm">${plan.price}.00 USD</span>
                    </div>

                    {failAnimation && (
                      <div className="p-3 rounded-lg border border-red-500/40 bg-red-950/20 flex items-center gap-2">
                        <AlertCircle className="h-4.5 w-4.5 text-red-500 shrink-0" />
                        <span className="text-[10px] text-red-400 font-mono font-light">Transaction denied. Please verify credentials.</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={processing}
                      className="w-full py-3.5 rounded-xl text-xs font-bold bg-neon text-black glow-neon hover:opacity-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                    >
                      {processing ? (
                        <>
                          <Loader2 className="h-4.5 w-4.5 animate-spin" />
                          Processing Transaction...
                        </>
                      ) : (
                        <>
                          <Lock className="h-3.5 w-3.5" />
                          Confirm Payment
                        </>
                      )}
                    </button>
                  </div>

                </form>
              </motion.div>

            </div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}

// Micro loader component
function Loader2({ className }: { className?: string }) {
  return <div className={`w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin ${className}`} />;
}
