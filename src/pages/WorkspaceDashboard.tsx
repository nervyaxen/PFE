import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
    Activity, Plus, FileText, Zap, ChevronRight, BarChart4,
    Users, Shield, Loader2, AlertCircle, TrendingUp, Cpu
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    RadarChart, PolarGrid, PolarAngleAxis, Radar
} from 'recharts';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface ProjectSummary {
    _id: string;
    title: string;
    description?: string;
    status: string;
    category?: string;
    createdAt: string;
}

export default function WorkspaceDashboard() {
    const navigate = useNavigate();
    const [projects, setProjects] = useState<ProjectSummary[]>([]);
    const [loadingProjects, setLoadingProjects] = useState(true);
    const [aiInsight, setAiInsight] = useState<string>('Analyzing workspace metrics…');
    const [insightLoading, setInsightLoading] = useState(false);

    // Fetch projects from backend
    useEffect(() => {
        const loadProjects = async () => {
            try {
                const res = await fetch(`${API}/projects`);
                if (res.ok) {
                    const data = await res.json();
                    setProjects(data);
                }
            } catch { /* will show fallback projects */ }
            setLoadingProjects(false);
        };
        loadProjects();
    }, []);

    // Fallback project data when backend isn't running
    const displayProjects = projects.length > 0 ? projects : [
        { _id: 'prj_1', title: 'Project Atlas', description: 'Market intelligence platform', status: 'active', createdAt: new Date().toISOString() },
        { _id: 'prj_2', title: 'Alpha Pipeline', description: 'ML-powered data pipeline', status: 'active', createdAt: new Date().toISOString() },
        { _id: 'prj_3', title: 'Nebula Finance', description: 'Fintech analytics dashboard', status: 'active', createdAt: new Date().toISOString() },
    ];

    // Team velocity mock data
    const velocityData = [
        { week: 'W1', velocity: 22, capacity: 30 },
        { week: 'W2', velocity: 28, capacity: 30 },
        { week: 'W3', velocity: 35, capacity: 35 },
        { week: 'W4', velocity: 31, capacity: 35 },
        { week: 'W5', velocity: 40, capacity: 40 },
        { week: 'W6', velocity: 38, capacity: 40 },
    ];

    // Resource allocation radar
    const resourceData = [
        { resource: 'Frontend', allocated: 85, fullMark: 100 },
        { resource: 'Backend', allocated: 70, fullMark: 100 },
        { resource: 'AI/ML', allocated: 90, fullMark: 100 },
        { resource: 'DevOps', allocated: 60, fullMark: 100 },
        { resource: 'Design', allocated: 75, fullMark: 100 },
    ];

    // Risk probability
    const riskProb = [
        { category: 'Schedule', probability: 45 },
        { category: 'Budget', probability: 30 },
        { category: 'Technical', probability: 65 },
        { category: 'Market', probability: 40 },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.08 } }
    };
    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
    };

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-neon/5 rounded-full blur-[150px] pointer-events-none mix-blend-screen" />

            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header */}
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight" data-narrate="Command Center|Central intelligence">Command Center</h1>
                        <p className="text-muted-foreground mt-1 text-lg">
                            {displayProjects.length} active projects. System functioning normally.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="outline" className="glass border-border hover:bg-surface" onClick={() => navigate('/analytics')}>
                            <BarChart4 className="w-4 h-4 mr-2" /> Global Stats
                        </Button>
                        <Button className="bg-neon text-neon-foreground hover:bg-neon/90 shadow-[0_0_20px_-5px_rgba(52,211,153,0.4)]" onClick={() => navigate('/library/ai-creator')}>
                            <Plus className="w-4 h-4 mr-2" /> New Project
                        </Button>
                    </div>
                </motion.div>

                <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* ─── Left 2/3: Projects + Charts ─── */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* AI Suggestion Banner */}
                        <motion.div variants={itemVariants} className="glass cinematic-panel p-6 rounded-2xl border-l-[3px] border-l-neon flex items-start sm:items-center justify-between gap-4">
                            <div className="flex gap-4">
                                <div className="h-10 w-10 shrink-0 bg-neon/20 rounded-full flex items-center justify-center">
                                    <Zap className="h-5 w-5 text-neon" />
                                </div>
                                <div>
                                    <h3 className="text-foreground font-semibold">AI Next-Step Suggestion</h3>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        {insightLoading ? 'Querying AI backend…' : aiInsight}
                                    </p>
                                </div>
                            </div>
                            <Button variant="ghost" className="text-neon hover:text-neon hover:bg-neon/10 shrink-0 hidden sm:flex" onClick={() => navigate('/analytics')}>
                                View Protocol <ChevronRight className="w-4 h-4 ml-1" />
                            </Button>
                        </motion.div>

                        {/* Active Projects */}
                        <motion.div variants={itemVariants} className="glass p-6 rounded-2xl space-y-4 shadow-xl">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold flex items-center gap-2">
                                    <Activity className="w-5 h-5 text-gold" /> Active Architectures
                                </h2>
                                <span className="text-xs text-muted-foreground">{displayProjects.length} projects</span>
                            </div>
                            {loadingProjects ? (
                                <div className="flex items-center justify-center py-8 gap-3 text-muted-foreground">
                                    <Loader2 className="w-5 h-5 animate-spin" /> Loading projects…
                                </div>
                            ) : (
                                displayProjects.map((p, i) => (
                                    <div
                                        key={p._id}
                                        onClick={() => navigate(`/projects/${p._id}`)}
                                        className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-border/50 hover:border-gold/30 hover:bg-surface/50 transition-all cursor-pointer bg-background/30"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="h-12 w-12 rounded-lg bg-surface flex items-center justify-center group-hover:bg-gold/10 transition-colors">
                                                <FileText className="h-6 w-6 text-muted-foreground group-hover:text-gold transition-colors" />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold group-hover:text-gold transition-colors">{p.title}</h4>
                                                <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                                                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-neon animate-pulse" /> {p.status || 'Active'}</span>
                                                    <span>•</span>
                                                    <span>{p.description || 'AI-powered project'}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-4 sm:mt-0 flex items-center gap-6">
                                            <div className="text-right">
                                                <div className="text-sm font-medium">{75 - (i * 12)}%</div>
                                                <div className="text-xs text-muted-foreground">Success Probability</div>
                                            </div>
                                            <div className="w-24 h-2 bg-surface rounded-full overflow-hidden">
                                                <div className="h-full bg-gold rounded-full transition-all" style={{ width: `${75 - (i * 12)}%` }} />
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </motion.div>

                        {/* Team Velocity Chart */}
                        <motion.div variants={itemVariants} className="glass cinematic-panel rounded-[2rem] p-6 h-[320px] flex flex-col">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 rounded-xl bg-primary/20 text-primary"><TrendingUp className="w-5 h-5" /></div>
                                <div>
                                    <h3 className="text-lg font-semibold">Team Velocity</h3>
                                    <p className="text-xs text-muted-foreground">Sprint velocity vs capacity over 6 weeks</p>
                                </div>
                            </div>
                            <div className="flex-1">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={velocityData}>
                                        <defs>
                                            <linearGradient id="colorVel" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="hsl(var(--neon))" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="hsl(var(--neon))" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border)/0.2)" vertical={false} />
                                        <XAxis dataKey="week" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                                        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                                        <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background)/0.9)', borderColor: 'hsl(var(--border))', borderRadius: '12px' }} />
                                        <Area type="monotone" dataKey="capacity" name="Capacity" stroke="hsl(var(--gold))" strokeWidth={2} strokeDasharray="5 5" fill="none" />
                                        <Area type="monotone" dataKey="velocity" name="Velocity" stroke="hsl(var(--neon))" strokeWidth={2.5} fillOpacity={1} fill="url(#colorVel)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </motion.div>
                    </div>

                    {/* ─── Right sidebar ─── */}
                    <div className="space-y-6">

                        {/* Resource Allocation Radar */}
                        <motion.div variants={itemVariants} className="glass cinematic-panel rounded-[2rem] p-6 h-[300px] flex flex-col">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 rounded-xl bg-gold/20 text-gold"><Cpu className="w-5 h-5" /></div>
                                <h3 className="font-semibold">Resource Allocation</h3>
                            </div>
                            <div className="flex-1">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RadarChart cx="50%" cy="50%" outerRadius="65%" data={resourceData}>
                                        <PolarGrid stroke="hsl(var(--border)/0.4)" />
                                        <PolarAngleAxis dataKey="resource" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} />
                                        <Radar name="Allocated" dataKey="allocated" stroke="hsl(var(--gold))" fill="hsl(var(--gold))" fillOpacity={0.25} />
                                    </RadarChart>
                                </ResponsiveContainer>
                            </div>
                        </motion.div>

                        {/* Risk Probability */}
                        <motion.div variants={itemVariants} className="glass p-6 rounded-2xl">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 rounded-xl bg-destructive/20 text-destructive"><Shield className="w-5 h-5" /></div>
                                <h3 className="font-semibold">Risk Probability</h3>
                            </div>
                            <div className="space-y-3">
                                {riskProb.map((r) => (
                                    <div key={r.category}>
                                        <div className="flex justify-between text-xs mb-1">
                                            <span className="text-muted-foreground">{r.category}</span>
                                            <span className={`font-bold ${r.probability > 50 ? 'text-destructive' : 'text-neon'}`}>{r.probability}%</span>
                                        </div>
                                        <div className="w-full h-2 bg-surface rounded-full overflow-hidden">
                                            <div className={`h-full rounded-full transition-all ${r.probability > 50 ? 'bg-destructive/70' : 'bg-neon/70'}`} style={{ width: `${r.probability}%` }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Activity Timeline */}
                        <motion.div variants={itemVariants} className="glass p-6 rounded-2xl">
                            <h3 className="font-semibold mb-4 border-b border-border pb-2">Recent Activity</h3>
                            <div className="space-y-5">
                                {[
                                    { time: '10 min ago', text: 'AI re-calibrated Project Atlas ROI projections.' },
                                    { time: '1 hour ago', text: 'Milestone completed: Framework Base.' },
                                    { time: '3 hours ago', text: 'System backup completed successfully.' },
                                    { time: '1 day ago', text: 'Financial simulation generated via Gemini.' }
                                ].map((act, i) => (
                                    <div key={i} className="flex gap-4 items-start relative before:absolute before:left-2.5 before:top-6 before:w-[1px] before:h-full before:bg-border last:before:hidden">
                                        <div className="w-5 h-5 rounded-full bg-surface border-2 border-border z-10 shrink-0 mt-0.5" />
                                        <div>
                                            <div className="text-xs text-neon mb-1">{act.time}</div>
                                            <div className="text-sm text-foreground/90 leading-tight">{act.text}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
