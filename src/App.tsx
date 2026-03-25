import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { I18nProvider } from "@/i18n";
import Header from "@/components/machrou3i/Header";
import GlobalSidebarMenu from "@/components/machrou3i/GlobalSidebarMenu";
import FirstVisitRedirect from "@/components/machrou3i/FirstVisitRedirect";
import Index from "./pages/Index";
import Payment from "./pages/Payment";
import NotFound from "./pages/NotFound";
import Library from "./pages/Library";
import AIGuidedProjectCreator from "./pages/AIGuidedProjectCreator";
import ProjectDashboard from "./pages/ProjectDashboard";
import CinematicResults from "./pages/ai-creator/CinematicResults";

// New Components
import CinematicBackground from "@/components/machrou3i/CinematicBackground";
import CustomAnimatedCursor from "@/components/machrou3i/CustomAnimatedCursor";
import CinematicIntro, { hasSeenIntro, markIntroSeen } from "@/components/machrou3i/CinematicIntro";
import ProtectedRoute from "@/components/machrou3i/ProtectedRoute";
import AdminRoute from "@/components/machrou3i/AdminRoute";
import AIAssistantWidget from "@/components/machrou3i/AIAssistantWidget";

// Auth Pages
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import StartFree from "./pages/auth/StartFree";

// Dashboards
import WorkspaceDashboard from "./pages/WorkspaceDashboard";
import AnalyticsDashboard from "./pages/analytics/AnalyticsDashboard";
import FinancialIntelligence from "./pages/financial/FinancialIntelligence";

// Admin
import AdminControlCenter from "./pages/admin/AdminControlCenter";

const queryClient = new QueryClient();

const App = () => {
  const [showIntro, setShowIntro] = useState(false);

  useEffect(() => {
    // Check if the cinematic intro has been seen
    if (!hasSeenIntro()) {
      setShowIntro(true);
    }
  }, []);

  const handleIntroComplete = () => {
    markIntroSeen();
    setShowIntro(false);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <I18nProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            {/* Global 3D & Cursor Effects */}
            <CinematicBackground />
            <CustomAnimatedCursor />
            <AIAssistantWidget />

            {showIntro && <CinematicIntro onComplete={handleIntroComplete} />}

            <BrowserRouter>
              <FirstVisitRedirect />
              <Header />
              <GlobalSidebarMenu />
              <Routes>
                {/* Public / Landing Routes */}
                <Route path="/" element={<Index />} />
                <Route path="/payment" element={<Payment />} />

                {/* Auth Routes */}
                <Route path="/auth/login" element={<Login />} />
                <Route path="/auth/signup" element={<Signup />} />
                <Route path="/auth/start-free" element={<StartFree />} />

                {/* Legacy library route */}
                <Route path="/library" element={<Library />} />
                <Route path="/library/ai-creator" element={<AIGuidedProjectCreator />} />

                {/* Authenticated Workspace & Dashboard Routes */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/workspace" element={<WorkspaceDashboard />} />
                  <Route path="/analytics" element={<AnalyticsDashboard />} />
                  <Route path="/financial" element={<FinancialIntelligence />} />
                  <Route path="/projects/:projectId" element={<ProjectDashboard />} />
                  <Route path="/projects/:projectId/results" element={<CinematicResults />} />
                </Route>

                {/* Admin Exclusive Routes */}
                <Route element={<AdminRoute />}>
                  <Route path="/admin" element={<AdminControlCenter />} />
                </Route>

                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </I18nProvider>
      </HelmetProvider>
    </QueryClientProvider>
  );
};

export default App;
