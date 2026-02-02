import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

type Narration = {
  title: string;
  body?: string;
};

function parseNarration(raw: string | null): Narration | null {
  if (!raw) return null;
  const [title, ...rest] = raw.split("|");
  const body = rest.join("|").trim();
  return {
    title: (title ?? "").trim(),
    body: body.length ? body : undefined,
  };
}

export default function CursorNarrator() {
  const reduceMotion = useReducedMotion();
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [active, setActive] = useState<Narration | null>(null);
  const rafRef = useRef<number | null>(null);

  const isFinePointer = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia?.("(pointer: fine)")?.matches ?? false;
  }, []);

  useEffect(() => {
    if (!isFinePointer) return;

    const onMove = (e: MouseEvent) => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        setPos({ x: e.clientX, y: e.clientY });
      });
    };

    const onOver = (e: MouseEvent) => {
      const target = (e.target as HTMLElement | null)?.closest?.("[data-narrate]") as HTMLElement | null;
      setActive(parseNarration(target?.getAttribute("data-narrate") ?? null));
    };

    const onOut = (e: MouseEvent) => {
      const related = (e.relatedTarget as HTMLElement | null)?.closest?.("[data-narrate]") as HTMLElement | null;
      setActive(parseNarration(related?.getAttribute("data-narrate") ?? null));
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });
    window.addEventListener("mouseout", onOut, { passive: true });
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      window.removeEventListener("mouseout", onOut);
    };
  }, [isFinePointer]);

  if (!isFinePointer) return null;

  const tooltipX = Math.min(pos.x + 18, window.innerWidth - 320);
  const tooltipY = Math.min(pos.y + 18, window.innerHeight - 140);

  return (
    <div className="pointer-events-none fixed inset-0 z-50">
      {/* Cursor core */}
      <motion.div
        aria-hidden
        className="absolute h-3 w-3 rounded-full bg-neon neon-outline"
        style={{ left: pos.x - 6, top: pos.y - 6 }}
        animate={reduceMotion ? undefined : { scale: active ? 1.25 : 1 }}
        transition={{ duration: 0.18, ease: "easeOut" }}
      />

      {/* Soft halo */}
      <motion.div
        aria-hidden
        className="absolute h-16 w-16 rounded-full"
        style={{ left: pos.x - 32, top: pos.y - 32, background: "radial-gradient(circle, hsl(var(--neon) / 0.22), transparent 60%)" }}
        animate={reduceMotion ? undefined : { opacity: active ? 1 : 0.6, scale: active ? 1.05 : 1 }}
        transition={{ duration: 0.22, ease: "easeOut" }}
      />

      {/* Narrator tooltip */}
      <motion.div
        aria-hidden
        className="absolute w-[300px] rounded-xl glass px-3 py-2"
        style={{ left: tooltipX, top: tooltipY }}
        initial={{ opacity: 0, y: 6, filter: "blur(6px)" }}
        animate={active ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0, y: 6, filter: "blur(6px)" }}
        transition={{ duration: reduceMotion ? 0 : 0.22, ease: "easeOut" }}
      >
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs font-semibold tracking-wide text-shimmer">{active?.title ?? ""}</p>
          <span className="h-1.5 w-1.5 rounded-full bg-gold animate-glow" />
        </div>
        {active?.body ? <p className="mt-1 text-xs text-muted-foreground">{active.body}</p> : null}
      </motion.div>
    </div>
  );
}
