import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';
import { motion } from 'framer-motion';

export default function StartFree() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="absolute inset-0 z-[1] pointer-events-none bg-hero" />

            <motion.div
                className="max-w-2xl w-full text-center z-10 space-y-8"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className="inline-flex h-20 w-20 glass rounded-full items-center justify-center mb-4 neon-outline">
                    <Play className="h-10 w-10 text-neon translate-x-1" />
                </div>

                <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tighter loading-relax">
                    Intelligence is Ready.
                </h1>
                <p className="text-xl text-muted-foreground mx-auto max-w-xl font-light">
                    Your free Machrou3i AI workspace connects directly to our dynamic intelligence backend. Instantly generate your roadmap, risks, and forecasts via the AI co-founder.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
                    <Button
                        onClick={() => navigate('/library/ai-creator')}
                        className="w-full sm:w-auto h-14 px-8 text-lg glass-hover bg-neon text-neon-foreground hover:bg-neon/90 hover:-translate-y-1 transition-all rounded-xl shadow-[0_0_40px_-10px_rgba(52,211,153,0.5)]"
                    >
                        Start Dynamic AI Generation
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => navigate('/auth/login')}
                        className="w-full sm:w-auto h-14 px-8 text-lg glass text-foreground border-border hover:bg-surface transition-all rounded-xl"
                    >
                        Log In to Network
                    </Button>
                </div>
                <div className="mt-12 opacity-50 text-xs text-muted-foreground uppercase tracking-widest text-center">
                    Zero friction • No credit card • Instantly architect ideas
                </div>
            </motion.div>
        </div>
    );
}
