import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const GlowCursor = () => {
  const [pos, setPos] = useState({ x: -100, y: -100 });

  useEffect(() => {
    const handler = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  return (
    <motion.div
      className="fixed pointer-events-none z-[90] w-6 h-6 rounded-full"
      style={{
        background: "radial-gradient(circle, hsla(164,95%,56%,0.4) 0%, transparent 70%)",
        boxShadow: "0 0 30px hsla(164,95%,56%,0.3), 0 0 60px hsla(164,95%,56%,0.1)",
        width: 40,
        height: 40,
      }}
      animate={{ x: pos.x - 20, y: pos.y - 20 }}
      transition={{ type: "spring", stiffness: 500, damping: 28, mass: 0.5 }}
    />
  );
};

export default GlowCursor;
