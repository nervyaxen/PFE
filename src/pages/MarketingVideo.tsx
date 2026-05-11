import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, Film, Sparkles, Image as ImageIcon, Video, GripVertical, Check } from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// TYPE DEFINITIONS
// ─────────────────────────────────────────────────────────────────────────────
type Mode = "image" | "video";

interface ImageUpload {
  file: File;
  preview: string;
}

interface VideoStyle {
  id: string;
  name: string;
  color: string;
  description: string;
}

interface StyleChip {
  id: string;
  name: string;
  color: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────
const VIDEO_STYLES: VideoStyle[] = [
  { id: "ugc", name: "UGC Style", color: "#FF6B6B", description: "Authentic user-generated content feel" },
  { id: "branded", name: "Branded Studio", color: "#4ECDC4", description: "Professional studio production" },
  { id: "cinematic", name: "Cinematic Ads", color: "#45B7D1", description: "Movie-quality cinematography" },
  { id: "tiktok", name: "TikTok Style", color: "#000000", description: "Trendy vertical short-form" },
  { id: "instagram", name: "Instagram Reel", color: "#E1306C", description: "Polished social media aesthetic" },
  { id: "product", name: "Product Showcase", color: "#F7B731", description: "Clean product presentation" },
  { id: "luxury", name: "Minimal Luxury", color: "#9C88FF", description: "Elegant high-end feel" },
  { id: "viral", name: "Viral Hook", color: "#FF4757", description: "Attention-grabbing opener" },
  { id: "explainer", name: "Explainer Style", color: "#2ED573", description: "Educational and clear" },
  { id: "avatar", name: "AI Avatar", color: "#3742FA", description: "AI presenter style" },
];

const STYLE_CHIPS: StyleChip[] = [
  { id: "ugc", name: "UGC", color: "#FF6B6B" },
  { id: "studio", name: "Studio", color: "#4ECDC4" },
  { id: "cinematic", name: "Cinematic", color: "#45B7D1" },
  { id: "neon", name: "Neon", color: "#FF00FF" },
  { id: "luxury", name: "Luxury", color: "#9C88FF" },
  { id: "minimal", name: "Minimal", color: "#A0A0A0" },
  { id: "dark", name: "Dark Ads", color: "#2C2C2C" },
  { id: "viral", name: "Viral", color: "#FF4757" },
  { id: "tech", name: "Tech", color: "#00D9FF" },
  { id: "fashion", name: "Fashion", color: "#E1306C" },
  { id: "ecommerce", name: "E-commerce", color: "#F7B731" },
  { id: "trendy", name: "Trendy", color: "#7B68EE" },
];

// ─────────────────────────────────────────────────────────────────────────────
// VIDEO GENERRATION HOOK (Abstracted for HuggingFace Inference API)
// ─────────────────────────────────────────────────────────────────────────────
const useVideoGeneration = () => {
  const generateVideo = useCallback(async (
    prompt: string,
    imageUrl: string | null,
    style: string,
    aspectRatio: string
  ): Promise<string> => {
    // Abstract integration point for HuggingFace Inference API
    // Model type: text-to-video OR image-to-video

    console.log("🎬 Video Generation Parameters:", {
      prompt,
      imageUrl,
      style,
      aspectRatio,
      timestamp: new Date().toISOString(),
    });

    // TODO: Replace with actual HuggingFace API call
    // Example structure:
    // const response = await fetch("https://api-inference.huggingface.co/models/{model}", {
    //   method: "POST",
    //   headers: {
    //     "Authorization": `Bearer ${HF_API_KEY}`,
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     inputs: prompt,
    //     parameters: {
    //       style,
    //       aspect_ratio: aspectRatio,
    //     },
    //   }),
    // });

    // Mock URL for development
    const mockVideoUrl = `https://example.com/generated-videos/${Date.now()}.mp4`;

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    return mockVideoUrl;
  }, []);

  return { generateVideo };
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
const MarketingVideo = () => {
  const { t } = useTranslation();
  const { generateVideo } = useVideoGeneration();

  // ─── EXISTING STATE (PRESERVED) ───
  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState<ImageUpload | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [aspectRatio, setAspectRatio] = useState("16:9");
  const [language, setLanguage] = useState("en");
  const [sections, setSections] = useState<string[]>(["hero"]);

  // ─── NEW STATE FOR ENHANCED FEATURES ───
  const [mode, setMode] = useState<Mode>("image");
  const [selectedVideoStyle, setSelectedVideoStyle] = useState<string | null>(null);
  const [selectedStyleChips, setSelectedStyleChips] = useState<Set<string>>(new Set());
  const [backgroundImage, setBackgroundImage] = useState<ImageUpload | null>(null);
  const [referenceImage, setReferenceImage] = useState<ImageUpload | null>(null);
  const [activeDropZone, setActiveDropZone] = useState<string | null>(null);

  // ─── EXISTING HANDLERS (PRESERVED) ───
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

  // ─── NEW HANDLERS FOR ENHANCED FEATURES ───
  const handleMultiDrop = useCallback((e: React.DragEvent, zoneId: string) => {
    e.preventDefault();
    setActiveDropZone(null);

    const file = e.dataTransfer.files[0];
    if (!file || !file.type.startsWith("image/")) return;

    const imageUpload: ImageUpload = {
      file,
      preview: URL.createObjectURL(file),
    };

    switch (zoneId) {
      case "product":
        setImage(imageUpload);
        break;
      case "background":
        setBackgroundImage(imageUpload);
        break;
      case "reference":
        setReferenceImage(imageUpload);
        break;
    }
  }, []);

  const handleMultiFileChange = (files: FileList | null, zoneId: string) => {
    if (!files || !files[0]) return;
    const file = files[0];
    if (!file.type.startsWith("image/")) return;

    const imageUpload: ImageUpload = {
      file,
      preview: URL.createObjectURL(file),
    };

    switch (zoneId) {
      case "product":
        setImage(imageUpload);
        break;
      case "background":
        setBackgroundImage(imageUpload);
        break;
      case "reference":
        setReferenceImage(imageUpload);
        break;
    }
  };

  const removeMultiImage = (zoneId: string) => {
    switch (zoneId) {
      case "product":
        if (image) URL.revokeObjectURL(image.preview);
        setImage(null);
        break;
      case "background":
        if (backgroundImage) URL.revokeObjectURL(backgroundImage.preview);
        setBackgroundImage(null);
        break;
      case "reference":
        if (referenceImage) URL.revokeObjectURL(referenceImage.preview);
        setReferenceImage(null);
        break;
    }
  };

  const toggleStyleChip = (chipId: string) => {
    setSelectedStyleChips(prev => {
      const newSet = new Set(prev);
      if (newSet.has(chipId)) {
        newSet.delete(chipId);
      } else {
        newSet.add(chipId);
      }
      return newSet;
    });
  };

  // ─── EXISTING GENERATE HANDLER (PRESERVED & EXTENDED) ───
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

    const formData = new FormData();

    formData.append("prompt", prompt);
    formData.append("aspect_ratio", aspectRatio);
    formData.append("language", language);
    formData.append("sections", JSON.stringify(sections));

    /* IMPORTANT: image -> image0 */
    formData.append("image0", image.file);

    /* IMPORTANT: always send mode */
    formData.append("mode", mode);

    /* video extras only for video mode */
    if (mode === "video") {

      formData.append(
        "video_style",
        selectedVideoStyle || ""
      );

      formData.append(
        "style_chips",
        JSON.stringify([...selectedStyleChips])
      );

      if (backgroundImage) {
        formData.append(
          "background_image",
          backgroundImage.file
        );
      }

      if (referenceImage) {
        formData.append(
          "reference_image",
          referenceImage.file
        );
      }
    }

    console.log("📤 Sending FORM DATA");
    console.log("Mode =", mode);
    try {
      const res = await fetch("https://notgivinashit.app.n8n.cloud/webhook-test/affiche", {
        method: "POST",
        body: formData
      });

      const text = await res.text();
      console.log("✅ Webhook response:", text);

      // NEW: Handle video generation for video mode
      if (mode === "video") {
        const generatedVideoUrl = await generateVideo(
          prompt,
          image?.preview || null,
          selectedVideoStyle || "default",
          aspectRatio
        );
        console.log("🎬 Generated video URL:", generatedVideoUrl);
      }

      setTimeout(() => {
        setGenerating(false);
        setVideoUrl("done");
      }, 1500);

    } catch (err) {
      console.error("❌ Webhook error:", err);
      setGenerating(false);
    }
  };

  // ─── ANIMATION VARIANTS ───
  const modeToggleVariants = {
    image: { x: 0, backgroundColor: "#4ECDC4" },
    video: { x: "100%", backgroundColor: "#FF6B6B" },
  };

  const panelSlideVariants = {
    hidden: { x: 300, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.4, ease: "easeOut" } },
    exit: { x: 300, opacity: 0, transition: { duration: 0.3, ease: "easeIn" } },
  };

  const chipVariants = {
    idle: { scale: 1 },
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
    selected: { scale: 1.08, boxShadow: "0 0 20px rgba(78, 205, 196, 0.5)" },
  };

  const dropZoneVariants = {
    idle: { borderColor: "rgba(255,255,255,0.1)", scale: 1 },
    active: { borderColor: "rgba(78, 205, 196, 0.8)", scale: 1.02 },
  };

  // ─── RENDER DROP ZONE COMPONENT ───
  const renderDropZone = (
    zoneId: string,
    label: string,
    imageState: ImageUpload | null,
    optional: boolean = false
  ) => (
    <motion.div
      variants={dropZoneVariants}
      animate={activeDropZone === zoneId ? "active" : "idle"}
      onDragOver={e => { e.preventDefault(); setActiveDropZone(zoneId); }}
      onDragLeave={() => setActiveDropZone(null)}
      onDrop={e => handleMultiDrop(e, zoneId)}
      onClick={() => document.getElementById(`file-input-${zoneId}`)?.click()}
      className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${activeDropZone === zoneId ? "bg-neon/5" : "bg-background/30"
        }`}
    >
      <input
        id={`file-input-${zoneId}`}
        type="file"
        className="hidden"
        accept="image/*"
        onChange={e => handleMultiFileChange(e.target.files, zoneId)}
      />

      <AnimatePresence mode="wait">
        {imageState ? (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="relative group"
          >
            <img
              src={imageState.preview}
              alt={label}
              className="w-full h-20 object-cover rounded-lg"
            />
            <button
              onClick={e => { e.stopPropagation(); removeMultiImage(zoneId); }}
              className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-lg transition-opacity"
            >
              <X className="text-white w-5 h-5" />
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="placeholder"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-1"
          >
            <Upload className="h-5 w-5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              {label} {optional && <span className="opacity-50">(optional)</span>}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );

  // ─── RENDER STYLE CARD ───
  const renderStyleCard = (style: VideoStyle) => (
    <motion.div
      key={style.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.03, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => setSelectedVideoStyle(style.id)}
      className={`relative p-4 rounded-xl cursor-pointer border-2 transition-all ${selectedVideoStyle === style.id
        ? "border-neon bg-neon/10"
        : "border-border bg-background/30 hover:border-neon/50"
        }`}
    >
      {/* Color Tag */}
      <div
        className="absolute top-2 right-2 w-3 h-3 rounded-full"
        style={{ backgroundColor: style.color }}
      />

      {/* Grip Handle */}
      <GripVertical className="absolute top-2 left-2 w-4 h-4 text-muted-foreground opacity-50" />

      {/* Content */}
      <h4 className="font-medium text-sm mb-1 pl-4">{style.name}</h4>
      <p className="text-xs text-muted-foreground">{style.description}</p>

      {/* Selection Indicator */}
      <AnimatePresence>
        {selectedVideoStyle === style.id && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="absolute bottom-2 right-2"
          >
            <Check className="w-4 h-4 text-neon" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );

  // ─── RENDER STYLE CHIP ───
  const renderStyleChip = (chip: StyleChip) => (
    <motion.button
      key={chip.id}
      variants={chipVariants}
      initial="idle"
      whileHover="hover"
      whileTap="tap"
      animate={selectedStyleChips.has(chip.id) ? "selected" : "idle"}
      onClick={() => toggleStyleChip(chip.id)}
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.1}
      whileDrag={{ scale: 1.1, zIndex: 50 }}
      className="relative px-4 py-2 rounded-full text-sm font-medium transition-all"
      style={{
        backgroundColor: selectedStyleChips.has(chip.id) ? chip.color : `${chip.color}20`,
        color: selectedStyleChips.has(chip.id) ? "#FFFFFF" : chip.color,
        border: `2px solid ${chip.color}`,
      }}
    >
      {chip.name}
    </motion.button>
  );

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

        {/* ═══════════════════════════════════════════════════════════════════════
            NEW: MODE SWITCHER
        ═══════════════════════════════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex justify-center mb-8"
        >
          <div className="glass-panel rounded-full p-1.5 inline-flex items-center relative">
            {/* Sliding Background */}
            <motion.div
              variants={modeToggleVariants}
              animate={mode}
              className="absolute h-[calc(100%-12px)] w-[calc(50%-6px)] rounded-full"
              style={{ left: "6px" }}
            />

            {/* Image Mode Button */}
            <button
              onClick={() => setMode("image")}
              className={`relative z-10 px-6 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${mode === "image" ? "text-black" : "text-foreground"
                }`}
            >
              <ImageIcon className="w-4 h-4" />
              Image Mode
            </button>

            {/* Video Mode Button */}
            <button
              onClick={() => setMode("video")}
              className={`relative z-10 px-6 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${mode === "video" ? "text-black" : "text-foreground"
                }`}
            >
              <Video className="w-4 h-4" />
              Video Mode
            </button>
          </div>
        </motion.div>

        {/* PROMPT */}
        <div className="glass-panel rounded-2xl p-6 mb-6">
          <textarea
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            placeholder={mode === "video" ? "Describe your video concept..." : "Describe your product..."}
            className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 text-sm min-h-[100px] resize-none focus:outline-none focus:ring-2 focus:ring-neon/50"
          />
        </div>

        {/* ═══════════════════════════════════════════════════════════════════════
            IMAGE MODE - EXISTING UPLOAD (PRESERVED)
        ═══════════════════════════════════════════════════════════════════════ */}
        <AnimatePresence mode="wait">
          {mode === "image" && (
            <motion.div
              key="image-mode"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              {/* IMAGE UPLOAD */}
              <div className="glass-panel rounded-2xl p-6 mb-6">
                <div
                  onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById("file-input")?.click()}
                  className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${isDragging ? "border-neon bg-neon/5" : "border-border"
                    }`}
                >
                  <input
                    id="file-input"
                    type="file"
                    className="hidden"
                    onChange={e => handleFileChange(e.target.files)}
                  />

                  <Upload className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Upload 1 product image</p>
                </div>

                {/* PREVIEW */}
                <AnimatePresence>
                  {image && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="mt-4 flex justify-center"
                    >
                      <div className="relative w-32 h-32 rounded-lg overflow-hidden group">
                        <img src={image.preview} className="w-full h-full object-cover" alt="Product preview" />
                        <button
                          onClick={removeImage}
                          className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                        >
                          <X className="text-white w-5 h-5" />
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ═══════════════════════════════════════════════════════════════════════
            VIDEO MODE - NEW VIDEO PANEL
        ═══════════════════════════════════════════════════════════════════════ */}
        <AnimatePresence>
          {mode === "video" && (
            <motion.div
              key="video-mode"
              variants={panelSlideVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="space-y-6 mb-6"
            >
              {/* ENHANCED MULTI-ZONE UPLOAD */}
              <div className="glass-panel rounded-2xl p-6">
                <h3 className="text-sm font-medium mb-4 flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  Media Assets
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {renderDropZone("product", "Product Image", image)}
                  {renderDropZone("background", "Background Image", backgroundImage, true)}
                  {renderDropZone("reference", "Style Reference", referenceImage, true)}
                </div>
              </div>

              {/* VIDEO STYLES GRID */}
              <div className="glass-panel rounded-2xl p-6">
                <h3 className="text-sm font-medium mb-4 flex items-center gap-2">
                  <Film className="w-4 h-4" />
                  Video Style
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {VIDEO_STYLES.map(renderStyleCard)}
                </div>
              </div>

              {/* STYLE CHIPS */}
              <div className="glass-panel rounded-2xl p-6">
                <h3 className="text-sm font-medium mb-4 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Style Tags
                  <span className="text-xs text-muted-foreground font-normal ml-2">
                    (Drag or click to select)
                  </span>
                </h3>

                <div className="flex flex-wrap gap-2">
                  {STYLE_CHIPS.map(renderStyleChip)}
                </div>

                {/* Selected Chips Preview */}
                <AnimatePresence>
                  {selectedStyleChips.size > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 pt-4 border-t border-border"
                    >
                      <p className="text-xs text-muted-foreground mb-2">
                        Selected styles ({selectedStyleChips.size}):
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {[...selectedStyleChips].map(chipId => {
                          const chip = STYLE_CHIPS.find(c => c.id === chipId);
                          return chip ? (
                            <motion.span
                              key={chipId}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="px-2 py-0.5 rounded text-xs"
                              style={{ backgroundColor: chip.color, color: "#fff" }}
                            >
                              {chip.name}
                            </motion.span>
                          ) : null;
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* SETTINGS (PRESERVED) */}
        <div className="glass-panel rounded-2xl p-6 mb-6 space-y-4">

          <div>
            <p className="text-sm mb-2">Aspect Ratio</p>
            <div className="flex gap-2 flex-wrap">
              {["9:16", "16:9", "1:1", "4:5", "3:2", "21:9"].map(r => (
                <button
                  key={r}
                  onClick={() => setAspectRatio(r)}
                  className={`px-3 py-2 rounded-lg border transition-all ${aspectRatio === r ? "bg-neon text-black border-neon" : "border-border hover:border-neon/50"
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
              className="w-full rounded-lg border border-border bg-background/50 p-2 focus:outline-none focus:ring-2 focus:ring-neon/50"
            >
              <option value="en">English</option>
              <option value="fr">French</option>
              <option value="ar">Arabic</option>
            </select>
          </div>

          <div>
            <p className="text-sm mb-2">AI Sections</p>
            <div className="flex gap-2 flex-wrap">
              {["hero", "reviews", "faq", "features", "benefits", "pricing", "cta"].map(sec => (
                <button
                  key={sec}
                  onClick={() =>
                    setSections(prev =>
                      prev.includes(sec)
                        ? prev.filter(s => s !== sec)
                        : [...prev, sec]
                    )
                  }
                  className={`px-3 py-2 rounded-lg border transition-all capitalize ${sections.includes(sec) ? "bg-neon text-black border-neon" : "border-border hover:border-neon/50"
                    }`}
                >
                  {sec}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* GENERATE (PRESERVED) */}
        <motion.button
          onClick={handleGenerate}
          disabled={generating}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-3 rounded-xl bg-neon text-black font-semibold mb-6 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          <span className="flex items-center justify-center gap-2">
            {generating ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="w-5 h-5" />
                </motion.div>
                Generating...
              </>
            ) : (
              <>
                {mode === "video" ? <Video className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
                Generate {mode === "video" ? "Video" : "Content"}
              </>
            )}
          </span>
        </motion.button>

        {/* OUTPUT */}
        <div className="glass-panel rounded-2xl p-6">
          <div className="aspect-video flex items-center justify-center rounded-xl bg-background/30">
            <AnimatePresence mode="wait">
              {generating ? (
                <motion.div
                  key="generating"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center gap-3"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <Sparkles className="w-8 h-8 text-neon" />
                  </motion.div>
                  <p className="text-sm text-muted-foreground">
                    {mode === "video" ? "Creating your video..." : "Generating content..."}
                  </p>
                </motion.div>
              ) : videoUrl ? (
                <motion.div
                  key="done"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex flex-col items-center gap-2"
                >
                  <Check className="w-12 h-12 text-neon" />
                  <p className="text-sm font-medium">Generation Complete</p>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center"
                >
                  <Film className="w-12 h-12 mx-auto mb-2 text-muted-foreground/50" />
                  <p className="text-sm text-muted-foreground">No output yet</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

      </div>
    </div>
  );
};

export default MarketingVideo;