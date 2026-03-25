import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Sparkles, BookOpenCheck, ArrowRight, History, Activity, Target, AlertTriangle } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/i18n";
import type { AiGuidedProject } from "@/lib/ai-guided-project";
import { loadProjectsFromStorage } from "@/lib/ai-guided-project";

export default function Library() {
  const { t } = useI18n();
  const reduceMotion = useReducedMotion();
  const [projects, setProjects] = useState<AiGuidedProject[]>([]);

  useEffect(() => {
    setProjects(loadProjectsFromStorage());
  }, []);

  return (
    <div className="relative min-h-screen bg-hero pt-24 px-6">
      <Helmet>
        <title>Machrou3i – {t("library.title")}</title>
        <meta name="description" content={t("library.subtitle")} />
        <link rel="canonical" href="/library" />
      </Helmet>

      <div className="mx-auto max-w-6xl space-y-10 pb-16">
        <motion.div
          className="glass rounded-3xl px-6 py-6 md:px-8 md:py-7 flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
              <BookOpenCheck className="h-5 w-5 text-primary-foreground" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {t("journey.monitor")} · {t("library.eyebrow")}
              </p>
              <h1 className="mt-1 text-xl md:text-2xl font-semibold text-shimmer">
                {t("library.title")}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground max-w-xl">{t("library.subtitle")}</p>
              <p className="mt-2 text-xs text-muted-foreground/90">{t("journey.monitorDesc")}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button asChild size="lg" className="neon-outline">
              <Link to="/library/ai-creator" data-narrate={`${t("library.startAiCreatorCta")}|${t("library.startAiCreatorDesc")}`}>
                <Sparkles className="mr-2 h-4 w-4" />
                {t("buttons.createProject")}
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="glass-hover">
              <Link to="/library/ai-creator?resume=1" data-narrate={`${t("library.resumeCta")}|${t("library.resumeCtaDesc")}`}>
                <History className="mr-2 h-4 w-4" />
                {t("library.resumeCta")}
              </Link>
            </Button>
          </div>
        </motion.div>

        <motion.section
          className="grid gap-8 md:grid-cols-[1.1fr_0.9fr]"
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5, ease: "easeOut" }}
        >
          <div className="glass rounded-[2rem] p-6 md:p-7 space-y-6" data-narrate={t("library.storyBlockNarration")}>
            <div className="inline-flex items-center gap-2 rounded-full bg-surface/70 px-3 py-1.5">
              <Sparkles className="h-3.5 w-3.5 text-neon" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                {t("library.storyBlockEyebrow")}
              </span>
            </div>
            <div className="space-y-2">
              <h2 className="text-xl md:text-2xl font-semibold tracking-tight">{t("library.storyBlockTitle")}</h2>
              <p className="text-sm md:text-[15px] leading-relaxed text-muted-foreground">
                {t("library.storyBlockBody")}
              </p>
            </div>
            <ul className="mt-2 space-y-2.5 text-sm text-muted-foreground">
              <li className="flex items-start gap-3">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-neon animate-glow" />
                <span>{t("library.storyBullet1")}</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-gold" />
                <span>{t("library.storyBullet2")}</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                <span>{t("library.storyBullet3")}</span>
              </li>
            </ul>
            <div className="pt-2">
              <Button asChild variant="ghost" size="sm" className="px-0 text-xs text-muted-foreground hover:text-foreground">
                <Link to="/library/ai-creator">
                  <span className="inline-flex items-center gap-1.5">
                    {t("library.storyInlineCta")}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </Link>
              </Button>
            </div>
          </div>

          <motion.div
            className="glass rounded-[2rem] p-6 md:p-7 relative overflow-hidden"
            data-narrate={t("library.previewNarration")}
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <div
              className="pointer-events-none absolute inset-0 opacity-70"
              style={{
                background:
                  "radial-gradient(720px 420px at 15% 10%, hsl(var(--neon) / 0.18), transparent 60%), radial-gradient(720px 420px at 90% 90%, hsl(var(--gold) / 0.14), transparent 60%)",
              }}
            />
            <div className="relative space-y-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-neon animate-pulse" />
                  {t("library.previewEyebrow")}
                </p>
                {projects.length > 0 && (
                  <span className="rounded-full bg-surface/70 px-2.5 py-1 text-[11px] text-muted-foreground">
                    {projects.length} projet(s) guidé(s)
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{t("library.previewBody")}</p>

              <div className="mt-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(projects.length ? projects.slice(0, 4) : [null, null, null, null]).map((project, idx) => (
                  <Link
                    key={project?.id ?? idx}
                    to={project ? `/projects/${project.id}` : "/library/ai-creator"}
                    className="group rounded-2xl border border-border/70 bg-surface/50 p-3 transition-transform duration-300 hover:-translate-y-1 hover:border-neon/60"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-xs font-semibold text-foreground">
                        {project?.step1.name || t("library.previewCardTitle")}
                      </p>
                      <span className="inline-flex items-center gap-1 rounded-full bg-surface/80 px-2 py-0.5 text-[10px] text-muted-foreground">
                        <Activity className="h-3 w-3" />
                        {project ? "AI" : "Demo"}
                      </span>
                    </div>
                    <p className="mt-1 line-clamp-2 text-[11px] text-muted-foreground">
                      {project?.step1.shortDescription || t("library.previewCardBody")}
                    </p>
                    <div className="mt-2 flex items-center justify-between gap-2 text-[10px] text-muted-foreground">
                      <span className="inline-flex items-center gap-1.5">
                        <Target className="h-3 w-3 text-neon" />
                        {project?.step3.targetUsers || "—"}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <AlertTriangle className="h-3 w-3 text-gold" />
                        {project?.step6.marketRisks ? "Risques identifiés" : "Risques à définir"}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.section>

        {projects.length > 0 && (
          <motion.section
            className="mt-2 space-y-4"
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Aperçu des tableaux de bord générés
              </h2>
              <Button asChild variant="ghost" size="sm" className="h-7 px-2 text-[11px]">
                <Link to="/library/ai-creator">
                  <span className="inline-flex items-center gap-1.5">
                    <Sparkles className="h-3 w-3" />
                    Continuer une histoire
                  </span>
                </Link>
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {projects.slice(0, 3).map((project) => (
                <Link
                  key={project.id}
                  to={`/projects/${project.id}`}
                  className="glass rounded-2xl p-4 transition-transform duration-300 hover:-translate-y-1"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground mb-1">
                    {project.step1.category || "Projet"}
                  </p>
                  <p className="truncate text-sm font-semibold text-foreground">
                    {project.step1.name || "Projet sans nom"}
                  </p>
                  <p className="mt-1 line-clamp-2 text-[11px] text-muted-foreground">
                    {project.step1.shortDescription}
                  </p>
                  <div className="mt-3 flex items-center justify-between gap-2 text-[10px] text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      <Target className="h-3 w-3 text-neon" />
                      {project.step3.industry || "Industrie"}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Activity className="h-3 w-3 text-gold" />
                      {project.roadmap.milestones.length} étapes
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </motion.section>
        )}
      </div>
    </div>
  );
}

