export type ProjectCategory = "startup" | "product" | "service" | "platform" | "other";

export interface AiProjectStoryStep1 {
  name: string;
  shortDescription: string;
  category: ProjectCategory | "";
}

export interface AiProjectStoryStep2 {
  problem: string;
  solution: string;
  uniqueness: string;
}

export interface AiProjectStoryStep3 {
  targetUsers: string;
  industry: string;
  region: string;
}

export interface AiProjectStoryStep4 {
  revenueModel: string;
  pricingModel: string;
  monetizationStrategy: string;
  budget: string;
  teamSize: string;
}

export interface AiProjectStoryStep5 {
  competitors: string;
  advantages: string;
  goals: string;
}

export interface AiProjectStoryStep6 {
  technicalRisks: string;
  marketRisks: string;
  financialRisks: string;
  operationalChallenges: string;
}

export interface AiProjectRoadmapItem {
  id: string;
  title: string;
  description: string;
  phase: "discovery" | "build" | "launch" | "scale";
  order: number;
  suggestedTimeline: string;
}

export interface AiProjectRoadmap {
  summary: string;
  milestones: AiProjectRoadmapItem[];
}

export interface AiGuidedProject {
  id: string;
  createdAt: string;
  updatedAt: string;
  step1: AiProjectStoryStep1;
  step2: AiProjectStoryStep2;
  step3: AiProjectStoryStep3;
  step4: AiProjectStoryStep4;
  step5: AiProjectStoryStep5;
  step6: AiProjectStoryStep6;
  roadmap: AiProjectRoadmap;
}

export interface AiProjectDraftState {
  currentStep: number;
  step1: AiProjectStoryStep1;
  step2: AiProjectStoryStep2;
  step3: AiProjectStoryStep3;
  step4: AiProjectStoryStep4;
  step5: AiProjectStoryStep5;
  step6: AiProjectStoryStep6;
  roadmap: AiProjectRoadmap | null;
  projectId?: string;
}

export const EMPTY_DRAFT: AiProjectDraftState = {
  currentStep: 1,
  step1: {
    name: "",
    shortDescription: "",
    category: "",
  },
  step2: {
    problem: "",
    solution: "",
    uniqueness: "",
  },
  step3: {
    targetUsers: "",
    industry: "",
    region: "",
  },
  step4: {
    revenueModel: "",
    pricingModel: "",
    monetizationStrategy: "",
    budget: "",
    teamSize: "",
  },
  step5: {
    competitors: "",
    advantages: "",
    goals: "",
  },
  step6: {
    technicalRisks: "",
    marketRisks: "",
    financialRisks: "",
    operationalChallenges: "",
  },
  roadmap: null,
};

const ROADMAP_ID_PREFIX = "ai-roadmap";

function createRoadmapItem(
  order: number,
  title: string,
  description: string,
  phase: AiProjectRoadmapItem["phase"],
  suggestedTimeline: string,
): AiProjectRoadmapItem {
  return {
    id: `${ROADMAP_ID_PREFIX}-${order}`,
    title,
    description,
    phase,
    order,
    suggestedTimeline,
  };
}

export function generateRoadmapFromDraft(draft: AiProjectDraftState): AiProjectRoadmap {
  const { step1, step2, step3, step4, step5, step6 } = draft;

  const name = step1.name || "Your project";
  const market = step3.industry || "your market";
  const region = step3.region || "your region";

  const summary = [
    `${name} is positioned as a ${step1.category || "project"} targeting ${step3.targetUsers || "its core users"} in ${region}.`,
    step2.problem && step2.solution
      ? `It solves "${step2.problem}" by delivering "${step2.solution}", with a unique angle around "${step2.uniqueness || "a differentiated experience"}".`
      : "",
    step4.revenueModel
      ? `The business model focuses on ${step4.revenueModel}${step4.pricingModel ? ` with a pricing model based on ${step4.pricingModel}.` : "."
      }`
      : "",
    step5.competitors
      ? `Competitively, it watches players like ${step5.competitors}, and leans on strengths such as ${step5.advantages || "clear positioning and execution"}.`
      : "",
    step6.technicalRisks || step6.marketRisks || step6.financialRisks || step6.operationalChallenges
      ? "The roadmap balances opportunity with visible risks across technology, market, finances, and operations."
      : "",
  ]
    .filter(Boolean)
    .join(" ");

  const milestones: AiProjectRoadmapItem[] = [];

  milestones.push(
    createRoadmapItem(
      1,
      "Foundations & discovery",
      "Clarify the problem, success metrics, and user personas. Align stakeholders on the core narrative of the project.",
      "discovery",
      "Week 1–2",
    ),
  );

  milestones.push(
    createRoadmapItem(
      2,
      "Market & competition scan",
      `Map the competitive landscape in ${market} and ${region}, identifying whitespace and differentiation levers.`,
      "discovery",
      "Week 2–3",
    ),
  );

  milestones.push(
    createRoadmapItem(
      3,
      "MVP definition",
      "Translate the story into a first-release scope: key features, constraints, and technical architecture.",
      "build",
      "Week 3–5",
    ),
  );

  milestones.push(
    createRoadmapItem(
      4,
      "Build core experience",
      "Implement the core flows that deliver the promised value, with instrumentation for analytics and feedback loops.",
      "build",
      "Week 5–10",
    ),
  );

  milestones.push(
    createRoadmapItem(
      5,
      "Go-to-market rehearsal",
      "Prepare messaging, pricing, onboarding, and support for a focused launch to the first wave of users.",
      "launch",
      "Week 10–12",
    ),
  );

  milestones.push(
    createRoadmapItem(
      6,
      "Launch & learn",
      "Launch to your initial market, monitor performance, and iterate on product, pricing, and positioning based on signals.",
      "launch",
      "Week 12–14",
    ),
  );

  milestones.push(
    createRoadmapItem(
      7,
      "Scale & deepen",
      "Scale what works: automate operations, refine retention loops, and expand into adjacent segments once core metrics are healthy.",
      "scale",
      "Week 14+",
    ),
  );

  return {
    summary,
    milestones,
  };
}

export const AI_DRAFT_STORAGE_KEY = "machrou3i-ai-guided-project-draft";
export const AI_PROJECTS_STORAGE_KEY = "machrou3i-ai-guided-projects";

export function loadDraftFromStorage(): AiProjectDraftState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(AI_DRAFT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AiProjectDraftState;
    if (!parsed || typeof parsed !== "object") return null;
    return {
      ...EMPTY_DRAFT,
      ...parsed,
      step1: { ...EMPTY_DRAFT.step1, ...parsed.step1 },
      step2: { ...EMPTY_DRAFT.step2, ...parsed.step2 },
      step3: { ...EMPTY_DRAFT.step3, ...parsed.step3 },
      step4: { ...EMPTY_DRAFT.step4, ...parsed.step4 },
      step5: { ...EMPTY_DRAFT.step5, ...parsed.step5 },
      step6: { ...EMPTY_DRAFT.step6, ...parsed.step6 },
    };
  } catch {
    return null;
  }
}

export function saveDraftToStorage(draft: AiProjectDraftState) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(AI_DRAFT_STORAGE_KEY, JSON.stringify(draft));
  } catch {
    // ignore
  }
}

export function clearDraftFromStorage() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(AI_DRAFT_STORAGE_KEY);
  } catch {
    // ignore
  }
}

export function loadProjectsFromStorage(): AiGuidedProject[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(AI_PROJECTS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as AiGuidedProject[];
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

export function saveProjectsToStorage(projects: AiGuidedProject[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(AI_PROJECTS_STORAGE_KEY, JSON.stringify(projects));
  } catch {
    // ignore
  }
}

export function upsertProjectFromDraft(draft: AiProjectDraftState): AiGuidedProject {
  const now = new Date().toISOString();
  const existingProjects = loadProjectsFromStorage();
  let project: AiGuidedProject;

  if (draft.projectId) {
    const index = existingProjects.findIndex((p) => p.id === draft.projectId);
    if (index >= 0) {
      project = {
        ...existingProjects[index],
        step1: draft.step1,
        step2: draft.step2,
        step3: draft.step3,
        step4: draft.step4,
        step5: draft.step5,
        step6: draft.step6,
        roadmap: draft.roadmap || generateRoadmapFromDraft(draft),
        updatedAt: now,
      };
      const copy = [...existingProjects];
      copy[index] = project;
      saveProjectsToStorage(copy);
      return project;
    }
  }

  const id = draft.projectId || `proj_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
  project = {
    id,
    createdAt: now,
    updatedAt: now,
    step1: draft.step1,
    step2: draft.step2,
    step3: draft.step3,
    step4: draft.step4,
    step5: draft.step5,
    step6: draft.step6,
    roadmap: draft.roadmap || generateRoadmapFromDraft(draft),
  };

  saveProjectsToStorage([...existingProjects, project]);
  return project;
}

export function findProjectById(id: string | undefined | null): AiGuidedProject | null {
  if (!id) return null;
  const projects = loadProjectsFromStorage();
  return projects.find((p) => p.id === id) ?? null;
}

