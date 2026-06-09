import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import "@/i18n";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ParticleBackground from "@/components/ParticleBackground";
import GlowCursor from "@/components/GlowCursor";
import CinematicIntro from "@/components/CinematicIntro";
import ProtectedRoute from "./components/ProtectedRoute";
import { lazy, Suspense, useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";

const Index = lazy(() => import("./pages/Index"));
const Pricing = lazy(() => import("./pages/Pricing"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const NewProject = lazy(() => import("./pages/NewProject"));
const Payment = lazy(() => import("./pages/Payment"));
const Chatbot = lazy(() => import("./pages/Chatbot"));
const Brands = lazy(() => import("./pages/Brands"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Admin = lazy(() => import("./pages/Admin"));
const MarketingVideo = lazy(() => import("./pages/MarketingVideo"));
const PfeTesting = lazy(() => import("./pages/PfeTesting"));
const Enterprise = lazy(() => import("./pages/Enterprise"));
const BusinessNames = lazy(() => import("./pages/BusinessNames"));
const LogoGenerator = lazy(() => import("./pages/LogoGenerator"));
const OpportunityFinder = lazy(() => import("./pages/OpportunityFinder"));
const FAQ = lazy(() => import("./pages/FAQ"));

const queryClient = new QueryClient();

const AppContent = () => {
  const [introComplete, setIntroComplete] = useState(false);
  const { isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAdmin && !location.pathname.startsWith("/admin") && location.pathname !== "/pfe-testing") {
      navigate("/admin", { replace: true });
    }
  }, [isAdmin, location.pathname, navigate]);

  return (
    <>
      <AnimatePresence>
        {!introComplete && <CinematicIntro mode={isAdmin ? "admin" : "user"} onComplete={() => setIntroComplete(true)} />}
      </AnimatePresence>
      <GlowCursor />
      <ParticleBackground />
      {!isAdmin && <Navbar />}
      <main className="relative z-10">
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-sm text-muted-foreground">Loading application…</div>}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/new-project" element={<NewProject />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/marketing-video" element={<MarketingVideo />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/chatbot" element={<Chatbot />} />
            <Route path="/brands" element={<Brands />} />

            {/* Locked Premium Enterprise Coordinates */}
            <Route
              path="/entreprise"
              element={
                <ProtectedRoute requirePremium={true}>
                  <Enterprise />
                </ProtectedRoute>
              }
            />
            <Route
              path="/business-names"
              element={
                <ProtectedRoute requirePremium={true}>
                  <BusinessNames />
                </ProtectedRoute>
              }
            />
            <Route
              path="/logo-generator"
              element={
                <ProtectedRoute requirePremium={true}>
                  <LogoGenerator />
                </ProtectedRoute>
              }
            />
            <Route
              path="/opportunity-finder"
              element={
                <ProtectedRoute requirePremium={true}>
                  <OpportunityFinder />
                </ProtectedRoute>
              }
            />
            <Route
              path="/pfe-testing"
              element={
                <ProtectedRoute>
                  <PfeTesting />
                </ProtectedRoute>
              }
            />
            <Route path="/faq" element={<FAQ />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      {!isAdmin && <Footer />}
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
