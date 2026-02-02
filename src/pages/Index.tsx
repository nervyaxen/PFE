import { Helmet } from "react-helmet-async";
import CursorNarrator from "@/components/machrou3i/CursorNarrator";
import HeroScene from "@/components/machrou3i/HeroScene";
import StorySection from "@/components/machrou3i/StorySection";
import RoadmapSection from "@/components/machrou3i/RoadmapSection";
import AnalyticsSection from "@/components/machrou3i/AnalyticsSection";
import MarketAnalysisSection from "@/components/machrou3i/MarketAnalysisSection";
import ProductAnalysisSection from "@/components/machrou3i/ProductAnalysisSection";
import PricingSection from "@/components/machrou3i/PricingSection";
import AdminSection from "@/components/machrou3i/AdminSection";
import AuthSection from "@/components/machrou3i/AuthSection";
import DashboardSection from "@/components/machrou3i/DashboardSection";
import AIInsightsSection from "@/components/machrou3i/AIInsightsSection";
import PlatformStackSection from "@/components/machrou3i/PlatformStackSection";
import { useI18n } from "@/i18n";
import { Laptop, Smartphone, Monitor, Cpu, Shield, LogIn, Sparkles } from "lucide-react";

const Index = () => {
  const { t } = useI18n();
  return (
    <div className="relative min-h-screen bg-hero pt-20">
      <Helmet>
        <title>Machrou3i – Intelligence for Projects</title>
        <meta
          name="description"
          content="Machrou3i is a cross-platform, AI-powered project management platform: plan roadmaps, analyze teams, predict markets, and automate workflows—one codebase for web, mobile, and desktop."
        />
        <link rel="canonical" href="/" />
      </Helmet>

      <CursorNarrator />

      <main className="story-snap relative">
        <HeroScene />

        <StorySection
          id="ecosystem"
          eyebrow={t("ecosystem.eyebrow")}
          title={t("ecosystem.title")}
          subtitle={t("ecosystem.subtitle")}
          icon={<Monitor className="h-5 w-5" />}
          bullets={[
            { icon: <Laptop className="h-4 w-4" />, title: t("ecosystem.desktopReady"), desc: t("ecosystem.desktopReadyDesc") },
            { icon: <Smartphone className="h-4 w-4" />, title: t("ecosystem.mobileFirst"), desc: t("ecosystem.mobileFirstDesc") },
            { icon: <Cpu className="h-4 w-4" />, title: t("ecosystem.unifiedLogic"), desc: t("ecosystem.unifiedLogicDesc") },
            { icon: <Shield className="h-4 w-4" />, title: t("ecosystem.secureByDesign"), desc: t("ecosystem.secureByDesignDesc") },
          ]}
          spotlight={t("ecosystem.spotlight")}
          variant="connectors"
        />

        <RoadmapSection />

        <AnalyticsSection />

        <MarketAnalysisSection />

        <ProductAnalysisSection />

        <PricingSection />

        <AdminSection />

        <AuthSection />

        {/* Legacy StorySection removed - using AuthSection component above */}
        {/* <StorySection
          id="auth"
          eyebrow="Login / Signup"
          title="Onboarding that feels weightless."
          subtitle="Glassmorphic forms with neon focus—designed for conversion and calm." 
          icon={<LogIn className="h-5 w-5" />}
          bullets={[
            { icon: <LogIn className="h-4 w-4" />, title: "Smooth switching", desc: "Login and signup as a single cinematic flow." },
            { icon: <Sparkles className="h-4 w-4" />, title: "Guided focus", desc: "Cursor narrator gently points where to act." },
            { icon: <Shield className="h-4 w-4" />, title: "Secure posture", desc: "JWT + RBAC ready (architecture section below)." },
          ]}
          spotlight="(Demo UI) — we can wire real authentication when you’re ready."
          variant="auth"
        /> */}

        <DashboardSection />

        <AIInsightsSection />
        <PlatformStackSection />

        <footer className="relative px-6 py-16">
          <div className="mx-auto max-w-6xl glass rounded-2xl p-8">
            <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t("footer.machrou3i")}</p>
                <p className="text-lg font-semibold">{t("footer.intelligence")}</p>
              </div>
              <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} — {t("footer.copyright")}</p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Index;
