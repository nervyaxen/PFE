import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import "@/i18n";
import { AuthProvider } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ParticleBackground from "@/components/ParticleBackground";
import GlowCursor from "@/components/GlowCursor";
import CinematicIntro from "@/components/CinematicIntro";
import Index from "./pages/Index";
import Pricing from "./pages/Pricing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import NewProject from "./pages/NewProject";
import Results from "./pages/Results";
import Admin from "./pages/Admin";
import MarketingVideo from "./pages/MarketingVideo";
import Payment from "./pages/Payment";
import NotFound from "./pages/NotFound";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";

const queryClient = new QueryClient();

const AppContent = () => {
  const [introComplete, setIntroComplete] = useState(false);

  return (
    <>
      <AnimatePresence>
        {!introComplete && <CinematicIntro onComplete={() => setIntroComplete(true)} />}
      </AnimatePresence>
      <GlowCursor />
      <ParticleBackground />
      <Navbar />
      <main className="relative z-10">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/new-project" element={<NewProject />} />
          <Route path="/results/:id" element={<Results />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/marketing-video" element={<MarketingVideo />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
