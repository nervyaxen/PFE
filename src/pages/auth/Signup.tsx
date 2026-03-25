import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Cpu, Mail, User, ShieldAlert, Rocket } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Signup() {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuthStore();
    const navigate = useNavigate();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            // In this mock, login automatically creates a user if they don't exist
            await login(email, 'user');
            navigate('/workspace');
        } catch (error) {
            console.error('Signup failed', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            <div className="absolute inset-0 z-[1] pointer-events-none">
                <div className="absolute top-[30%] right-[20%] w-[50ch] h-[50ch] bg-gold/10 rounded-full blur-[100px] mix-blend-screen animate-pulse" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="max-w-md w-full space-y-8 z-10 glass cinematic-panel p-10 rounded-2xl border-t border-l border-white/10"
            >
                <div className="text-center">
                    <div className="inline-flex h-16 w-16 glass rounded-2xl items-center justify-center gold-outline mb-4">
                        <Cpu className="h-8 w-8 text-gold" />
                    </div>
                    <h2 className="text-3xl font-extrabold text-foreground tracking-tight" data-narrate="Onboarding|Instantiate a new cryptographic entity">
                        Initialize Workspace
                    </h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Already registered?{' '}
                        <Link to="/auth/login" className="font-medium text-gold hover:text-gold/80 transition-colors cursor-pointer" data-narrate="Redirect|Proceed to existing login handshake">
                            Engage login sequence
                        </Link>
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSignup}>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="name-input" className="flex items-center gap-2">
                                <User className="w-4 h-4 text-muted-foreground" /> Entity Name
                            </Label>
                            <Input
                                id="name-input"
                                name="name"
                                type="text"
                                required
                                className="glass mt-1"
                                placeholder="Atlas Protocol"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                autoFocus
                            />
                        </div>
                        <div>
                            <Label htmlFor="email-address" className="flex items-center gap-2">
                                <Mail className="w-4 h-4 text-muted-foreground" /> Communication Vector
                            </Label>
                            <Input
                                id="email-address"
                                name="email"
                                type="email"
                                required
                                className="glass mt-1"
                                placeholder="commander@machrou3i.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="bg-destructive/10 border border-destructive/20 p-3 rounded-lg flex items-start gap-3 mt-4">
                            <ShieldAlert className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                <span className="text-foreground font-semibold">Security Notice:</span> Machrou3i uses zero-knowledge architecture. Do not connect if your external environment is compromised.
                            </p>
                        </div>
                    </div>

                    <div>
                        <Button
                            type="submit"
                            className="w-full flex justify-center py-6 glass glass-hover bg-gold/10 hover:bg-gold/20 text-gold border-gold/50 transition-all font-semibold tracking-widest uppercase text-xs"
                            disabled={loading}
                            data-narrate="Launch|Deploy baseline architecture and generate tokens"
                        >
                            {loading ? "Synthesizing Space..." : (
                                <span className="flex items-center gap-2">
                                    <Rocket className="h-4 w-4" /> Synthesize
                                </span>
                            )}
                        </Button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}
