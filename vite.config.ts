import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime", "@tanstack/react-query", "@tanstack/query-core"],
  },
  build: {
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime"],
          router: ["react-router-dom"],
          motion: ["framer-motion"],
          supabase: ["@supabase/supabase-js"],
          recharts: ["recharts"],
          three: ["three"],
          vendor: ["@xenova/transformers", "date-fns", "i18next", "react-i18next"],
        },
      },
    },
  },
}));
