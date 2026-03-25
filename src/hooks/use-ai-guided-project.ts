import { useCallback, useEffect, useState } from "react";
import {
  AiProjectDraftState,
  EMPTY_DRAFT,
  loadDraftFromStorage,
  saveDraftToStorage,
  clearDraftFromStorage,
  generateRoadmapFromDraft,
  findProjectById,
} from "@/lib/ai-guided-project";

export function useAiGuidedProject(initialProjectId?: string | null) {
  const [draft, setDraft] = useState<AiProjectDraftState>(() => {
    const fromStorage = loadDraftFromStorage();
    if (fromStorage) {
      return fromStorage;
    }
    if (initialProjectId) {
      const project = findProjectById(initialProjectId);
      if (project) {
        return {
          ...EMPTY_DRAFT,
          currentStep: 1,
          projectId: project.id,
          step1: project.step1,
          step2: project.step2,
          step3: project.step3,
          step4: project.step4,
          step5: project.step5,
          step6: project.step6,
          roadmap: project.roadmap,
        };
      }
    }
    return EMPTY_DRAFT;
  });

  useEffect(() => {
    saveDraftToStorage(draft);
  }, [draft]);

  const updateDraft = useCallback(<K extends keyof AiProjectDraftState>(key: K, value: AiProjectDraftState[K]) => {
    setDraft((prev) => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  const updateStep = useCallback(
    <K extends keyof Pick<
      AiProjectDraftState,
      "step1" | "step2" | "step3" | "step4" | "step5" | "step6"
    >>(key: K, value: AiProjectDraftState[K]) => {
      setDraft((prev) => ({
        ...prev,
        [key]: value,
      }));
    },
    [],
  );

  const goToStep = useCallback((step: number) => {
    setDraft((prev) => ({
      ...prev,
      currentStep: Math.min(8, Math.max(1, step)),
    }));
  }, []);

  const generateRoadmap = useCallback(() => {
    setDraft((prev) => ({
      ...prev,
      roadmap: generateRoadmapFromDraft(prev),
      currentStep: 7,
    }));
  }, []);

  const clearDraft = useCallback(() => {
    clearDraftFromStorage();
    setDraft(EMPTY_DRAFT);
  }, []);

  return {
    draft,
    updateDraft,
    updateStep,
    goToStep,
    generateRoadmap,
    clearDraft,
  };
}

