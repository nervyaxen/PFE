import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { DollarSign, TrendingUp, TrendingDown, RefreshCcw, HandCoins } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const generateData = (multiplier: number) => [
    { month: 'M1', revenue: 10 * multiplier, cost: 40 },
    { month: 'M2', revenue: 25 * multiplier, cost: 35 },
    { month: 'M3', revenue: 45 * multiplier, cost: 30 },
    { month: 'M4', revenue: 70 * multiplier, cost: 25 },
    { month: 'M5', revenue: 95 * multiplier, cost: 20 },
    { month: 'M6', revenue: 130 * multiplier, cost: 20 },
];

export default function FinancialIntelligence() {
    const navigate = useNavigate();
    const [scenario, setScenario] = useState<number>(50); // 0 = Worst, 50 = Base, 100 = Best

    const getMultiplier = () => {
        if (scenario < 33) return 0.6; // Worst case
        if (scenario > 66) return 1.5; // Best case
        return 1; // Base case
    };

    const currentData = generateData(getMultiplier());
    const scenarioLabel = scenario < 33 ? "Stress Test (Pessimistic)" : scenario > 66 ? "Max Adoption (Optimistic)" : "Baseline Forecast";
    const scenarioColor = scenario < 33 ? "text-destructive" : scenario > 66 ? "text-neon" : "text-gold";

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 relative z-10">

            {/* Background layer effect */}
            <div className="absolute top-1/2 left-1/3 w-[700px] h-[700px] bg-primary/10 rounded-full blur-[180px] pointer-events-none mix-blend-screen" />

            <div className="max-w-7xl mx-auto space-y-8 relative">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex flex-col md:flex-row md:items-end justify-between gap-4"
                >
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight text-foreground" data-narrate="Financial Core|Simulate economic outcomes using dynamic sliders">
                            Financial Intelligence
                        </h1>
                        <p className="text-muted-foreground mt-1 text-lg">
                            Dynamic scenario modeling, cost forecasting, and ROI mapping.
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

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Main Chart Area */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="lg:col-span-2 glass cinematic-panel rounded-2xl p-6 depth-shadow"
                    >
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-lg font-semibold flex items-center gap-2">
                                <DollarSign className="w-5 h-5 text-gold" /> ROI Projection Engine
                            </h2>
                            <div className={`px-3 py-1 rounded-full bg-surface text-xs font-bold uppercase tracking-wider ${scenarioColor}`}>
                                {scenarioLabel}
                            </div>
                        </div>

                        <div className="h-[350px] w-full" data-narrate="Forecast Graph|Visualizes crossing the break-even zero-plane">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={currentData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="hsl(var(--neon))" stopOpacity={0.4} />
                                            <stop offset="95%" stopColor="hsl(var(--neon))" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="hsl(var(--destructive))" stopOpacity={0.2} />
                                            <stop offset="95%" stopColor="hsl(var(--destructive))" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border)/0.5)" vertical={false} />
                                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}k`} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: 'hsl(var(--surface))', borderColor: 'hsl(var(--border))', borderRadius: '12px' }}
                                        itemStyle={{ color: 'hsl(var(--foreground))' }}
                                        formatter={(value) => [`$${value}k`]}
                                    />
                                    <Area type="monotone" dataKey="revenue" stackId="1" stroke="hsl(var(--neon))" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" name="Gross Revenue" />
                                    <Area type="monotone" dataKey="cost" stackId="2" stroke="hsl(var(--destructive))" strokeWidth={2} fillOpacity={1} fill="url(#colorCost)" name="Est. Cost" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                    {/* Scenario Controls & Metrics */}
                    <div className="space-y-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="glass p-6 rounded-2xl h-full shadow-lg"
                        >
                            <h3 className="font-semibold mb-6 text-foreground flex items-center gap-2">
                                <RefreshCcw className="w-5 h-5 text-primary" /> Scenario Modifier
                            </h3>

                            <div className="space-y-8" data-narrate="Quantum Slider|Slide to simulate alternate timeline economics">
                                <div>
                                    <div className="flex justify-between text-xs text-muted-foreground mb-4 uppercase tracking-widest font-bold">
                                        <span>Worst Case</span>
                                        <span>Best Case</span>
                                    </div>
                                    <Slider
                                        defaultValue={[50]}
                                        max={100}
                                        step={1}
                                        className="cursor-ew-resize"
                                        value={[scenario]}
                                        onValueChange={(v) => setScenario(v[0])}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                                    <div className="space-y-1">
                                        <p className="text-xs text-muted-foreground">Break-Even Point</p>
                                        <p className="text-lg font-bold text-foreground">
                                            {scenario < 33 ? 'Month 7' : scenario > 66 ? 'Month 3' : 'Month 5'}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs text-muted-foreground">Est. Burn Rate</p>
                                        <p className="text-lg font-bold text-destructive">
                                            ${scenario < 33 ? '12.5k' : scenario > 66 ? '18.2k' : '15.0k'}/mo
                                        </p>
                                    </div>
                                    <div className="space-y-1 col-span-2 mt-2">
                                        <p className="text-xs text-muted-foreground">Year 1 Projected Gross</p>
                                        <p className="text-3xl font-black text-neon">
                                            ${scenario < 33 ? '420k' : scenario > 66 ? '1.2M' : '850k'}
                                        </p>
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <Button className="w-full glass-hover bg-gold text-gold-foreground hover:bg-gold/90 transition-all font-semibold tracking-wide">
                                        <HandCoins className="w-4 h-4 mr-2" /> Export Financial PDF
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                </div>
            </div>
        </div>
    );
}
