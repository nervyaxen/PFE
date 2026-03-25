import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings, Key, Check, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const API_KEYS_STORAGE = "machrou3i-api-keys";

export interface ApiKeys {
    openai: string;
    anthropic: string;
    gemini: string;
}

const defaultKeys: ApiKeys = {
    openai: "",
    anthropic: "",
    gemini: "",
};

export function getLocalApiKeys(): ApiKeys {
    if (typeof window === "undefined") return defaultKeys;
    try {
        const raw = localStorage.getItem(API_KEYS_STORAGE);
        if (!raw) return defaultKeys;
        return { ...defaultKeys, ...JSON.parse(raw) };
    } catch {
        return defaultKeys;
    }
}

export default function ApiConfigModal() {
    const [open, setOpen] = useState(false);
    const [keys, setKeys] = useState<ApiKeys>(defaultKeys);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        if (open) {
            setKeys(getLocalApiKeys());
            setSaved(false);
        }
    }, [open]);

    const handleSave = () => {
        localStorage.setItem(API_KEYS_STORAGE, JSON.stringify(keys));
        setSaved(true);
        setTimeout(() => {
            setOpen(false);
        }, 1500);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="glass h-10 w-10 md:h-12 md:w-12 rounded-xl text-muted-foreground hover:text-foreground border border-border/40 hover:border-neon/30 hover:shadow-[0_0_15px_-5px_hsl(var(--neon)/0.3)] transition-all">
                    <Settings className="h-5 w-5" />
                </Button>
            </DialogTrigger>
            <DialogContent className="glass cinematic-panel border-neon/30 sm:max-w-[425px] overflow-hidden">
                {/* Animated Background Depth */}
                <div className="absolute inset-0 z-0 pointer-events-none opacity-20" style={{ background: "radial-gradient(circle at 50% 0%, hsl(var(--neon)), transparent 60%)" }} />

                <div className="relative z-10">
                    <DialogHeader className="mb-6">
                        <DialogTitle className="flex items-center gap-2 text-xl">
                            <Key className="w-5 h-5 text-neon" />
                            API Configuration
                        </DialogTitle>
                        <DialogDescription className="text-muted-foreground">
                            Configure your local LLM keys to enable live AI data generation. Keys are securely stored only in your browser's localStorage.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-5">
                        <div className="grid gap-2 relative">
                            <Label htmlFor="openai" className="text-shimmer">OpenAI API Key</Label>
                            <Input
                                id="openai"
                                type="password"
                                placeholder="sk-..."
                                className="glass-hover bg-surface/50 font-mono transition-colors focus:border-neon/40 focus:ring-1 focus:ring-neon/20"
                                value={keys.openai}
                                onChange={(e) => setKeys({ ...keys, openai: e.target.value })}
                            />
                        </div>
                        <div className="grid gap-2 relative">
                            <Label htmlFor="anthropic" className="text-shimmer">Anthropic API Key</Label>
                            <Input
                                id="anthropic"
                                type="password"
                                placeholder="sk-ant-..."
                                className="glass-hover bg-surface/50 font-mono transition-colors focus:border-neon/40 focus:ring-1 focus:ring-neon/20"
                                value={keys.anthropic}
                                onChange={(e) => setKeys({ ...keys, anthropic: e.target.value })}
                            />
                        </div>
                        <div className="grid gap-2 relative">
                            <Label htmlFor="gemini" className="text-shimmer">Google Gemini API Key</Label>
                            <Input
                                id="gemini"
                                type="password"
                                placeholder="AIza..."
                                className="glass-hover bg-surface/50 font-mono transition-colors focus:border-neon/40 focus:ring-1 focus:ring-neon/20"
                                value={keys.gemini}
                                onChange={(e) => setKeys({ ...keys, gemini: e.target.value })}
                            />
                        </div>

                        <div className="rounded-lg bg-surface border border-border/50 p-3 mt-2 flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                By entering these keys, the Cinematic Dashboards will perform live fetches from the configured models instead of showing mocked projections.
                            </p>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-border/30">
                        <Button variant="ghost" onClick={() => setOpen(false)} className="hover:bg-surface">
                            Cancel
                        </Button>
                        <Button onClick={handleSave} className="neon-outline bg-surface hover:bg-primary/20 transition-all font-medium relative overflow-hidden group">
                            <AnimatePresence mode="wait">
                                {saved ? (
                                    <motion.div
                                        key="saved"
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        exit={{ y: -20, opacity: 0 }}
                                        className="flex items-center text-primary-foreground"
                                    >
                                        <Check className="w-4 h-4 mr-2" />
                                        Saved Securely
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="save"
                                        initial={{ y: -20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        exit={{ y: 20, opacity: 0 }}
                                    >
                                        Save Configuration
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
