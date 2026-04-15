import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Sparkles, Eye, Users, DollarSign, Map } from "lucide-react";

const scenes = [
  { key: "sparkles", icon: Sparkles, gradient: "from-neon/20 to-transparent" },
  { key: "vision", icon: Eye, gradient: "from-gold/20 to-transparent" },
  { key: "audience", icon: Users, gradient: "from-neon/20 to-transparent" },
  { key: "monetization", icon: DollarSign, gradient: "from-gold/20 to-transparent" },
  { key: "roadmap", icon: Map, gradient: "from-neon/20 to-transparent" },
];

const SCENE_DURATION = 2800;

const CinematicIntro = ({ onComplete }: { onComplete: () => void }) => {
  const { t } = useTranslation();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (current >= scenes.length) {
      onComplete();
      return;
    }
    const timer = setTimeout(() => setCurrent((p) => p + 1), SCENE_DURATION);
    return () => clearTimeout(timer);
  }, [current, onComplete]);

  if (current >= scenes.length) return null;

  const scene = scenes[current];

  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-background flex flex-col items-center justify-center"
      exit={{ opacity: 0 }}
    >
      {/* Parallax background layers */}
      <motion.div
        className={`absolute inset-0 bg-gradient-radial ${scene.gradient}`}
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 2.8, ease: "easeInOut" }}
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={scene.key}
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: -20 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center relative z-10"
        >
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 3, ease: "linear", repeat: Infinity }}
            className="w-20 h-20 rounded-2xl bg-primary/30 flex items-center justify-center mx-auto mb-6 glow-neon"
          >
            <scene.icon className="h-10 w-10 text-neon" />
          </motion.div>
          <h2 className="text-3xl md:text-4xl font-bold font-heading mb-3">
            {t(`intro.${scene.key}.title`)}
          </h2>
          <p className="text-muted-foreground text-lg max-w-md mx-auto">
            {t(`intro.${scene.key}.desc`)}
          </p>
        </motion.div>
      </AnimatePresence>

      {/* Progress */}
      <div className="absolute bottom-20 flex gap-2">
        {scenes.map((_, i) => (
          <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === current ? "w-8 bg-neon" : i < current ? "w-4 bg-neon/50" : "w-4 bg-secondary"}`} />
        ))}
      </div>

      {/* Skip */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        onClick={onComplete}
        className="absolute bottom-8 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        {t("intro.skip")} →
      </motion.button>
    </motion.div>
  );
};

export default CinematicIntro;
