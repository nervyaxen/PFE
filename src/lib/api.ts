/**
 * Machrou3i API Service Layer
 * 
 * All frontend requests to the backend pass through this module.
 * No API keys are stored or referenced on the client side.
 */

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
    const token = localStorage.getItem('machrou3i-token');

    const res = await fetch(`${API_BASE}${path}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...options?.headers,
        },
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({ error: res.statusText }));
        throw new Error(err.error || 'Request failed');
    }

    return res.json();
}

// ─── Health ────────────────────────────────────────────
export const checkHealth = () => request<{ status: string }>('/health');

// ─── AI Config Status ──────────────────────────────────
export const getAiStatus = () =>
    request<{ geminiConfigured: boolean; openaiConfigured: boolean; anthropicConfigured: boolean }>('/config/ai/status');

// ─── AI Project Generation ─────────────────────────────
export interface GenerateProjectPayload {
    idea: string;
    shortDescription: string;
    category: string;
    problem: string;
    solution: string;
    uniqueness: string;
    targetUsers: string;
    industry: string;
    region: string;
    revenueModel: string;
    pricingModel: string;
    monetizationStrategy: string;
    competitors: string;
    advantages: string;
    technicalRisks: string;
    marketRisks: string;
    financialRisks: string;
    operationalChallenges: string;
    budget: string;
    teamSize: string;
    goals: string;
}

export interface AiProjectResult {
    projectId: string;
    roadmap: {
        summary: string;
        milestones: Array<{
            id: string;
            phase: number;
            title: string;
            description: string;
            suggestedTimeline: string;
        }>;
    };
    riskAnalysis: {
        technical: number;
        market: number;
        financial: number;
        operational: number;
        security: number;
    };
    marketInsights: {
        growthData: Array<{ month: string; users: number; revenue: number }>;
    };
    confidenceScore: number;
}

export const generateProject = (payload: GenerateProjectPayload) =>
    request<AiProjectResult>('/ai/generate-project', {
        method: 'POST',
        body: JSON.stringify(payload),
    });

// ─── Auth ──────────────────────────────────────────────
export const login = (email: string, password: string) =>
    request<{ token: string; refreshToken: string; user: { id: string; email: string; role: string } }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
    });

export const signup = (name: string, email: string, password: string) =>
    request<{ token: string; user: { id: string; email: string; role: string } }>('/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ name, email, password }),
    });

// ─── Projects ──────────────────────────────────────────
export const getProjects = () =>
    request<Array<{ _id: string; title: string; status: string; createdAt: string }>>('/projects');

export const getProject = (id: string) =>
    request<{ _id: string; title: string; description: string; aiRoadmap: object; milestones: object[] }>(`/projects/${id}`);
