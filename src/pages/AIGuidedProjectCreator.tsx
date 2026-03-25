import { useMemo, useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Sparkles, ArrowLeft, ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { useI18n } from "@/i18n";
import { useAiGuidedProject } from "@/hooks/use-ai-guided-project";
import { upsertProjectFromDraft } from "@/lib/ai-guided-project";
import StoryTimeline from "@/components/machrou3i/StoryTimeline";
import ScenarioCards from "@/components/machrou3i/ScenarioCards";
import type { ScenarioCardId } from "@/components/machrou3i/ScenarioCards";
import IdeaExpansionSuggestions from "@/components/machrou3i/IdeaExpansionSuggestions";
import MarketSignalIndicators from "@/components/machrou3i/MarketSignalIndicators";
import StepConclusionHint from "@/components/machrou3i/StepConclusionHint";
import CinematicIntro, { hasSeenIntro, clearIntroSeen } from "@/components/machrou3i/CinematicIntro";

function useQueryParam(name: string) {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search).get(name), [search, name]);
}

const TOTAL_STEPS = 5;

export default function AIGuidedProjectCreator() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();
  const resumeFlag = useQueryParam("resume");
  const projectIdParam = useQueryParam("projectId");

  const { draft, updateStep, goToStep, generateRoadmap, clearDraft } = useAiGuidedProject(projectIdParam);

  const [showIntro, setShowIntro] = useState(false);
  useEffect(() => {
    const shouldShowIntro =
      !resumeFlag &&
      !projectIdParam &&
      !hasSeenIntro();
    setShowIntro(shouldShowIntro);
  }, [resumeFlag, projectIdParam]);

  const currentStep = draft.currentStep;
  const progressValue = (currentStep / TOTAL_STEPS) * 100;

  const handleBack = () => {
    if (currentStep === 1) {
      navigate("/library");
      return;
    }
    goToStep(currentStep - 1);
  };

  const handleNext = () => {
    if (currentStep === 5) {
      handleConfirm();
      return;
    }
    if (currentStep < TOTAL_STEPS) {
      goToStep(currentStep + 1);
    }
  };

  const handleGenerateRoadmap = () => {
    generateRoadmap();
  };

  const handleConfirm = () => {
    const project = upsertProjectFromDraft({
      ...draft,
      roadmap: draft.roadmap ?? null,
    });
    // Do NOT clear draft yet if we want results to read it, but upsert saves to DB.
    clearDraft();
    // Redirect to Cinematic Results
    navigate(`/projects/${project.id}/results`);
  };

  const handleResume = () => {
    if (resumeFlag) {
      goToStep(draft.currentStep || 1);
    }
  };

  const handleScenarioApply = (scenarioId: ScenarioCardId) => {
    if (currentStep === 2) {
      if (scenarioId === "targetStudents") {
        updateStep("step2", {
          ...draft.step2,
          problem: draft.step2.problem || "Students struggle to stay organized and focused.",
          solution: draft.step2.solution || "A focused tool for study planning and accountability.",
        });
      } else if (scenarioId === "becomeSaaS") {
        updateStep("step2", {
          ...draft.step2,
          solution: draft.step2.solution || "A cloud-based platform with subscription access.",
        });
      } else if (scenarioId === "goB2B") {
        updateStep("step2", {
          ...draft.step2,
          problem: draft.step2.problem || "Enterprises need scalable, secure solutions.",
        });
      }
    }
    if (currentStep === 3) {
      if (scenarioId === "targetStudents") {
        updateStep("step3", { ...draft.step3, targetUsers: "Students (university, campus)", industry: draft.step3.industry || "Education", region: draft.step3.region || "" });
      } else if (scenarioId === "becomeSaaS") {
        updateStep("step3", { ...draft.step3, industry: draft.step3.industry || "SaaS", region: draft.step3.region || "" });
      } else if (scenarioId === "goB2B") {
        updateStep("step3", { ...draft.step3, targetUsers: "B2B enterprises, SMBs", industry: draft.step3.industry || "Enterprise", region: draft.step3.region || "" });
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[120] bg-background/95 backdrop-blur-3xl overflow-hidden flex flex-col w-full">
      <Helmet>
        <title>Machrou3i – {t("aiCreator.title")}</title>
        <meta name="description" content={t("aiCreator.subtitle")} />
        <link rel="canonical" href="/library/ai-creator" />
      </Helmet>

      {showIntro && (
        <CinematicIntro onComplete={() => setShowIntro(false)} />
      )}

      {!showIntro && (
        <motion.div
          className="flex-1 flex flex-col min-h-0 overflow-hidden relative w-full h-full"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Parallax depth layers */}
          <div
            className="absolute inset-0 opacity-40 mix-blend-screen pointer-events-none"
            style={{
              background:
                "radial-gradient(1200px 800px at 15% 0%, hsl(var(--neon) / 0.15), transparent 55%), radial-gradient(1000px 600px at 85% 100%, hsl(var(--gold) / 0.12), transparent 50%), radial-gradient(800px 500px at 50% 50%, hsl(var(--primary) / 0.18), transparent 60%)",
            }}
          />

          <header className="flex-shrink-0 flex flex-col gap-3 p-4 sm:p-6 lg:p-8 md:flex-row md:items-center md:justify-between relative z-10 w-full mx-auto">
            <div className="flex items-center gap-4 min-w-0">
              <Button
                variant="ghost"
                size="icon"
                className="glass glass-hover h-10 w-10 sm:h-12 sm:w-12 rounded-xl flex-shrink-0 floating-panel border border-border/60 hover:border-neon/40 shadow-[0_0_15px_-5px_hsl(var(--neon)/0.3)]"
                onClick={handleBack}
                aria-label={t("aiCreator.backToLibrary")}
              >
                <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
              <div className="min-w-0">
                <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-1.5 depth-shadow mb-1 border-neon/30">
                  <span className="inline-flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-xl bg-primary flex-shrink-0 shadow-[0_0_10px_-2px_hsl(var(--neon)/0.5)]">
                    <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-primary-foreground" />
                  </span>
                  <p className="text-[10px] sm:text-[11px] font-semibold tracking-wide text-foreground truncate uppercase text-shadow-sm">
                    {(t as any)("cinematic.chapter", { n: currentStep })} · {t("aiCreator.eyebrow")}
                  </p>
                </div>
                <h1 className="mt-1.5 text-lg sm:text-xl md:text-2xl font-semibold text-shimmer truncate">
                  {t("aiCreator.title")}
                </h1>
                <p className="mt-0.5 text-xs sm:text-sm text-muted-foreground line-clamp-2">
                  {t("aiCreator.subtitle")}
                </p>
                {currentStep === 1 && hasSeenIntro() && (
                  <button
                    type="button"
                    onClick={() => {
                      clearIntroSeen();
                      setShowIntro(true);
                    }}
                    className="mt-2 text-[11px] text-muted-foreground hover:text-neon transition-colors"
                  >
                    {t("aiCreator.replayIntro")}
                  </button>
                )}
              </div>
            </div>

            <div className="flex-shrink-0 w-full md:w-64 space-y-3 relative z-10">
              <StoryTimeline currentStep={currentStep} totalSteps={TOTAL_STEPS} />
              <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                <span>{(t as any)("aiCreator.stepLabel", { current: currentStep, total: TOTAL_STEPS })}</span>
                <span>{Math.round(progressValue)}%</span>
              </div>
              <Progress value={progressValue} className="h-1.5" />
              {resumeFlag && (
                <Button variant="outline" size="sm" className="w-full glass-hover mt-1 h-8 text-[11px]" onClick={handleResume}>
                  {t("aiCreator.resumeBanner")}
                </Button>
              )}
            </div>
          </header>

          <main className="flex-1 min-h-0 flex flex-col w-full mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8 pb-8 sm:pb-16 lg:pb-24 relative z-10">
            <div
              className="w-full h-full flex flex-col mx-auto"
              style={{ perspective: "1500px" }}
            >
              <motion.div
                className="glass bg-surface/80 rounded-[1.5rem] sm:rounded-[2rem] lg:rounded-[2.5rem] overflow-hidden relative cinematic-panel floating-panel depth-shadow-elevated border-white/10 dark:border-white/5 flex flex-col max-h-full min-h-0 w-full"
                initial={reduceMotion ? false : { opacity: 0, y: 30, z: -50, rotateX: 5 }}
                animate={reduceMotion ? undefined : { opacity: 1, y: 0, z: 0, rotateX: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                key={currentStep}
                style={{
                  boxShadow: "var(--shadow-elev), 0 30px 100px -20px hsl(var(--neon) / 0.15), 0 0 0 1px hsl(var(--border) / 0.6)",
                }}
              >
                <div
                  className="pointer-events-none absolute inset-0 opacity-70"
                  style={{
                    background:
                      "radial-gradient(900px 520px at 10% 0%, hsl(var(--neon) / 0.16), transparent 60%), radial-gradient(800px 460px at 90% 100%, hsl(var(--gold) / 0.14), transparent 58%)",
                  }}
                />

                <div className="overflow-y-auto themed-scrollbar w-full h-full relative z-10 px-5 sm:px-8 lg:px-12 py-6 sm:py-8 lg:py-10">
                  <div className="relative grid gap-8 md:grid-cols-[1fr_1.2fr] md:items-start lg:gap-12">
                    <motion.div
                      initial={reduceMotion ? false : { opacity: 0, y: 20, x: -10 }}
                      animate={reduceMotion ? undefined : { opacity: 1, y: 0, x: 0 }}
                      transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
                      className="space-y-5"
                    >
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        {t(`aiCreator.steps.${currentStep}.eyebrow`)}
                      </p>
                      <h2 className="text-lg md:text-xl font-semibold">
                        {t(`aiCreator.steps.${currentStep}.title`)}
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        {t(`aiCreator.steps.${currentStep}.assistantMessage`)}
                      </p>
                      <p className="text-[11px] text-muted-foreground/90 mt-2 flex items-center gap-1.5">
                        <span className="h-1 w-1 rounded-full bg-neon/80" />
                        {t("cinematic.smartPrompt")}
                      </p>
                      {currentStep === 1 && <IdeaExpansionSuggestions className="mt-4 pt-4 border-t border-border/50" />}
                      {(currentStep === 3 || currentStep === 6) && (
                        <MarketSignalIndicators
                          className="mt-4 pt-4 border-t border-border/50"
                          data={{
                            targeting: draft.step3.targetUsers,
                            industry: draft.step3.industry,
                            region: draft.step3.region,
                            risksFlagged: !!(currentStep === 6 && (draft.step6.marketRisks || draft.step6.technicalRisks || draft.step6.financialRisks || draft.step6.operationalChallenges)),
                            hasOpportunity: currentStep === 6 && !!(draft.step3.industry || draft.step4.revenueModel),
                          }}
                        />
                      )}
                    </motion.div>

                    <div className="relative">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={currentStep}
                          initial={reduceMotion ? false : { opacity: 0, x: 40 }}
                          animate={reduceMotion ? undefined : { opacity: 1, x: 0 }}
                          exit={reduceMotion ? undefined : { opacity: 0, x: -40 }}
                          transition={{ duration: 0.35, ease: "easeOut" }}
                          className="space-y-4"
                        >
                          {currentStep === 1 && (
                            <Step1
                              value={draft.step1}
                              onChange={(value) => updateStep("step1", value as any)}
                            />
                          )}
                          {currentStep === 2 && (
                            <Step2
                              value={draft.step3}
                              onChange={(value) => updateStep("step3", value as any)}
                            />
                          )}
                          {currentStep === 3 && (
                            <Step3
                              value={draft.step4}
                              onChange={(value) => updateStep("step4", value as any)}
                            />
                          )}
                          {currentStep === 4 && (
                            <Step4
                              value={draft.step4}
                              onChange={(value) => updateStep("step4", value as any)}
                            />
                          )}
                          {currentStep === 5 && (
                            <Step5
                              value={draft.step5}
                              onChange={(value) => updateStep("step5", value as any)}
                            />
                          )}
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  </div>

                  <StepConclusionHint draft={draft} currentStep={currentStep} className="mt-8 pt-6 border-t border-border/40" />

                  <div className="relative mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-surface/30 rounded-2xl p-4 border border-border/50">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin text-neon drop-shadow-[0_0_8px_hsl(var(--neon)/0.5)]" />
                      <span className="font-medium tracking-wide">{t("aiCreator.liveSavingHint")}</span>
                    </div>
                    <div className="flex flex-wrap justify-end gap-3">
                      <Button variant="outline" size="sm" className="glass-hover h-10 px-5 rounded-xl border-border/60 hover:bg-surface/60 font-medium" onClick={handleBack}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        {currentStep === 1 ? t("aiCreator.backToLibrary") : t("aiCreator.previous")}
                      </Button>

                      {currentStep < 5 && (
                        <Button size="sm" className="neon-outline h-10 px-6 rounded-xl font-medium shadow-[0_4px_15px_-3px_hsl(var(--neon)/0.3)] bg-surface hover:bg-primary/10 transition-colors duration-300" onClick={handleNext}>
                          {t("aiCreator.next")}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      )}

                      {currentStep === 5 && (
                        <Button size="sm" className="neon-outline h-10 px-6 rounded-xl font-medium shadow-[0_4px_15px_-3px_hsl(var(--neon)/0.3)] bg-primary/20 hover:bg-primary/40 text-primary-foreground border-primary transition-colors duration-300" onClick={handleNext}>
                          <Sparkles className="mr-2 h-4 w-4" />
                          Generate Cinematic Results
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </main>
        </motion.div >
      )
      }
    </div >
  );
}

type StepProps<T> = {
  value: T;
  onChange: (value: T) => void;
};

// 1. Describe Idea
function Step1({ value, onChange }: StepProps<{ name: string; shortDescription: string; category: "" | import("@/lib/ai-guided-project").ProjectCategory }>) {
  return (
    <div className="flex flex-col h-full justify-center gap-6">
      <FieldGroup>
        <Label htmlFor="project-name" className="text-xl font-light text-shimmer">What is the name of your idea?</Label>
        <Input
          id="project-name"
          autoComplete="off"
          className="glass-hover bg-surface/60 h-16 text-xl px-6 rounded-2xl"
          placeholder="e.g. Machrou3i AI"
          value={value.name}
          onChange={(e) => onChange({ ...value, name: e.target.value })}
        />
      </FieldGroup>

      <FieldGroup>
        <Label htmlFor="project-description" className="text-xl font-light text-shimmer">Describe your concept</Label>
        <Textarea
          id="project-description"
          className="glass-hover bg-surface/60 resize-none flex-1 min-h-[120px] max-h-full text-lg px-6 py-4 rounded-2xl"
          placeholder="A platform that uses AI to automate..."
          value={value.shortDescription}
          onChange={(e) => onChange({ ...value, shortDescription: e.target.value })}
        />
      </FieldGroup>
    </div>
  );
}

// 2. Target Users
function Step2({ value, onChange }: StepProps<{ targetUsers: string; industry: string; region: string }>) {
  return (
    <div className="flex flex-col h-full justify-center gap-6">
      <FieldGroup className="flex flex-col">
        <Label htmlFor="target-users" className="text-xl font-light text-shimmer">Who are the target users?</Label>
        <Textarea
          id="target-users"
          className="glass-hover bg-surface/60 resize-none min-h-[100px] text-lg px-6 py-4 rounded-2xl"
          placeholder="Freelancers, students, SME businesses..."
          value={value.targetUsers}
          onChange={(e) => onChange({ ...value, targetUsers: e.target.value })}
        />
      </FieldGroup>
      <FieldGroup>
        <Label htmlFor="industry" className="text-xl font-light text-shimmer">Target Industry</Label>
        <Input
          id="industry"
          className="glass-hover bg-surface/60 h-16 text-lg px-6 rounded-2xl"
          placeholder="e.g. Fintech, Healthcare, SaaS"
          value={value.industry}
          onChange={(e) => onChange({ ...value, industry: e.target.value })}
        />
      </FieldGroup>
    </div>
  );
}

// 3. Budget Estimation
function Step3({ value, onChange }: StepProps<{ budget: string }>) {
  return (
    <div className="flex flex-col h-full justify-center gap-6">
      <FieldGroup className="flex flex-col">
        <Label htmlFor="budget" className="text-xl font-light text-shimmer">What is your estimated budget?</Label>
        <Textarea
          id="budget"
          className="glass-hover bg-surface/60 resize-none min-h-[140px] max-h-full text-lg px-6 py-4 rounded-2xl"
          placeholder="e.g. Under $10k, bootstrap self-funded..."
          value={value.budget || ""}
          onChange={(e) => onChange({ ...value, budget: e.target.value })}
        />
      </FieldGroup>
    </div>
  );
}

// 4. Team Size
function Step4({ value, onChange }: StepProps<{ teamSize: string }>) {
  return (
    <div className="flex flex-col h-full justify-center gap-6">
      <FieldGroup className="flex flex-col">
        <Label htmlFor="team-size" className="text-xl font-light text-shimmer">What is your projected team size?</Label>
        <Textarea
          id="team-size"
          className="glass-hover bg-surface/60 resize-none min-h-[140px] max-h-full text-lg px-6 py-4 rounded-2xl"
          placeholder="Solo founder, 2-5 engineers, large enterprise..."
          value={value.teamSize || ""}
          onChange={(e) => onChange({ ...value, teamSize: e.target.value })}
        />
      </FieldGroup>
    </div>
  );
}

// 5. Goals
function Step5({ value, onChange }: StepProps<{ goals: string }>) {
  return (
    <div className="flex flex-col h-full justify-center gap-6">
      <FieldGroup className="flex flex-col">
        <Label htmlFor="goals" className="text-xl font-light text-shimmer">What are your primary goals?</Label>
        <Textarea
          id="goals"
          className="glass-hover bg-surface/60 resize-none min-h-[140px] max-h-full text-lg px-6 py-4 rounded-2xl"
          placeholder="Grow to 10k users in 6 months, reach $5k MRR..."
          value={value.goals || ""}
          onChange={(e) => onChange({ ...value, goals: e.target.value })}
        />
      </FieldGroup>
      <div className="rounded-2xl glass p-5 border-neon/30 border">
        <p className="text-sm text-muted-foreground flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-neon animate-pulse" />
          Clicking Generate will launch the AI mapping sequence and build your Cinematic Results dashboard.
        </p>
      </div>
    </div>
  );
}

type FieldGroupProps = {
  children: React.ReactNode;
  className?: string;
};

function FieldGroup({ children, className }: FieldGroupProps) {
  return <div className={`space-y-2 ${className || ""}`}>{children}</div>;
}

