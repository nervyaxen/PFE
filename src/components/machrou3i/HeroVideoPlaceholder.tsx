import { useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { PlayCircle } from "lucide-react";
import { useI18n } from "@/i18n";

export default function HeroVideoPlaceholder() {
    const reduceMotion = useReducedMotion();
    const videoRef = useRef<HTMLVideoElement>(null);
    const { t } = useI18n();

    return (
        <motion.div
            className="relative w-full h-full bg-surface/50 flex items-center justify-center group cursor-pointer overflow-hidden"
            whileHover={reduceMotion ? undefined : { scale: 1.02 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            onClick={() => {
                if (videoRef.current) {
                    videoRef.current.paused ? videoRef.current.play() : videoRef.current.pause();
                }
            }}
        >
            {/* Fallback 3D Gradient Depth showing it's a video placeholder */}
            <div
                className="absolute inset-0 z-0 opacity-40 transition-opacity duration-700 group-hover:opacity-70"
                style={{
                    background: "linear-gradient(135deg, hsl(var(--neon)/0.2) 0%, transparent 50%, hsl(var(--gold)/0.2) 100%)"
                }}
            />

            {/* Actual Video Element (Placeholder source) */}
            <video
                ref={videoRef}
                className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-screen"
                muted
                loop
                playsInline
                poster="https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=2000&auto=format&fit=crop"
            >
                <source src="https://cdn.pixabay.com/video/2023/10/22/186115-876932403_large.mp4" type="video/mp4" />
            </video>

            {/* Floating Play Button Overlay */}
            <div className="relative z-10 flex flex-col items-center gap-3">
                <motion.div
                    className="w-16 h-16 rounded-full glass border border-neon/40 flex items-center justify-center text-neon shadow-[0_0_30px_-5px_hsl(var(--neon)/0.6)] group-hover:scale-110 transition-transform duration-300"
                >
                    <PlayCircle className="w-8 h-8" />
                </motion.div>
                <p className="text-sm font-medium tracking-wide text-shimmer bg-background/40 px-3 py-1 rounded-full backdrop-blur-md border border-border/50">
                    Watch Cinematic Overview
                </p>
            </div>

            {/* Cinematic Edge Lighting */}
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-background/80 to-transparent pointer-events-none" />
            <div className="absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-background/50 to-transparent pointer-events-none" />
        </motion.div>
    );
}
