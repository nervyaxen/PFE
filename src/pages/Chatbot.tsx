import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Sparkles, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";

const Chatbot = () => {
  const { user } = useAuth();

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hello! I am your AI assistant.",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);

  if (!user) return <Navigate to="/login" replace />;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // ✨ FAKE STREAMING EFFECT (SMOOTH OUTPUT)
  const streamText = async (text: string) => {
    let current = "";

    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

    for (let i = 0; i < text.length; i++) {
      current += text[i];

      await new Promise((res) => setTimeout(res, 8)); // speed

      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1].content = current;
        return updated;
      });
    }
  };

  // 🚀 SEND
  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const text = input;

    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:3001/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: text,
          userId: user?.id || "guest", // 🔥 IMPORTANT FIX
        }),
      });

      // 🔍 DEBUG RESPONSE STATUS
      if (!res.ok) {
        throw new Error("Request failed");
      }

      const data = await res.json();

      console.log("AI RESPONSE:", data); // 🔍 DEBUG

      const reply =
        data?.reply ||
        "⚠️ No response from AI. Check backend.";

      // ✨ STREAM EFFECT
      await streamText(reply);

    } catch (err) {
      console.error("ERROR:", err); // 🔍 DEBUG

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "⚠️ Server error. Check backend or API key.",
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
        <div className="inline-flex items-center gap-2 text-neon text-xs tracking-wide">
          <Sparkles className="w-4 h-4" />
          NEXT-GEN AI
        </div>

        <h1 className="text-3xl font-semibold mt-2">Assistant</h1>
      </div>

      {/* CHAT */}
      <div className="flex-1 glass-panel rounded-2xl flex flex-col overflow-hidden border border-white/5 backdrop-blur-xl">

        {/* MESSAGES */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          <AnimatePresence>
            {messages.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""
                  }`}
              >
                {/* Avatar */}
                <div className="w-9 h-9 flex items-center justify-center bg-secondary/60 rounded-xl backdrop-blur">
                  {m.role === "user" ? <User size={16} /> : <Bot size={16} />}
                </div>

                {/* Bubble */}
                <div
                  className={`px-4 py-2 rounded-2xl max-w-[75%] text-sm whitespace-pre-wrap shadow-sm
                  ${m.role === "user"
                      ? "bg-neon/10 border border-neon/20"
                      : "bg-secondary/40 border border-white/10"
                    }`}
                >
                  {m.content}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Loading */}
          {loading && (
            <div className="flex items-center gap-2 text-xs opacity-60">
              <Loader2 className="animate-spin w-4 h-4" />
              thinking...
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* INPUT */}
        <div className="p-4 border-t border-white/5 flex gap-2 bg-background/60 backdrop-blur-xl">

          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Ask anything..."
            className="flex-1 bg-secondary/50 px-4 py-3 rounded-xl resize-none outline-none text-sm focus:ring-1 focus:ring-neon/30 transition"
          />

          <button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="bg-neon px-4 rounded-xl flex items-center justify-center hover:scale-105 active:scale-95 transition disabled:opacity-50"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;