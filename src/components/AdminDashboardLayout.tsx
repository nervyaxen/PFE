import { ReactNode } from "react";
import { motion } from "framer-motion";

interface AdminDashboardLayoutProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export default function AdminDashboardLayout({ title, subtitle, children }: AdminDashboardLayoutProps) {
  return (
    <div className="min-h-screen pt-24 pb-16 bg-slate-950 text-white">
      <div className="container mx-auto max-w-6xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="glass-panel border border-border/30 bg-slate-900/80 shadow-2xl shadow-black/20 rounded-[2rem] overflow-hidden"
        >
          <div className="px-6 py-6 border-b border-border/20 bg-slate-950/90">
            <h1 className="text-3xl font-bold tracking-tight text-neon">{title}</h1>
            {subtitle ? <p className="mt-2 text-sm text-muted-foreground max-w-2xl">{subtitle}</p> : null}
          </div>
          <div className="p-6">{children}</div>
        </motion.div>
      </div>
    </div>
  );
}
