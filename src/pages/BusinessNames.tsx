import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { generateBusinessNames } from "@/lib/geminiService";
import { localDB } from "@/lib/supabaseClient";
import { jsPDF } from "jspdf";
/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  Sparkles,
  Search,
  Copy,
  CheckCircle,
  Heart,
  Download,
  History,
  Loader2,
  Bookmark,
  RefreshCw,
  Award
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface GeneratedName {
  name: string;
  meaning: string;
  score: number;
  saved?: boolean;
}

export default function BusinessNames() {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();

  const [form, setForm] = useState({
    industry: "",
    keywords: "",
    style: "Modern / Minimalist"
  });

  const [loading, setLoading] = useState(false);
  const [names, setNames] = useState<GeneratedName[]>([]);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [historyList, setHistoryList] = useState<any[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    if (user) {
      localDB.getFavorites(user.id, "business_name").then((data) => {
        setFavorites(data);
      });
      localDB.getBusinessNames(user.id).then((data) => {
        setHistoryList(data);
      });
    }
  }, [user]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.industry || !form.keywords) {
      toast({
        title: "Missing fields",
        description: "Please specify industry and keywords.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const data = await generateBusinessNames({
        industry: form.industry,
        keywords: form.keywords,
        style: form.style,
        lang: i18n.language
      });

      const items = data.names.map((item: any) => ({
        ...item,
        saved: favorites.some((fav) => fav.item.name === item.name)
      }));

      setNames(items);

      if (user) {
        const saved = await localDB.saveBusinessNames(user.id, {
          industry: form.industry,
          keywords: form.keywords,
          names: items
        });
        setHistoryList((prev) => [saved, ...prev]);
        await localDB.logUserAction(user.id, "generate_business_names", { keywords: form.keywords });
      }

      toast({
        title: "Names Generated!",
        description: "Review your 20 strategic naming suggestions."
      });
    } catch (e) {
      console.error(e);
      toast({
        title: "Generation Failed",
        description: "Unable to consult branding database. Check network connection.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (item: GeneratedName) => {
    if (!user) return;
    const existing = favorites.find((fav) => fav.item.name === item.name);

    if (existing) {
      await localDB.removeFavorite(user.id, existing.id);
      setFavorites((prev) => prev.filter((x) => x.id !== existing.id));
      setNames((prev) =>
        prev.map((n) => (n.name === item.name ? { ...n, saved: false } : n))
      );
      toast({ description: `${item.name} removed from favorites.` });
    } else {
      const saved = await localDB.saveFavorite(user.id, "business_name", item);
      setFavorites((prev) => [saved, ...prev]);
      setNames((prev) =>
        prev.map((n) => (n.name === item.name ? { ...n, saved: true } : n))
      );
      toast({ description: `${item.name} saved to favorites.` });
    }
  };

  const handleCopySingle = (name: string) => {
    navigator.clipboard.writeText(name);
    toast({ description: `Copied "${name}" to clipboard.` });
  };

  const handleCopyAll = () => {
    if (names.length === 0) return;
    const txt = names.map((n) => `${n.name} (Score: ${n.score}%) - ${n.meaning}`).join("\n");
    navigator.clipboard.writeText(txt);
    toast({ description: "Copied all 20 names to clipboard!" });
  };

  const handleExportPDF = () => {
    if (names.length === 0) return;

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

    addText("MACHROU3I BUSINESS BRAND NAMES", { size: 18, style: "bold" });
    addText(`Industry: ${form.industry}`);
    addText(`Keywords: ${form.keywords}`);
    addText(`Style Direction: ${form.style}`);
    addText("Names Index", { size: 14, style: "bold" });

    names.forEach((name, index) => {
      addText(`${index + 1}. ${name.name} (${name.score}%)`, { size: 12, style: "bold" });
      addText(name.meaning || "No explanation available.");
    });

    const filename = `machrou3i-names-${form.keywords.replace(/\s+/g, "-")}.pdf`;
    doc.save(filename);
    toast({ description: "Branding guide exported successfully!" });
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 bg-gradient-hero">
      <div className="container mx-auto max-w-6xl">
        {/* Title */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <span className="inline-flex items-center gap-1 text-[10px] font-mono tracking-widest text-neon uppercase bg-neon/10 px-3 py-1 rounded-full mb-3">
              <Sparkles className="h-3 w-3" />
              Nomenclature & Linguistics Engine
            </span>
            <h1 className="text-3xl md:text-4xl font-bold font-heading text-gradient-neon">
              {t("businessNames.title", "Business Name Generator")}
            </h1>
            <p className="text-muted-foreground text-xs md:text-sm mt-1">
              {t("businessNames.subtitle", "Generate, select, and brand high-fidelity corporate identities powered by linguistic AI.")}
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="px-4 py-2 text-xs font-semibold rounded-xl border border-border bg-secondary/35 text-foreground hover:bg-secondary/60 transition-all flex items-center gap-2"
            >
              <History className="h-3.5 w-3.5" />
              History ({historyList.length})
            </button>
            {names.length > 0 && (
              <>
                <button
                  onClick={handleCopyAll}
                  className="px-4 py-2 text-xs font-semibold rounded-xl border border-border bg-secondary/35 text-foreground hover:bg-secondary/60 transition-all flex items-center gap-2"
                >
                  <Copy className="h-3.5 w-3.5" />
                  Copy All
                </button>
                <button
                  onClick={handleExportPDF}
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-neon text-black glow-neon hover:opacity-90 transition-all flex items-center gap-2"
                >
                  <Download className="h-3.5 w-3.5" />
                  Export
                </button>
              </>
            )}
          </div>
        </div>

        {/* History / Favorites drawer */}
        <AnimatePresence>
          {showHistory && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="glass-panel border border-neon/30 p-6 rounded-2xl mb-8"
            >
              <h3 className="text-sm font-bold uppercase tracking-wider text-neon mb-4">
                Saved Sessions
              </h3>
              {historyList.length === 0 ? (
                <p className="text-xs text-muted-foreground">No historical queries yet.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {historyList.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setForm({
                          industry: item.industry,
                          keywords: item.keywords,
                          style: "Modern"
                        });
                        setNames(item.names);
                        setShowHistory(false);
                        toast({ description: "Historical names loaded successfully." });
                      }}
                      className="p-3 text-start glass-panel rounded-xl hover:border-neon/30 transition-all"
                    >
                      <p className="text-xs font-bold text-foreground truncate">{item.keywords}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{item.industry}</p>
                      <span className="text-[9px] text-neon/60 mt-1 block font-mono">
                        {new Date(item.created_at).toLocaleDateString()}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid lg:grid-cols-12 gap-8 items-stretch">
          {/* Inputs */}
          <div className="lg:col-span-4">
            <form onSubmit={handleGenerate} className="glass-panel rounded-2xl p-6 space-y-4 bg-black/45 border-border/30">
              <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Search className="h-4 w-4 text-neon" />
                Linguistic Parameters
              </h2>

              <div className="space-y-1">
                <label className="text-[10px] uppercase text-muted-foreground tracking-wider">Industry / Segment</label>
                <input
                  type="text"
                  placeholder="e.g. Agritech, CyberSaaS"
                  value={form.industry}
                  onChange={(e) => setForm({ ...form, industry: e.target.value })}
                  className="w-full bg-secondary/35 border border-border/60 rounded-xl px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-neon focus:ring-1 focus:ring-neon/30"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase text-muted-foreground tracking-wider">Core Keywords / Seed Concepts</label>
                <input
                  type="text"
                  placeholder="e.g. cyber, green, fast, crop"
                  value={form.keywords}
                  onChange={(e) => setForm({ ...form, keywords: e.target.value })}
                  className="w-full bg-secondary/35 border border-border/60 rounded-xl px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-neon focus:ring-1 focus:ring-neon/30"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase text-muted-foreground tracking-wider">Brand Style Direction</label>
                <select
                  value={form.style}
                  onChange={(e) => setForm({ ...form, style: e.target.value })}
                  className="w-full bg-secondary/35 border border-border/60 rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none focus:border-neon focus:ring-1 focus:ring-neon/30"
                >
                  <option value="Modern / Minimalist">Modern / Minimalist</option>
                  <option value="Luxury / Premium">Luxury / Premium</option>
                  <option value="Aggressive / Cyberpunk">Aggressive / Cyberpunk</option>
                  <option value="Organic / Sustainable">Organic / Sustainable</option>
                  <option value="Classic / Reliable">Classic / Reliable</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3 rounded-xl font-semibold text-xs bg-neon text-black glow-neon hover:opacity-95 disabled:opacity-40 transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4.5 w-4.5 animate-spin" />
                    Generating 20 Names...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-3.5 w-3.5" />
                    Synthesize Brandings
                  </>
                )}
              </button>
            </form>

            {/* Favorite brand sidebar card */}
            <div className="glass-panel rounded-2xl p-6 mt-6 bg-black/20 border-border/30 space-y-4">
              <h3 className="text-xs uppercase font-bold text-foreground flex items-center gap-1.5">
                <Bookmark className="h-3.5 w-3.5 text-neon" />
                Favorite Names ({favorites.length})
              </h3>
              {favorites.length === 0 ? (
                <p className="text-[10px] text-muted-foreground font-light">
                  Click the heart icon on generated names to pin your premium selections here.
                </p>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto custom-scroll pr-1">
                  {favorites.map((fav) => (
                    <div
                      key={fav.id}
                      className="p-2.5 rounded-xl bg-secondary/25 border border-border/30 flex items-center justify-between"
                    >
                      <div>
                        <span className="text-xs font-bold text-foreground">{fav.item.name}</span>
                        <span className="text-[9px] text-neon/80 font-mono block">Score: {fav.item.score}%</span>
                      </div>
                      <button
                        onClick={() => toggleFavorite(fav.item)}
                        className="text-red-400 hover:text-red-500 transition-colors p-1"
                      >
                        <Heart className="h-3 w-3 fill-current" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Outputs */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              {loading && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex flex-col items-center justify-center glass-panel rounded-2xl p-12 text-center border-neon/20 bg-black/35 min-h-[450px]"
                >
                  <Loader2 className="h-12 w-12 text-neon animate-spin mb-4" />
                  <h3 className="text-lg font-heading font-semibold text-foreground">Computing Phonetics & Semantics</h3>
                  <p className="text-xs text-muted-foreground max-w-sm mt-1">
                    Querying international trademark profiles, calculating linguistic balance, and verifying high-level brand score dynamics.
                  </p>
                </motion.div>
              )}

              {!names.length && !loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center glass-panel rounded-2xl p-12 text-center border-dashed border-border/60 bg-black/20 min-h-[450px]"
                >
                  <Sparkles className="h-10 w-10 text-muted-foreground/60 mb-3" />
                  <h3 className="text-sm font-semibold text-foreground">No Names Formulated</h3>
                  <p className="text-xs text-muted-foreground max-w-xs mt-1">
                    Provide the linguistic parameter seeds in the left-hand column to generate exactly 20 premium brandable names with scores.
                  </p>
                </motion.div>
              )}

              {names.length > 0 && !loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="grid sm:grid-cols-2 gap-4"
                >
                  {names.map((item, idx) => (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      className="glass-panel p-4.5 rounded-2xl border-border/30 bg-black/30 hover:border-neon/30 transition-all flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <div className="flex justify-between items-start">
                          <span className="text-base font-bold text-foreground font-heading">{item.name}</span>
                          <span className="flex items-center gap-1 text-[10px] bg-neon/10 text-neon px-2.5 py-0.5 rounded-full font-bold">
                            <Award className="h-3 w-3" />
                            {item.score}%
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed font-light">
                          {item.meaning}
                        </p>
                      </div>

                      <div className="flex justify-end gap-1.5 mt-4 pt-3.5 border-t border-border/10">
                        <button
                          onClick={() => handleCopySingle(item.name)}
                          className="p-1.5 rounded-lg bg-secondary/50 text-muted-foreground hover:text-foreground transition-all"
                          title="Copy Name"
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => toggleFavorite(item)}
                          className={`p-1.5 rounded-lg transition-all ${
                            item.saved
                              ? "bg-red-500/10 text-red-400"
                              : "bg-secondary/50 text-muted-foreground hover:text-red-400"
                          }`}
                          title="Pin Favorite"
                        >
                          <Heart className={`h-3.5 w-3.5 ${item.saved ? "fill-current" : ""}`} />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
