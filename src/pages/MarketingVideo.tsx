import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, Film, Sparkles, Image as ImageIcon } from "lucide-react";

const MarketingVideo = () => {
  const { t } = useTranslation();

  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState<{ file: File; preview: string } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  const [aspectRatio, setAspectRatio] = useState("16:9");
  const [language, setLanguage] = useState("en");
  const [sections, setSections] = useState<string[]>(["hero"]);

  // ---------------- IMAGE ----------------
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setImage({
        file,
        preview: URL.createObjectURL(file),
      });
    }
  }, []);

  const handleFileChange = (files: FileList | null) => {
    if (!files || !files[0]) return;
    const file = files[0];

    if (file.type.startsWith("image/")) {
      setImage({
        file,
        preview: URL.createObjectURL(file),
      });
    }
  };

  const removeImage = () => {
    if (image) URL.revokeObjectURL(image.preview);
    setImage(null);
  };

  // ---------------- GENERATE (🔥 FIXED) ----------------
  const handleGenerate = async () => {
    if (!prompt.trim()) {
      console.log("❌ Prompt empty");
      return;
    }

    if (!image) {
      console.log("❌ Image required");
      return;
    }

    setGenerating(true);
    setVideoUrl(null);

    // 🔥 FORM DATA = REAL BINARY IMAGE
    const formData = new FormData();

    formData.append("prompt", prompt);
    formData.append("aspect_ratio", aspectRatio);
    formData.append("language", language);
    formData.append("sections", JSON.stringify(sections));

    // 🔥 REAL FILE (THIS FIXES EVERYTHING)
    formData.append("image", image.file);

    console.log("📤 Sending FORM DATA to webhook");

    try {
      const res = await fetch("http://localhost:5678/webhook-test/affiche", {
        method: "POST",
        body: formData
      });

      const text = await res.text();
      console.log("✅ Webhook response:", text);

      setTimeout(() => {
        setGenerating(false);
        setVideoUrl("done");
      }, 1500);

    } catch (err) {
      console.error("❌ Webhook error:", err);
      setGenerating(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="container mx-auto max-w-4xl">

        {/* HEADER */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel text-neon text-sm mb-4">
            <Film className="h-4 w-4" />
            {t("marketing.badge")}
          </div>

          <h1 className="text-3xl md:text-4xl font-bold font-heading text-gradient-neon mb-3">
            {t("marketing.title")}
          </h1>

          <p className="text-muted-foreground text-sm max-w-lg mx-auto">
            {t("marketing.subtitle")}
          </p>
        </motion.div>

        {/* PROMPT */}
        <div className="glass-panel rounded-2xl p-6 mb-6">
          <textarea
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            placeholder="Describe your product..."
            className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 text-sm"
          />
        </div>

        {/* IMAGE UPLOAD */}
        <div className="glass-panel rounded-2xl p-6 mb-6">
          <div
            onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => document.getElementById("file-input")?.click()}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer ${
              isDragging ? "border-neon bg-neon/5" : "border-border"
            }`}
          >
            <input
              id="file-input"
              type="file"
              className="hidden"
              onChange={e => handleFileChange(e.target.files)}
            />

            <Upload className="mx-auto mb-2" />
            <p className="text-sm">Upload 1 product image</p>
          </div>

          {/* PREVIEW */}
          <AnimatePresence>
            {image && (
              <motion.div className="mt-4 flex justify-center">
                <div className="relative w-32 h-32 rounded-lg overflow-hidden group">
                  <img src={image.preview} className="w-full h-full object-cover" />
                  <button
                    onClick={removeImage}
                    className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center"
                  >
                    <X className="text-white w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* SETTINGS */}
        <div className="glass-panel rounded-2xl p-6 mb-6 space-y-4">

          <div>
            <p className="text-sm mb-2">Aspect Ratio</p>
            <div className="flex gap-2 flex-wrap">
              {["9:16", "16:9", "1:1", "4:5", "3:2", "21:9"].map(r => (
                <button
                  key={r}
                  onClick={() => setAspectRatio(r)}
                  className={`px-3 py-2 rounded-lg border ${
                    aspectRatio === r ? "bg-neon text-black" : "border-border"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm mb-2">Language</p>
            <select
              value={language}
              onChange={e => setLanguage(e.target.value)}
              className="w-full rounded-lg border border-border bg-background/50 p-2"
            >
              <option value="en">English</option>
              <option value="fr">French</option>
              <option value="ar">Arabic</option>
            </select>
          </div>

          <div>
            <p className="text-sm mb-2">AI Sections</p>
            <div className="flex gap-2 flex-wrap">
              {["hero","reviews","faq","features","benefits","pricing","cta"].map(sec => (
                <button
                  key={sec}
                  onClick={() =>
                    setSections(prev =>
                      prev.includes(sec)
                        ? prev.filter(s => s !== sec)
                        : [...prev, sec]
                    )
                  }
                  className={`px-3 py-2 rounded-lg border ${
                    sections.includes(sec) ? "bg-neon text-black" : "border-border"
                  }`}
                >
                  {sec}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* GENERATE */}
        <button
          onClick={handleGenerate}
          disabled={generating}
          className="w-full py-3 rounded-xl bg-neon text-black font-semibold mb-6"
        >
          {generating ? "Generating..." : "Generate"}
        </button>

        {/* OUTPUT */}
        <div className="glass-panel rounded-2xl p-6">
          <div className="aspect-video flex items-center justify-center">
            {generating ? <Sparkles /> : videoUrl ? "Done" : "No output"}
          </div>
        </div>

      </div>
    </div>
  );
};

export default MarketingVideo;