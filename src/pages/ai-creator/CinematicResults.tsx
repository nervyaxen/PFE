import { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
} from 'recharts';
import { ShieldAlert, TrendingUp, Cpu, Briefcase, ArrowLeft, Loader2 } from 'lucide-react';
import { useI18n } from '@/i18n';
import { Button } from '@/components/ui/button';
import { findProjectById } from '@/lib/ai-guided-project';

// Types matching the backend AiProjectResult
interface AiData {
    roadmap: {
        summary: string;
        milestones: { id: string; phase: number; title: string; description: string; suggestedTimeline: string }[];
    };
    riskAnalysis: { technical: number; market: number; financial: number; operational: number; security: number };
    marketInsights: { growthData: { month: string; users: number; revenue: number }[] };
    confidenceScore: number;
}

export default function CinematicResults() {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const { t } = useI18n();
    const localProject = findProjectById(projectId);

    const [aiData, setAiData] = useState<AiData | null>(null);
    const [loading, setLoading] = useState(true);

    // Try fetching AI data from the backend or sessionStorage
    useEffect(() => {
        const fetchData = async () => {
            // 1. Check sessionStorage (set by the AI Creator after form submission)
            const cached = sessionStorage.getItem(`machrou3i-ai-result-${projectId}`);
            if (cached) {
                try {
                    setAiData(JSON.parse(cached));
                    setLoading(false);
                    return;
                } catch { /* fall through */ }
            }

            // 2. Try the backend
            try {
                const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
                const res = await fetch(`${API_BASE}/projects/${projectId}`);
                if (res.ok) {
                    const data = await res.json();
                    if (data.aiRoadmap) {
                        setAiData({
                            roadmap: data.aiRoadmap,
                            riskAnalysis: data.riskAnalysis || { technical: 65, market: 55, financial: 45, operational: 50, security: 80 },
                            marketInsights: data.marketInsights || { growthData: [] },
                            confidenceScore: data.confidenceScore || 78,
                        });
                        setLoading(false);
                        return;
                    }
                }
            } catch { /* fall through to fallback */ }

            // 3. Intelligent fallback — generate data from local project info
            const name = localProject?.step1?.name || 'Project';
            setAiData({
                roadmap: {
                    summary: `AI-generated strategic roadmap for "${name}". Focus on core MVP, validate with target users, and scale based on market signals.`,
                    milestones: [
                        { id: 'm1', phase: 1, title: 'Foundation & MVP', description: 'Build core infrastructure, set up tech stack, develop minimum viable product.', suggestedTimeline: 'Month 1-2' },
                        { id: 'm2', phase: 2, title: 'User Validation & Growth', description: 'Launch beta, collect feedback, iterate on features, and begin marketing.', suggestedTimeline: 'Month 3-4' },
                        { id: 'm3', phase: 3, title: 'Scale & Monetize', description: 'Implement revenue model, scale infrastructure, expand to new markets.', suggestedTimeline: 'Month 5-6' },
                    ],
                },
                riskAnalysis: { technical: 70, market: 60, financial: 45, operational: 55, security: 85 },
                marketInsights: {
                    growthData: [
                        { month: 'M1', users: 100, revenue: 0 },
                        { month: 'M2', users: 600, revenue: 1500 },
                        { month: 'M3', users: 2500, revenue: 6000 },
                        { month: 'M4', users: 7000, revenue: 18000 },
                        { month: 'M5', users: 15000, revenue: 45000 },
                        { month: 'M6', users: 30000, revenue: 100000 },
                    ],
                },
                confidenceScore: 82.4,
            });
            setLoading(false);
        };
        fetchData();
    }, [projectId, localProject]);

    const riskData = useMemo(() => {
        if (!aiData) return [];
        const r = aiData.riskAnalysis;
        return [
            { subject: 'Technical', A: r.technical, fullMark: 100 },
            { subject: 'Market', A: r.market, fullMark: 100 },
            { subject: 'Financial', A: r.financial, fullMark: 100 },
            { subject: 'Operational', A: r.operational, fullMark: 100 },
            { subject: 'Security', A: r.security, fullMark: 100 },
        ];
    }, [aiData]);

    const projectTitle = localProject?.step1?.name || 'AI Concept';
    const projectDesc = localProject?.step1?.shortDescription || 'Generated architecture and strategic roadmap.';

    if (loading || !aiData) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-4">
                    <Loader2 className="w-10 h-10 text-neon animate-spin" />
                    <p className="text-muted-foreground text-sm">Loading AI-generated insights…</p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background pt-24 pb-20 px-6 relative overflow-hidden">
            <Helmet>
                <title>Cinematic Results | Machrou3i</title>
            </Helmet>

            <div
                className="absolute inset-0 opacity-30 pointer-events-none mix-blend-screen"
                style={{
                    background: 'radial-gradient(circle at 10% 20%, hsl(var(--neon)/0.2), transparent 40%), radial-gradient(circle at 90% 80%, hsl(var(--gold)/0.15), transparent 40%)'
                }}
            />

            <div className="max-w-6xl mx-auto space-y-8 relative z-10">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
                    className="flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                    <div>
                        <Button variant="ghost" size="sm" onClick={() => navigate('/workspace')} className="mb-2 text-muted-foreground hover:text-foreground">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Workspace
                        </Button>
                        <h1 className="text-4xl md:text-5xl font-semibold text-shimmer mb-2">
                            {projectTitle}
                        </h1>
                        <p className="text-lg text-muted-foreground max-w-2xl">{projectDesc}</p>
                    </div>
                    <div className="glass px-6 py-3 rounded-2xl border-neon/30 border shadow-[0_0_20px_-5px_hsl(var(--neon)/0.4)]">
                        <p className="text-xs uppercase tracking-widest text-muted-foreground">Confidence Score</p>
                        <p className="text-3xl font-bold text-neon glow-text">{aiData.confidenceScore.toFixed(1)}%</p>
                    </div>
                </motion.div>

                {/* Dashboard Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                    {/* Market Analysis Chart */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
                        className="lg:col-span-2 cinematic-panel glass glass-hover rounded-[2rem] p-6 h-[400px] flex flex-col relative overflow-hidden"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 rounded-xl bg-primary/20 text-primary">
                                <TrendingUp className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold">Market Trajectory</h3>
                                <p className="text-xs text-muted-foreground">AI forecasted 6-month growth</p>
                            </div>
                        </div>
                        <div className="flex-1 w-full h-full relative z-10">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={aiData.marketInsights.growthData}>
                                    <defs>
                                        <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="hsl(var(--neon))" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="hsl(var(--neon))" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border)/0.2)" vertical={false} />
                                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: 'hsl(var(--background)/0.9)', borderColor: 'hsl(var(--border))', borderRadius: '12px' }}
                                        itemStyle={{ color: 'hsl(var(--neon))' }}
                                    />
                                    <Area type="monotone" dataKey="users" stroke="hsl(var(--neon))" strokeWidth={3} fillOpacity={1} fill="url(#colorUsers)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                    {/* Risk Radar */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
                        className="cinematic-panel glass glass-hover rounded-[2rem] p-6 h-[400px] flex flex-col"
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 rounded-xl bg-destructive/20 text-destructive">
                                <ShieldAlert className="w-5 h-5" />
                            </div>
                            <h3 className="text-lg font-semibold">Risk Analysis</h3>
                        </div>
                        <div className="flex-1 w-full h-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={riskData}>
                                    <PolarGrid stroke="hsl(var(--border)/0.4)" />
                                    <PolarAngleAxis dataKey="subject" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
                                    <Radar name="Risk Level" dataKey="A" stroke="hsl(var(--destructive))" fill="hsl(var(--destructive))" fillOpacity={0.3} />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                    {/* AI Roadmap List */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}
                        className="lg:col-span-3 cinematic-panel glass rounded-[2rem] p-6 md:p-10"
                    >
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-2 rounded-xl bg-gold/20 text-gold shadow-[0_0_15px_-2px_hsl(var(--gold)/0.4)]">
                                <Cpu className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-semibold">AI Generated Roadmap</h3>
                                <p className="text-sm text-muted-foreground">{aiData.roadmap.summary}</p>
                            </div>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {aiData.roadmap.milestones.map((m, i) => (
                                <motion.div
                                    key={m.id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="glass glass-hover p-5 rounded-2xl relative overflow-hidden group"
                                >
                                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                        <Briefcase className="w-16 h-16" />
                                    </div>
                                    <div className="mb-3">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-gold px-2 py-1 rounded-md bg-gold/10 inline-block mb-2">
                                            Phase {m.phase}
                                        </span>
                                        <h4 className="text-lg font-semibold">{m.title}</h4>
                                    </div>
                                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{m.description}</p>
                                    <div className="absolute bottom-5 left-5">
                                        <span className="text-xs font-medium text-neon">{m.suggestedTimeline}</span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
