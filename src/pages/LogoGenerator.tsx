/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { localDB } from "@/lib/supabaseClient";
import { jsPDF } from "jspdf";
import {
  Sparkles,
  Palette,
  Type,
  BookOpen,
  Target,
  Download,
  Copy,
  Loader2,
  CheckCircle,
  Award,
  ChevronRight,
  Info
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function LogoGenerator() {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();

  const [form, setForm] = useState({
    name: "",
    industry: "",
    values: ""
  });

  const [loading, setLoading] = useState(false);
  const [loadingStepIndex, setLoadingStepIndex] = useState(0);
  const [receivedCount, setReceivedCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [logos, setLogos] = useState<string[]>([]);
  const [previewLogo, setPreviewLogo] = useState<string | null>(null);
  const [savedSessions, setSavedSessions] = useState<any[]>([]);
  const batchTimeoutRef = useRef<number | null>(null);
  const loadingDelayRef = useRef<number | null>(null);
  const loadingStartRef = useRef<number>(0);
  const activeRequestIdRef = useRef(0);
  const TOTAL_EXPECTED_IMAGES = 6;
  const MIN_LOADING_MS = 1200;
  const REQUEST_TIMEOUT_MS = 20000;

  const WEBHOOK_URL = "https://xinzhaopfe.app.n8n.cloud/webhook-test/5f82fb8e-8301-45b0-a390-108cf7fe52c6";

  const loadingSteps = [
    "Analyzing Industry",
    "Understanding Brand Values",
    "Creating Strategic Direction",
    "Generating Logo Concepts",
    "Building Color Palette",
    "Crafting Typography System",
    "Finalizing Identity"
  ];

  const motionContainer = {
    hidden: { opacity: 0, y: 18 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        ease: "easeOut",
        duration: 0.5,
        staggerChildren: 0.08,
      },
    },
  };

  const motionItem = {
    hidden: { opacity: 0, y: 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.42, ease: "easeOut" },
    },
  };

  const mapWebhookResponse = (payload: any) => {
    const data = payload?.data ?? payload ?? {};
    const logosSource = Array.isArray(data?.items)
      ? data.items
      : Array.isArray(data)
      ? data
      : [];
    const logosList = logosSource.map((item: any) => {
      const rawImage = item?.image ?? "";
      const image = typeof rawImage === "string"
        ? rawImage.startsWith("data:")
          ? rawImage
          : `data:image/png;base64,${rawImage}`
        : "";
      return {
        image,
        alt: item?.alt ?? "Generated logo",
        caption: item?.caption ?? ""
      };
    });

    return {
      brandIdentity: {
        title: data?.brandIdentity?.title ?? "",
        description: data?.brandIdentity?.description ?? "",
        tagline: data?.brandIdentity?.tagline ?? ""
      },
      slogans: Array.isArray(data?.slogans) ? data.slogans : [],
      concepts: Array.isArray(data?.logoConcepts) ? data.logoConcepts : [],
      palette: Array.isArray(data?.colors) ? data.colors : [],
      typography: {
        heading: data?.typography?.heading ?? data?.typography?.fontFamily ?? "",
        body: data?.typography?.body ?? "",
        description: data?.typography?.description ?? data?.typography?.body ?? "",
        fontFamily: data?.typography?.fontFamily ?? data?.typography?.heading ?? ""
      },
      identitySuggestions: data?.physicalIdentity ?? "",
      logoPrompt: data?.logoPrompt ?? "",
      logoImage: data?.logoImage ?? (logosList[0]?.image ?? ""),
      logos: logosList
    };
  };

  const normalizeWebhookResponse = (res: any): string[] => {
    const toDataUri = (image: string) => {
      if (!image) {
        return "";
      }
      if (image.startsWith("data:")) {
        return image;
      }
      return `data:image/png;base64,${image}`;
    };

    if (!res) return [];

    if (Array.isArray(res.images)) {
      return res.images.filter(Boolean).map((image) => toDataUri(image));
    }

    if (Array.isArray(res.data)) {
      return res.data
        .map((item) => item?.image || item?.data || item)
        .filter(Boolean)
        .map((image: string) => toDataUri(image));
    }

    if (Array.isArray(res)) {
      return res.filter(Boolean).map((image: string) => toDataUri(image));
    }

    if (typeof res === "string") {
      try {
        const parsed = JSON.parse(res);
        return normalizeWebhookResponse(parsed);
      } catch {
        return [];
      }
    }

    return [];
  };

  const generateLogos = async (payload: { companyName: string; industry: string; brandValues: string }) => {
    const webhookUrl = WEBHOOK_URL;
    const query = new URLSearchParams({
      companyName: payload.companyName,
      industry: payload.industry,
      brandValues: payload.brandValues
    });
    const fullUrl = `${webhookUrl}?${query.toString()}`;
    console.log("Webhook URL", fullUrl);

    const response = await fetch(fullUrl, {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    });

    console.log("Response status", response.status);

    if (!response.ok) {
      const responseText = await response.text().catch(() => response.statusText);
      throw new Error(`Webhook request failed with status ${response.status}: ${responseText}`);
    }

    const responseText = await response.text();
    let responsePayload: any;

    try {
      responsePayload = responseText ? JSON.parse(responseText) : null;
    } catch {
      responsePayload = responseText;
    }

    const images = normalizeWebhookResponse(responsePayload);
    return {
      ...mapWebhookResponse(responsePayload),
      images
    };
  };

  useEffect(() => {
    if (user) {
      localDB.getFavorites(user.id, "logo_session").then((data) => {
        setSavedSessions(data);
      });
    }
  }, [user]);

  useEffect(() => {
    if (!loading) {
      setLoadingStepIndex(0);
      return;
    }

    const interval = window.setInterval(() => {
      setLoadingStepIndex((current) => (current + 1) % loadingSteps.length);
    }, 1500);

    return () => window.clearInterval(interval);
  }, [loading]);

  const stopLoading = () => {
    const elapsed = Date.now() - loadingStartRef.current;
    const remaining = Math.max(0, MIN_LOADING_MS - elapsed);

    if (loadingDelayRef.current) {
      window.clearTimeout(loadingDelayRef.current);
    }

    loadingDelayRef.current = window.setTimeout(() => {
      setLoading(false);
      loadingDelayRef.current = null;
    }, remaining);
  };

  useEffect(() => {
    return () => {
      if (batchTimeoutRef.current) {
        window.clearTimeout(batchTimeoutRef.current);
      }
      if (loadingDelayRef.current) {
        window.clearTimeout(loadingDelayRef.current);
      }
    };
  }, []);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("BUTTON CLICKED");
    console.log("Submitting to webhook", {
      companyName: form.name,
      industry: form.industry,
      brandValues: form.values,
    });
    console.log("Webhook URL", WEBHOOK_URL);

    if (!form.name || !form.industry || !form.values) {
      toast({
        title: "Missing Fields",
        description: "Please specify your company name, vertical, and values.",
        variant: "destructive"
      });
      return;
    }

    const requestId = activeRequestIdRef.current + 1;
    activeRequestIdRef.current = requestId;
    const previousResult = result;
    const previousLogos = logos;
    setLoading(true);
    loadingStartRef.current = Date.now();
    setReceivedCount(0);
    setError(null);
    setSuccess(false);
    setLogos([]);

    if (batchTimeoutRef.current) {
      window.clearTimeout(batchTimeoutRef.current);
    }
    if (loadingDelayRef.current) {
      window.clearTimeout(loadingDelayRef.current);
    }

    batchTimeoutRef.current = window.setTimeout(() => {
      if (activeRequestIdRef.current !== requestId) return;
      const elapsed = Date.now() - loadingStartRef.current;
      const nextDelay = Math.max(0, MIN_LOADING_MS - elapsed);
      if (loadingDelayRef.current) {
        window.clearTimeout(loadingDelayRef.current);
      }
      loadingDelayRef.current = window.setTimeout(() => {
        if (activeRequestIdRef.current !== requestId) return;
        setLoading(false);
        loadingDelayRef.current = null;
      }, nextDelay);
      batchTimeoutRef.current = null;
    }, REQUEST_TIMEOUT_MS);

    try {
      const data = await generateLogos({
        companyName: form.name,
        industry: form.industry,
        brandValues: form.values
      });

      if (activeRequestIdRef.current !== requestId) {
        return;
      }

      console.log("Webhook response", data);
      setResult(data);
      const newLogos = data.images ?? [];
      setLogos((prev) => {
        const merged = [...prev, ...newLogos];
        return merged.slice(0, TOTAL_EXPECTED_IMAGES);
      });
      setReceivedCount((prevCount) => {
        const nextCount = Math.min(prevCount + newLogos.length, TOTAL_EXPECTED_IMAGES);
        if (nextCount >= TOTAL_EXPECTED_IMAGES) {
          if (batchTimeoutRef.current) {
            window.clearTimeout(batchTimeoutRef.current);
            batchTimeoutRef.current = null;
          }
          stopLoading();
        }
        return nextCount;
      });
      setSuccess(true);

      if (user) {
        // Save to favorites as a logo session
        const saved = await localDB.saveFavorite(user.id, "logo_session", {
          input: form,
          output: data
        });
        setSavedSessions((prev) => [saved, ...prev]);
        await localDB.logUserAction(user.id, "generate_logo_direction", { name: form.name });
      }

      toast({
        title: "Brand Identity Formulated!",
        description: "Review your detailed logo directions and typography guides."
      });
    } catch (err) {
      if (activeRequestIdRef.current !== requestId) {
        return;
      }
      console.error("Webhook error", err);
      setError("Unable to load generated logos. Try again.");
      setResult(previousResult);
      setLogos(previousLogos);
      if (batchTimeoutRef.current) {
        window.clearTimeout(batchTimeoutRef.current);
        batchTimeoutRef.current = null;
      }
      stopLoading();
      toast({
        title: "AI Analysis Failed",
        description: "Unable to consult design models.",
        variant: "destructive"
      });
    }
  };

  const handleCopySlogan = (slogan: string) => {
    navigator.clipboard.writeText(slogan);
    toast({ description: `Copied "${slogan}" to clipboard.` });
  };

  const handleExportPDF = () => {
    if (!result) return;

    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 40;
    let y = 60;

    const addText = (text: string, options?: { size?: number; style?: "normal" | "bold" }) => {
      if (options?.size) doc.setFontSize(options.size);
      doc.setFont("helvetica", options?.style === "bold" ? "bold" : "normal");
      const lines = doc.splitTextToSize(text, pageWidth - margin * 2);
      doc.text(lines, margin, y);
      y += lines.length * (options?.size ? options.size * 1.3 : 14) + 10;
      if (y > doc.internal.pageSize.getHeight() - margin) {
        doc.addPage();
        y = margin;
      }
    };

    addText("MACHROU3I BRAND LOGO & IDENTITY SUITE", { size: 18, style: "bold" });
    addText(`Company: ${form.name}`);
    addText(`Industry: ${form.industry}`);
    addText(`Key Values: ${form.values}`);

    addText("Logo Concepts", { size: 14, style: "bold" });
    (result.concepts || []).forEach((c: any, i: number) => {
      addText(`${i + 1}. ${c.title}`, { size: 12, style: "bold" });
      addText(c.description || "No description available.");
    });

    addText("Color Palette", { size: 14, style: "bold" });
    (result.palette || []).forEach((p: any) => {
      addText(`- ${p.color} (${p.hex}): ${p.meaning || "No meaning provided."}`);
    });

    addText("Typography Directions", { size: 14, style: "bold" });
    addText(`Font: ${result.typography?.fontFamily || "N/A"}`);
    addText(`Details: ${result.typography?.description || "N/A"}`);

    addText("Suggested Slogans", { size: 14, style: "bold" });
    (result.slogans || []).forEach((s: string) => addText(`- "${s}"`));

    addText("Identity Realization Details", { size: 14, style: "bold" });
    addText(result.identitySuggestions || "No identity suggestions available.");

    const filename = `machrou3i-brand-${form.name.toLowerCase().replace(/\s+/g, "-")}.pdf`;
    doc.save(filename);
    toast({ description: "Brand Identity PDF downloaded successfully!" });
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 bg-gradient-hero">
      <div className="container mx-auto max-w-6xl">
        {/* Banner header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <span className="inline-flex items-center gap-1 text-[10px] font-mono tracking-widest text-neon uppercase bg-neon/10 px-3 py-1 rounded-full mb-3">
              <Sparkles className="h-3 w-3" />
              Aesthetic Direction Studio
            </span>
            <h1 className="text-3xl md:text-4xl font-bold font-heading text-gradient-neon">
              {t("logoGenerator.title", "Logo Generator")}
            </h1>
            <p className="text-muted-foreground text-xs md:text-sm mt-1">
              {t("logoGenerator.subtitle", "Simulate strategic brand directions, typography pairings, and professional visual guidelines.")}
            </p>
          </div>

          {result && (
            <button
              onClick={handleExportPDF}
              className="px-4 py-2 text-xs font-bold rounded-xl bg-neon text-black glow-neon hover:opacity-90 transition-all flex items-center gap-2"
            >
              <Download className="h-3.5 w-3.5" />
              Export Brand PDF
            </button>
          )}
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-stretch">
          {/* Inputs sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <form onSubmit={handleGenerate} className="glass-panel rounded-2xl p-6 space-y-4 bg-black/45 border-border/30">
              <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Palette className="h-4 w-4 text-neon" />
                Creative Parameters
              </h2>

              <div className="space-y-1">
                <label className="text-[10px] uppercase text-muted-foreground tracking-wider">Company / Brand Name</label>
                <input
                  type="text"
                  placeholder="e.g. Nexus Corp"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-secondary/35 border border-border/60 rounded-xl px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-neon focus:ring-1 focus:ring-neon/30"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase text-muted-foreground tracking-wider">Industry / Product Focus</label>
                <input
                  type="text"
                  placeholder="e.g. Organic coffee, Bio-medical tech"
                  value={form.industry}
                  onChange={(e) => setForm({ ...form, industry: e.target.value })}
                  className="w-full bg-secondary/35 border border-border/60 rounded-xl px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-neon focus:ring-1 focus:ring-neon/30"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase text-muted-foreground tracking-wider">Brand Values / Descriptors</label>
                <textarea
                  placeholder="e.g. sustainability, hyper-efficiency, luxury, transparency"
                  value={form.values}
                  onChange={(e) => setForm({ ...form, values: e.target.value })}
                  className="w-full bg-secondary/35 border border-border/60 rounded-xl px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-neon focus:ring-1 focus:ring-neon/30 h-20 resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3 rounded-xl font-semibold text-xs bg-neon text-black glow-neon hover:opacity-95 disabled:opacity-40 transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4.5 w-4.5 animate-spin" />
                    Generating 6 logo concepts...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-3.5 w-3.5" />
                    Formulate Brand Identity
                  </>
                )}
              </button>
            </form>

            {/* Logo Sessions History */}
            <div className="glass-panel rounded-2xl p-6 bg-black/20 border-border/30 space-y-4">
              <h3 className="text-xs uppercase font-bold text-foreground">
                Saved Identities ({savedSessions.length})
              </h3>
              {savedSessions.length === 0 ? (
                <p className="text-[10px] text-muted-foreground font-light">
                  Formulate a brand direction to see its saved files logged in Supabase.
                </p>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto custom-scroll pr-1">
                  {savedSessions.map((fav) => (
                    <button
                      key={fav.id}
                      onClick={() => {
                        setForm(fav.item.input);
                        setResult(fav.item.output);
                        toast({ description: "Brand setup loaded from history." });
                      }}
                      className="w-full text-start p-2.5 rounded-xl bg-secondary/25 border border-border/30 hover:border-neon/30 transition-all flex justify-between items-center"
                    >
                      <div>
                        <span className="text-xs font-bold text-foreground truncate block max-w-[120px]">{fav.item.input.name}</span>
                        <span className="text-[9px] text-muted-foreground block truncate max-w-[120px]">{fav.item.input.industry}</span>
                      </div>
                      <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Outputs */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              {error && !loading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="glass-panel rounded-2xl p-4 border border-border/30 bg-black/35 mb-4"
                >
                  <p className="text-sm font-semibold text-foreground">Unable to generate brand identity</p>
                  <p className="text-xs text-muted-foreground mt-1">{error}</p>
                </motion.div>
              )}

              {loading && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="glass-panel rounded-2xl p-12 text-center border-neon/20 bg-black/35 min-h-[500px]"
                >
                  <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-neon/10 text-neon shadow-[0_0_60px_rgba(52,211,153,0.18)]">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                  <h3 className="text-lg font-heading font-semibold text-foreground">Creating Your Brand Identity</h3>
                  <p className="text-xs text-muted-foreground max-w-md mx-auto mt-2 leading-relaxed">
                    Elevating your logo direction with curated color, typography, and positioning recommendations.
                  </p>

                  <div className="mt-10 max-w-3xl mx-auto space-y-6">
                    <div className="rounded-full bg-white/5 h-2 overflow-hidden">
                      <motion.div
                        className="h-full rounded-full bg-neon"
                        animate={{ width: `${((loadingStepIndex + 1) / loadingSteps.length) * 100}%` }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                      />
                    </div>

                    <div className="grid gap-3">
                      {loadingSteps.map((step, index) => {
                        const isActive = index === loadingStepIndex;
                        const isDone = index < loadingStepIndex;
                        return (
                          <motion.div
                            key={step}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.35, ease: "easeOut", delay: index * 0.04 }}
                            className={`rounded-2xl border px-4 py-3 transition-all duration-300 ${
                              isActive
                                ? "border-neon/30 bg-neon/10 shadow-[0_18px_40px_-26px_rgba(56,189,248,0.35)]"
                                : "border-white/10 bg-white/5"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <span
                                className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${
                                  isDone ? "bg-neon text-black" : isActive ? "bg-white text-neon" : "bg-white/10 text-muted-foreground"
                                }`}
                              >
                                {isDone ? <CheckCircle className="h-4 w-4" /> : index + 1}
                              </span>
                              <span className={`text-xs font-semibold tracking-[0.22em] ${isActive ? "text-neon" : "text-muted-foreground"}`}>
                                {step}
                              </span>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {Array.from({ length: 6 }).map((_, index) => (
                        <div key={index} className="animate-pulse rounded-[2rem] border border-white/10 bg-slate-950/60 p-4 h-52" />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {!result && !loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center glass-panel rounded-2xl p-12 text-center border-dashed border-border/60 bg-black/20 min-h-[500px]"
                >
                  <Palette className="h-10 w-10 text-muted-foreground/60 mb-3" />
                  <h3 className="text-sm font-semibold text-foreground">Awaiting brand params</h3>
                  <p className="text-xs text-muted-foreground max-w-xs mt-1">
                    Complete the creative characteristics on the left to activate visual styling concepts, typography pairs, and slogan recommendations.
                  </p>
                </motion.div>
              )}

              {result && !loading && (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={motionContainer}
                  className="space-y-6"
                >
                  {success && (
                    <div className="sr-only" aria-live="polite">
                      Brand identity generated successfully.
                    </div>
                  )}

                  {/* Slogans chip row */}
                  <motion.div variants={motionItem} className="flex gap-2.5 flex-wrap items-center">
                    <span className="text-[10px] font-mono text-muted-foreground uppercase mr-1">Copy Slogans:</span>
                    {result.slogans?.map((slogan: string) => (
                      <button
                        key={slogan}
                        onClick={() => handleCopySlogan(slogan)}
                        className="px-3.5 py-1.5 rounded-full text-xs bg-secondary/60 hover:bg-neon hover:text-black border border-border/50 transition-all font-semibold"
                      >
                        "{slogan}"
                      </button>
                    ))}
                  </motion.div>

                  {(result.brandIdentity?.title || result.brandIdentity?.description || result.brandIdentity?.tagline) && (
                    <motion.div variants={motionItem} className="glass-panel p-5 rounded-2xl border-border/30 bg-black/35">
                      {result.brandIdentity?.title && (
                        <h3 className="text-base font-bold text-foreground font-heading">{result.brandIdentity.title}</h3>
                      )}
                      {result.brandIdentity?.description && (
                        <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{result.brandIdentity.description}</p>
                      )}
                      {result.brandIdentity?.tagline && (
                        <p className="text-[10px] uppercase tracking-[0.3em] text-neon mt-3 font-semibold">{result.brandIdentity.tagline}</p>
                      )}
                    </motion.div>
                  )}

                  {result.logoImage && (
                    <motion.div variants={motionItem} className="glass-panel p-5 rounded-2xl border-border/30 bg-black/35">
                      <h4 className="text-xs uppercase text-muted-foreground font-semibold mb-3">Generated Logo Preview</h4>
                      <motion.img
                        src={result.logoImage}
                        alt="Generated logo preview"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-full rounded-2xl object-contain"
                      />
                    </motion.div>
                  )}

                  {(logos.length > 0 || loading) && (
                    <motion.div variants={motionItem} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {Array.from({ length: TOTAL_EXPECTED_IMAGES }, (_, index) => logos[index] ?? null).map((image, index) => {
                        const isPlaceholder = image === null;
                        return (
                          <motion.button
                            key={`${image || "placeholder"}-${index}`}
                            type="button"
                            onClick={() => !isPlaceholder && image && setPreviewLogo(image)}
                            variants={motionItem}
                            whileHover={isPlaceholder ? undefined : { scale: 1.03 }}
                            transition={{ type: "spring", stiffness: 160, damping: 18 }}
                            className={`overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/85 p-3 shadow-[0_30px_80px_-50px_rgba(15,23,42,0.6)] transition-all ${
                              isPlaceholder ? "animate-pulse bg-slate-900/60" : "hover:-translate-y-0.5"
                            }`}
                          >
                            {isPlaceholder ? (
                              <div className="flex h-56 w-full items-center justify-center rounded-[1.75rem] bg-white/5">
                                <span className="text-xs text-muted-foreground">Loading logo...</span>
                              </div>
                            ) : (
                              <img
                                src={image}
                                alt={`Generated logo ${index + 1}`}
                                className="h-56 w-full rounded-[1.75rem] object-contain bg-white/5"
                              />
                            )}
                          </motion.button>
                        );
                      })}
                    </motion.div>
                  )}

                  <AnimatePresence>
                    {previewLogo && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
                      >
                        <motion.div
                          initial={{ scale: 0.96 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0.96 }}
                          className="w-full max-w-4xl rounded-[2rem] overflow-hidden border border-white/10 bg-slate-950/95 shadow-[0_0_80px_rgba(0,0,0,0.65)]"
                        >
                          <button
                            onClick={() => setPreviewLogo(null)}
                            className="absolute right-5 top-5 z-10 rounded-full bg-black/70 p-2 text-white hover:bg-white/10"
                          >
                            Close
                          </button>
                          <img
                            src={previewLogo}
                            alt="Enlarged logo preview"
                            className="w-full max-h-[80vh] object-contain"
                          />
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Logo Concepts grid */}
                  <motion.div variants={motionItem} className="grid md:grid-cols-2 gap-6">
                    {result.concepts?.map((c: any, i: number) => (
                      <motion.div
                        key={i}
                        variants={motionItem}
                        whileHover={{ y: -4, scale: 1.01 }}
                        transition={{ type: "spring", stiffness: 160, damping: 16 }}
                        className="glass-panel p-5 rounded-2xl border-neon/15 bg-black/35 space-y-2"
                      >
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-neon/10 text-neon text-xs font-bold font-mono">
                          0{i + 1}
                        </span>
                        <h4 className="text-sm font-bold text-foreground font-heading">{c.title}</h4>
                        <p className="text-xs text-muted-foreground leading-relaxed font-light">
                          {c.description}
                        </p>
                      </motion.div>
                    ))}
                  </motion.div>

                  {/* Palette and typography */}
                  <motion.div variants={motionItem} className="grid md:grid-cols-12 gap-6 items-stretch">
                    {/* Color palette */}
                    <motion.div variants={motionItem} className="md:col-span-7 glass-panel p-5 rounded-2xl flex flex-col justify-between">
                      <h4 className="text-xs uppercase text-muted-foreground font-semibold mb-3 flex items-center gap-1.5">
                        <Palette className="h-3.5 w-3.5 text-neon" />
                        Color Hex Palette
                      </h4>
                      <div className="grid grid-cols-3 gap-3">
                        {result.palette?.map((col: any) => (
                          <motion.div
                            key={col.hex}
                            whileHover={{ y: -2, scale: 1.01 }}
                            transition={{ duration: 0.25, ease: "easeOut" }}
                            className="space-y-2 rounded-3xl border border-border/30 bg-white/5 p-3"
                          >
                            <div
                              className="aspect-[4/3] rounded-3xl border border-border/40 shadow-inner"
                              style={{ backgroundColor: col.hex }}
                            />
                            <div>
                              <p className="text-xs font-bold text-foreground truncate">{col.name ?? col.color}</p>
                              <p className="text-[10px] text-muted-foreground font-mono truncate">{col.hex}</p>
                              <p className="text-[9px] text-muted-foreground leading-snug mt-1 font-light line-clamp-2" title={col.meaning}>
                                {col.meaning}
                              </p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>

                    {/* Typography details */}
                    <motion.div variants={motionItem} className="md:col-span-5 glass-panel p-5 rounded-2xl flex flex-col justify-start space-y-4">
                      <h4 className="text-xs uppercase text-muted-foreground font-semibold flex items-center gap-1.5">
                        <Type className="h-3.5 w-3.5 text-neon" />
                        Typography pairing
                      </h4>
                      <div className="p-4 rounded-xl bg-secondary/35 border border-border/40 text-center space-y-2">
                        <span className="text-xl font-bold font-heading text-gradient-neon block">
                          {result.typography?.fontFamily || result.typography?.heading}
                        </span>
                        <p className="text-[10px] text-muted-foreground leading-relaxed">
                          {result.typography?.description || result.typography?.body}
                        </p>
                      </div>
                    </motion.div>
                  </motion.div>

                  {/* Slogan direction and print layout suggestions */}
                  <motion.div variants={motionItem} className="glass-panel p-5 rounded-2xl border-border/30 bg-black/40">
                    <h4 className="text-xs uppercase font-mono tracking-widest text-neon mb-2.5 flex items-center gap-1.5">
                      <BookOpen className="h-3.5 w-3.5" />
                      Physical Identity Realization Directions
                    </h4>
                    <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line font-light">
                      {result.identitySuggestions}
                    </p>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
