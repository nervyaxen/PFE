import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Sparkles, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";

import { GoogleGenerativeAI } from "@google/generative-ai";

const Chatbot = () => {
  const { user } = useAuth();

  const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

  const genAI = new GoogleGenerativeAI(API_KEY);

  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash-lite"
  });

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hello! I am your AI assistant (Gemini mode).",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  if (!user) return <Navigate to="/login" replace />;

  // ✨ STREAM TEXT
  const streamText = async (text: string) => {
    let current = "";

    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: "" },
    ]);

    for (let i = 0; i < text.length; i++) {
      current += text[i];
      await new Promise((r) => setTimeout(r, 5));

      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1].content = current;
        return updated;
      });
    }
  };

  // 🚀 SEND MESSAGE (FIXED)
  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const text = input;

    setMessages((prev) => [
      ...prev,
      { role: "user", content: text },
    ]);

    setInput("");
    setLoading(true);

    try {
      const chat = model.startChat();

      const result = await chat.sendMessage(text);
      const response = await result.response;

      const reply = response.text();

      await streamText(reply || "No response");
    } catch (err) {
      console.error("GEMINI ERROR:", err);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "⚠️ Gemini error (check API key or quota).",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 flex flex-col bg-gradient-to-b from-background to-background/80">

      {/* HEADER */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 text-neon text-xs">
          <Sparkles className="w-4 h-4" />
          GEMINI AI
        </div>
        <h1 className="text-3xl font-semibold mt-2">Assistant</h1>
      </div>

      {/* CHAT */}
      <div className="flex-1 glass-panel rounded-2xl flex flex-col overflow-hidden">

        {/* MESSAGES */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          <AnimatePresence>
            {messages.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}
              >
                <div className="w-9 h-9 flex items-center justify-center bg-secondary/60 rounded-xl">
                  {m.role === "user" ? <User size={16} /> : <Bot size={16} />}
                </div>

                <div className="px-4 py-2 rounded-2xl max-w-[75%] text-sm bg-secondary/40">
                  {m.content}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {loading && (
            <div className="flex items-center gap-2 text-xs opacity-60">
              <Loader2 className="animate-spin w-4 h-4" />
              thinking...
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* INPUT */}
        <div className="border-t p-3 flex items-end gap-2 bg-background/60">

          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            className="flex-1 min-h-[44px] max-h-[120px] px-4 py-2 rounded-xl bg-secondary/50 text-sm outline-none resize-none"
            placeholder="Ask anything..."
          />

          {/* ✅ FIXED BUTTON (always visible) */}
          <button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="w-11 h-11 flex items-center justify-center bg-neon rounded-xl disabled:opacity-40"
          >
            <Send size={16} />
          </button>

        </div>
      </div>
    </div>
  );
};

export default Chatbot;