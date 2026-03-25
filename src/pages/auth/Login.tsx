import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore, UserRole } from '@/store/useAuthStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Monitor, Unlock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Login() {
    const [email, setEmail] = useState('');
    const [role, setRole] = useState<UserRole>('user');
    const [loading, setLoading] = useState(false);
    const { login } = useAuthStore();
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await login(email, role);
            if (role === 'admin') navigate('/admin');
            else navigate('/workspace');
        } catch (error) {
            console.error('Login failed', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">

            {/* Background glow effects */}
            <div className="absolute inset-0 z-[1] pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60ch] h-[60ch] bg-neon/10 rounded-full blur-[120px] mix-blend-screen" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="max-w-md w-full space-y-8 z-10 glass cinematic-panel p-10 rounded-2xl glow-edge"
                data-narrate="Auth Gate|Secure entry point for Machrou3i AI Ecosystem"
            >
                <div>
                    <div className="flex justify-center">
                        <div className="h-16 w-16 glass rounded-2xl flex items-center justify-center neon-outline">
                            <Monitor className="h-8 w-8 text-neon" />
                        </div>
                    </div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-foreground tracking-tight">
                        Connect to Base
                    </h2>
                    <p className="mt-2 text-center text-sm text-muted-foreground">
                        Or{' '}
                        <Link to="/auth/signup" className="font-medium text-neon hover:text-neon/80 transition-colors">
                            start a free workspace
                        </Link>
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="email-address">Email Engine</Label>
                            <Input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="glass mt-1"
                                placeholder="commander@machrou3i.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                autoFocus
                                data-narrate="Identity Input|System verifies your cryptographic access"
                            />
                        </div>

                        {/* Temporary Role Selector since Auth is mocked for now */}
                        <div>
                            <Label htmlFor="role-select">Access Level (Simulation)</Label>
                            <select
                                id="role-select"
                                className="mt-1 flex h-10 w-full rounded-md border border-input glass px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-foreground"
                                value={role}
                                onChange={(e) => setRole(e.target.value as UserRole)}
                                data-narrate="RBAC Selector|Testing environment allows manual role assignment"
                            >
                                <option value="user" className="bg-background">Standard User</option>
                                <option value="manager" className="bg-background">Project Manager</option>
                                <option value="admin" className="bg-background">System Admin</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <Button
                            type="submit"
                            className="w-full flex justify-center py-6 glass glass-hover bg-neon/10 hover:bg-neon/20 text-neon border-neon/50 transition-all font-semibold tracking-wide"
                            disabled={loading}
                            data-narrate="Engage|Initiate secure handshake protocol"
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <span className="h-4 w-4 rounded-full border-2 border-neon border-t-transparent animate-spin" />
                                    Authenticating...
                                </span>
                            ) : (
                                <span className="flex items-center gap-2">
                                    <Unlock className="h-4 w-4" /> Sign In
                                </span>
                            )}
                        </Button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}
