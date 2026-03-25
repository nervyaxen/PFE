import React from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, CartesianGrid } from 'recharts';
import { Activity, ShieldAlert, Target, Zap, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const velocityData = [
    { name: 'Mon', velocity: 45, expected: 40 },
    { name: 'Tue', velocity: 52, expected: 42 },
    { name: 'Wed', velocity: 68, expected: 45 },
    { name: 'Thu', velocity: 74, expected: 48 },
    { name: 'Fri', velocity: 85, expected: 50 },
    { name: 'Sat', velocity: 65, expected: 30 },
    { name: 'Sun', velocity: 90, expected: 35 },
];

const riskData = [
    { name: 'Technical', value: 45 },
    { name: 'Market', value: 25 },
    { name: 'Financial', value: 15 },
    { name: 'Operational', value: 15 },
];

export default function AnalyticsDashboard() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 relative z-10">

            {/* Background layer effect for the dashboard */}
            <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-gold/5 rounded-full blur-[150px] pointer-events-none mix-blend-screen" />

            <div className="max-w-7xl mx-auto space-y-8 relative">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex flex-col md:flex-row md:items-end justify-between gap-4"
                >
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight text-foreground" data-narrate="System Telemetry|Aggregated metrics across all workspaces">
                            Analytics Engine
                        </h1>
                        <p className="text-muted-foreground mt-1 text-lg">
                            Real-time velocity, risk probability, and intelligence tracking.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            className="glass border-border hover:bg-surface"
                            onClick={() => navigate('/workspace')}
                        >
                            Return to Base
                        </Button>
                    </div>
                </motion.div>

                {/* Global KPIs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Metric 1 */}
                    <MetricCard
                        title="System Velocity"
                        value="85.4"
                        unit="pts/s"
                        trend="+12%"
                        isPositive={true}
                        icon={<Zap className="w-5 h-5 text-neon" />}
                        color="neon"
                    />
                    {/* Metric 2 */}
                    <MetricCard
                        title="Risk Probability"
                        value="14.2"
                        unit="%"
                        trend="-4.1%"
                        isPositive={true}
                        icon={<ShieldAlert className="w-5 h-5 text-gold" />}
                        color="gold"
                    />
                    {/* Metric 3 */}
                    <MetricCard
                        title="Active Nodes"
                        value="3"
                        unit=""
                        trend="+1"
                        isPositive={true}
                        icon={<Activity className="w-5 h-5 text-primary" />}
                        color="primary"
                    />
                    {/* Metric 4 */}
                    <MetricCard
                        title="Milestone Delta"
                        value="-2"
                        unit="days"
                        trend="-1.5 days"
                        isPositive={false}
                        icon={<Target className="w-5 h-5 text-destructive" />}
                        color="destructive"
                    />
                </div>

                {/* Charts Layer */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Velocity Area Chart */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="lg:col-span-2 glass cinematic-panel rounded-2xl p-6 depth-shadow"
                        data-narrate="Velocity Graph|Historical completion rates mapped against AI expectations"
                    >
                        <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                            <Activity className="w-5 h-5 text-neon" /> Delivery Velocity
                        </h2>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={velocityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorVelocity" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="hsl(var(--neon))" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="hsl(var(--neon))" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorExpected" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border)/0.5)" vertical={false} />
                                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: 'hsl(var(--surface))', borderColor: 'hsl(var(--border))', borderRadius: '12px' }}
                                        itemStyle={{ color: 'hsl(var(--foreground))' }}
                                    />
                                    <Area type="monotone" dataKey="expected" stroke="hsl(var(--muted-foreground))" strokeDasharray="5 5" fillOpacity={1} fill="url(#colorExpected)" />
                                    <Area type="monotone" dataKey="velocity" stroke="hsl(var(--neon))" strokeWidth={2} fillOpacity={1} fill="url(#colorVelocity)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                    {/* Risk Distribution Bar Chart */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="glass cinematic-panel rounded-2xl p-6 depth-shadow"
                        data-narrate="Risk Radar|Identification of potential failure points"
                    >
                        <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                            <ShieldAlert className="w-5 h-5 text-gold" /> Risk Distribution
                        </h2>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={riskData} layout="vertical" margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                                    <XAxis type="number" hide />
                                    <YAxis dataKey="name" type="category" stroke="hsl(var(--foreground))" fontSize={12} tickLine={false} axisLine={false} width={80} />
                                    <Tooltip
                                        cursor={{ fill: 'hsl(var(--surface))' }}
                                        contentStyle={{ backgroundColor: 'hsl(var(--surface))', borderColor: 'hsl(var(--border))', borderRadius: '12px' }}
                                    />
                                    <Bar dataKey="value" fill="hsl(var(--gold))" radius={[0, 4, 4, 0]} barSize={20} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                </div>
            </div>
        </div>
    );
}

function MetricCard({ title, value, unit, trend, isPositive, icon, color }: any) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass floating-panel rounded-2xl p-5 border border-border/40"
        >
            <div className="flex justify-between items-start mb-4">
                <div className="p-2 rounded-lg bg-surface/50">{icon}</div>
                <div className={`flex items-center gap-1 text-xs font-semibold ${isPositive ? 'text-neon' : 'text-destructive'}`}>
                    {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {trend}
                </div>
            </div>
            <div>
                <h3 className="text-muted-foreground text-sm font-medium">{title}</h3>
                <div className="text-2xl font-bold text-foreground mt-1 tracking-tight">
                    {value} <span className="text-sm font-normal text-muted-foreground">{unit}</span>
                </div>
            </div>
        </motion.div>
    );
}
