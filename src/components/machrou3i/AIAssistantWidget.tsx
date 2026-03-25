import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuthStore } from '@/store/useAuthStore';

type Message = {
    id: string;
    sender: 'user' | 'ai';
    text: string;
};

export default function AIAssistantWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const { user } = useAuthStore();

    const [messages, setMessages] = useState<Message[]>([
        { id: 'msg_1', sender: 'ai', text: `Hello ${user?.name || 'Commander'}. I am your Machrou3i Co-Founder AI. How can I optimize your architecture today?` }
    ]);

    const handleSend = () => {
        if (!input.trim()) return;

        const userMsg: Message = { id: `msg_${Date.now()}`, sender: 'user', text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        // Simulate AI response
        setTimeout(() => {
            const aiResponse: Message = {
                id: `msg_${Date.now() + 1}`,
                sender: 'ai',
                text: 'Analyzing your request... Currently my logic is simulated for this prototype, but in production I will interface directly with your project intelligence node to execute changes.'
            };
            setMessages(prev => [...prev, aiResponse]);
            setIsTyping(false);
        }, 1500);
    };

    return (
        <>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        className="fixed bottom-24 right-6 w-[380px] h-[500px] z-[90] glass cinematic-panel rounded-2xl flex flex-col overflow-hidden depth-shadow-elevated"
                        data-narrate="AI Co-Founder Dialog|Direct line to your project intelligence"
                    >
                        {/* Header */}
                        <div className="bg-surface/80 p-4 border-b border-border flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-full bg-neon/20 flex items-center justify-center border border-neon/50">
                                    <Bot className="h-4 w-4 text-neon animate-pulse" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-foreground text-sm">Synthesizer AI</h3>
                                    <p className="text-[10px] text-neon uppercase tracking-widest font-bold flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-neon animate-pulse" /> Online
                                    </p>
                                </div>
                            </div>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-surface" onClick={() => setIsOpen(false)}>
                                <X className="h-4 w-4" />
                            </Button>
                        </div>

                        {/* Chat Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 themed-scrollbar">
                            {messages.map((msg) => (
                                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[85%] rounded-2xl p-3 text-sm leading-relaxed ${msg.sender === 'user'
                                            ? 'bg-primary text-primary-foreground rounded-tr-sm'
                                            : 'glass border-neon/30 rounded-tl-sm'
                                        }`}>
                                        {msg.sender === 'ai' && <Sparkles className="w-3 h-3 text-neon inline mr-1 -mt-0.5" />}
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                            {isTyping && (
                                <div className="flex justify-start">
                                    <div className="glass border-neon/30 rounded-2xl rounded-tl-sm p-4 flex gap-1 items-center">
                                        <span className="w-1.5 h-1.5 rounded-full bg-neon animate-bounce" />
                                        <span className="w-1.5 h-1.5 rounded-full bg-neon animate-bounce" style={{ animationDelay: '0.15s' }} />
                                        <span className="w-1.5 h-1.5 rounded-full bg-neon animate-bounce" style={{ animationDelay: '0.3s' }} />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Input Area */}
                        <div className="p-4 bg-surface/50 border-t border-border">
                            <form
                                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                                className="flex items-center gap-2"
                            >
                                <Input
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Command directive..."
                                    className="glass focus-visible:ring-neon"
                                />
                                <Button
                                    type="submit"
                                    size="icon"
                                    disabled={!input.trim() || isTyping}
                                    className="bg-neon text-neon-foreground hover:bg-neon/90 transition-colors shrink-0"
                                >
                                    <Send className="h-4 w-4" />
                                </Button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                className="fixed bottom-6 right-6 z-[90] h-14 w-14 rounded-full glass glass-hover flex items-center justify-center bg-neon/10 border-neon/50 shadow-[0_0_30px_-5px_rgba(52,211,153,0.4)]"
                onClick={() => setIsOpen(!isOpen)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                data-narrate="Awaken AI|Summon your dedicated project intelligence"
            >
                {isOpen ? <X className="h-6 w-6 text-foreground" /> : <MessageSquare className="h-6 w-6 text-neon" />}
                {!isOpen && (
                    <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-destructive rounded-full border-2 border-background animate-pulse" />
                )}
            </motion.button>
        </>
    );
}
