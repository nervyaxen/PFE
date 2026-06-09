import { useState, useEffect } from "react";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { generateOpportunityInsights } from "@/lib/geminiService";
import { localDB } from "@/lib/supabaseClient";
import {
  Sparkles,
  Heart,
  MessageSquare,
  Bookmark,
  Share2,
  TrendingUp,
  Plus,
  Send,
  Loader2,
  Cpu,
  Star,
  Shield,
  Lightbulb,
  DollarSign,
  AlertTriangle,
  Award,
  Users
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface CommunityPost {
  id: string;
  user_name: string;
  type: "idea" | "problem" | "opportunity" | "concept";
  title: string;
  content: string;
  likes: number;
  reacts: Record<string, string>;
  liked_by: string[];
  created_at: string;
  ai_insights?: {
    score: number;
    potential: string;
    risk: string;
    revenue: string;
    monetization: string;
    growth: string;
  };
}

export default function OpportunityFinder() {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();

  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [filterType, setFilterType] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest"); // newest, trending, top

  const [loading, setLoading] = useState(false);
  const [posting, setPosting] = useState(false);
  const [newPost, setNewPost] = useState({
    title: "",
    type: "idea" as any,
    content: ""
  });

  const [selectedInsights, setSelectedInsights] = useState<any | null>(null);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    setLoading(true);
    try {
      const data = await localDB.getCommunityPosts();
      setPosts(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: "Auth Required",
        description: "You must be logged in to share a community opportunity.",
        variant: "destructive"
      });
      return;
    }

    if (!newPost.title || !newPost.content) {
      toast({
        title: "Fields Required",
        description: "Please supply a valid title and explanation.",
        variant: "destructive"
      });
      return;
    }

    setPosting(true);
    try {
      // First, get Gemini insights for this post dynamically!
      toast({
        title: "AI Analysis Engaged",
        description: "Consulting Gemini models to compute opportunity potentials..."
      });

      const insights = await generateOpportunityInsights({
        title: newPost.title,
        type: newPost.type,
        content: newPost.content
      });

      const saved = await localDB.saveCommunityPost({
        user_id: user.id,
        user_name: user.name,
        title: newPost.title,
        type: newPost.type,
        content: newPost.content,
        ai_insights: insights
      });

      setPosts((prev) => [saved, ...prev]);
      setNewPost({ title: "", type: "idea", content: "" });
      await localDB.logUserAction(user.id, "create_community_post", { title: saved.title });

      toast({
        title: "Post Shared!",
        description: "Your business opportunity is now public with full AI analysis."
      });
    } catch (err) {
      console.error(err);
      toast({
        title: "Sharing Failed",
        description: "Unable to publish your opportunity.",
        variant: "destructive"
      });
    } finally {
      setPosting(false);
    }
  };

  const handleLike = async (postId: string) => {
    if (!user) {
      toast({ description: "Please sign in to react to posts.", variant: "destructive" });
      return;
    }
    try {
      const updated = await localDB.likePost(postId, user.id);
      if (updated) {
        setPosts((prev) => prev.map((p) => (p.id === postId ? updated : p)));
        // Also update selected insights if they are open for this post
        if (selectedInsights && selectedInsights.postId === postId) {
          setSelectedInsights({ ...selectedInsights, liked_by: updated.liked_by, likes: updated.likes });
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleReact = async (postId: string, reaction: string) => {
    if (!user) {
      toast({ description: "Please sign in to react.", variant: "destructive" });
      return;
    }
    try {
      const updated = await localDB.reactPost(postId, user.id, reaction);
      if (updated) {
        setPosts((prev) => prev.map((p) => (p.id === postId ? updated : p)));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleShare = (post: CommunityPost) => {
    navigator.clipboard.writeText(`Check out "${post.title}" on Machrou3i! AI Opportunity Score: ${post.ai_insights?.score || "N/A"}%`);
    toast({ description: "Link copied to clipboard!" });
  };

  // Filter and Sort logic
  const processedPosts = posts
    .filter((post) => filterType === "all" || post.type === filterType)
    .sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
      if (sortBy === "trending") {
        // base on total reacts + likes count
        const aScore = a.likes + Object.keys(a.reacts || {}).length;
        const bScore = b.likes + Object.keys(b.reacts || {}).length;
        return bScore - aScore;
      }
      if (sortBy === "top") {
        return (b.ai_insights?.score || 0) - (a.ai_insights?.score || 0);
      }
      return 0;
    });

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 bg-gradient-hero">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <span className="inline-flex items-center gap-1 text-[10px] font-mono tracking-widest text-neon uppercase bg-neon/10 px-3 py-1 rounded-full mb-3">
              <Sparkles className="h-3 w-3" />
              Community Synergy Module
            </span>
            <h1 className="text-3xl md:text-4xl font-bold font-heading text-gradient-neon">
              {t("opportunityFinder.title", "AI Opportunity Finder")}
            </h1>
            <p className="text-muted-foreground text-xs md:text-sm mt-1">
              {t("opportunityFinder.subtitle", "Share industry gaps, problems, or concepts, and let AI evaluate their monetization potential.")}
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-stretch">
          {/* Form & filters */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {/* Create Post Form */}
            {user ? (
              <form onSubmit={handleCreatePost} className="glass-panel rounded-2xl p-6 space-y-4 bg-black/45 border-border/30">
                <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Plus className="h-4 w-4 text-neon" />
                  Share Opportunity
                </h2>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-muted-foreground tracking-wider">Title</label>
                  <input
                    type="text"
                    placeholder="e.g. EV battery swap grid in Tunis"
                    value={newPost.title}
                    onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                    className="w-full bg-secondary/35 border border-border/60 rounded-xl px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-neon focus:ring-1 focus:ring-neon/30"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-muted-foreground tracking-wider">Classification</label>
                  <select
                    value={newPost.type}
                    onChange={(e) => setNewPost({ ...newPost, type: e.target.value as any })}
                    className="w-full bg-secondary/35 border border-border/60 rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none focus:border-neon focus:ring-1 focus:ring-neon/30"
                  >
                    <option value="idea">Concept / Idea</option>
                    <option value="problem">Unresolved Problem</option>
                    <option value="opportunity">Market Opportunity</option>
                    <option value="concept">General Product</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-muted-foreground tracking-wider">Details / Description</label>
                  <textarea
                    placeholder="Describe the gap in detail. What are the key bottlenecks? Who experiences this problem?"
                    value={newPost.content}
                    onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                    className="w-full bg-secondary/35 border border-border/60 rounded-xl px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-neon focus:ring-1 focus:ring-neon/30 h-24 resize-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={posting}
                  className="w-full mt-2 py-3 rounded-xl font-semibold text-xs bg-neon text-black glow-neon hover:opacity-95 disabled:opacity-40 transition-all flex items-center justify-center gap-2"
                >
                  {posting ? (
                    <>
                      <Loader2 className="h-4.5 w-4.5 animate-spin" />
                      Performing AI Audit...
                    </>
                  ) : (
                    <>
                      <Send className="h-3.5 w-3.5" />
                      Publish & Analyze
                    </>
                  )}
                </button>
              </form>
            ) : (
              <div className="glass-panel rounded-2xl p-6 text-center border-dashed border-border/60 bg-black/20">
                <p className="text-xs text-muted-foreground">Only registered members can post and generate AI intelligence analyses.</p>
              </div>
            )}

            {/* Filter controls */}
            <div className="glass-panel rounded-2xl p-5 space-y-4 bg-black/20 border-border/30">
              <div>
                <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">Filter Category</span>
                <div className="flex gap-1.5 flex-wrap mt-2">
                  {["all", "idea", "problem", "opportunity", "concept"].map((type) => (
                    <button
                      key={type}
                      onClick={() => setFilterType(type)}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-semibold transition-all ${
                        filterType === type
                          ? "bg-neon text-black glow-neon"
                          : "bg-secondary/40 text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                      }`}
                    >
                      {type.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">Sort Feed By</span>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {[
                    { val: "newest", label: "Newest" },
                    { val: "trending", label: "Trending" },
                    { val: "top", label: "Top Score" }
                  ].map((s) => (
                    <button
                      key={s.val}
                      onClick={() => setSortBy(s.val)}
                      className={`py-1.5 rounded-lg text-[10px] font-semibold transition-all text-center ${
                        sortBy === s.val
                          ? "bg-neon/15 border border-neon text-neon"
                          : "bg-secondary/20 border border-transparent text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Social feed & dynamic insights panel */}
          <div className="lg:col-span-8 flex flex-col justify-start">
            <div className="grid lg:grid-cols-12 gap-6 items-stretch">
              {/* Feed lists */}
              <div className={selectedInsights ? "lg:col-span-7 space-y-4" : "lg:col-span-12 space-y-4"}>
                <AnimatePresence mode="popLayout">
                  {loading && (
                    <div className="flex flex-col items-center justify-center p-12 text-center">
                      <Loader2 className="h-10 w-10 text-neon animate-spin mb-3" />
                      <span className="text-xs text-muted-foreground">Sieving community posts...</span>
                    </div>
                  )}

                  {!processedPosts.length && !loading && (
                    <div className="glass-panel p-12 rounded-2xl border-dashed border-border/60 text-center">
                      <p className="text-xs text-muted-foreground">No proposals logged in this category.</p>
                    </div>
                  )}

                  {processedPosts.map((post) => {
                    const userLiked = user ? post.liked_by?.includes(user.id) : false;
                    return (
                      <motion.div
                        layoutId={`post-card-${post.id}`}
                        key={post.id}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className={`glass-panel p-5 rounded-2xl border-border/30 bg-black/35 hover:border-neon/30 transition-all flex flex-col justify-between ${
                          selectedInsights?.id === post.id ? "border-neon bg-neon/5" : ""
                        }`}
                      >
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] bg-secondary/80 border border-border text-foreground px-2 py-0.5 rounded font-bold font-mono">
                                {post.type.toUpperCase()}
                              </span>
                              <span className="text-[10px] text-muted-foreground font-light">{post.user_name}</span>
                            </div>
                            {post.ai_insights && (
                              <button
                                onClick={() => setSelectedInsights(post)}
                                className="flex items-center gap-1 text-[10px] font-mono text-neon bg-neon/10 px-2.5 py-1 rounded-full border border-neon/20 hover:bg-neon hover:text-black transition-colors"
                              >
                                <Cpu className="h-3 w-3" />
                                AI Audit: {post.ai_insights.score}%
                              </button>
                            )}
                          </div>

                          <h3 className="text-sm font-bold text-foreground font-heading">{post.title}</h3>
                          <p className="text-xs text-muted-foreground leading-relaxed font-light whitespace-pre-line">
                            {post.content}
                          </p>
                        </div>

                        {/* Interactive bar */}
                        <div className="flex justify-between items-center mt-5 pt-3.5 border-t border-border/10">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleLike(post.id)}
                              className={`flex items-center gap-1 text-[10px] transition-all py-1 px-2.5 rounded-lg bg-secondary/35 border ${
                                userLiked
                                  ? "border-red-500/30 text-red-400"
                                  : "border-border/30 text-muted-foreground hover:text-red-400"
                              }`}
                            >
                              <Heart className={`h-3 w-3 ${userLiked ? "fill-current" : ""}`} />
                              {post.likes}
                            </button>

                            {/* Reactions panel */}
                            <div className="flex items-center gap-0.5 bg-secondary/20 p-0.5 rounded-lg border border-border/20">
                              {["💡", "🔥", "🚀"].map((emoji) => {
                                // Count how many users reacted with this emoji
                                const count = Object.values(post.reacts || {}).filter((r) => r === emoji).length;
                                return (
                                  <button
                                    key={emoji}
                                    onClick={() => handleReact(post.id, emoji)}
                                    className="px-1.5 py-0.5 text-[10px] rounded hover:bg-secondary/40 transition-colors flex items-center gap-0.5"
                                  >
                                    <span>{emoji}</span>
                                    {count > 0 && <span className="text-[8px] text-muted-foreground">{count}</span>}
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          <button
                            onClick={() => handleShare(post)}
                            className="p-1 rounded-lg text-muted-foreground hover:text-foreground transition-all"
                            title="Share opportunity details"
                          >
                            <Share2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>

              {/* Dynamic Insights panel */}
              {selectedInsights && (
                <div className="lg:col-span-5">
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="glass-panel p-5 rounded-2xl border-neon/30 bg-black/55 sticky top-24 space-y-5"
                  >
                    <div className="flex justify-between items-center pb-3 border-b border-border/20">
                      <div className="flex items-center gap-1.5">
                        <Cpu className="h-4.5 w-4.5 text-neon" />
                        <span className="text-xs uppercase font-bold text-foreground tracking-wider">AI Audit Board</span>
                      </div>
                      <button
                        onClick={() => setSelectedInsights(null)}
                        className="text-xs text-muted-foreground hover:text-neon"
                      >
                        Close
                      </button>
                    </div>

                    <div className="text-center p-4 rounded-xl border border-neon/15 bg-neon/5">
                      <span className="text-3xl font-bold font-heading text-gradient-neon block">
                        {selectedInsights.ai_insights.score}%
                      </span>
                      <span className="text-[9px] uppercase tracking-widest text-muted-foreground block mt-1">Opportunity Score</span>
                    </div>

                    <div className="space-y-3.5">
                      <div className="grid grid-cols-2 gap-3.5">
                        <div className="p-3.5 rounded-xl border border-border/40 bg-black/25">
                          <p className="text-[9px] uppercase font-semibold text-muted-foreground flex items-center gap-1">
                            <Star className="h-3 w-3 text-gold" />
                            Potential
                          </p>
                          <p className="text-xs font-bold text-foreground mt-1">{selectedInsights.ai_insights.potential}</p>
                        </div>
                        <div className="p-3.5 rounded-xl border border-border/40 bg-black/25">
                          <p className="text-[9px] uppercase font-semibold text-muted-foreground flex items-center gap-1">
                            <AlertTriangle className="h-3 w-3 text-red-400" />
                            Risk Level
                          </p>
                          <p className="text-xs font-bold text-foreground mt-1">{selectedInsights.ai_insights.risk}</p>
                        </div>
                      </div>

                      <div className="p-3.5 rounded-xl border border-border/40 bg-black/25">
                        <p className="text-[9px] uppercase font-semibold text-muted-foreground flex items-center gap-1">
                          <DollarSign className="h-3 w-3 text-neon" />
                          TAM / Revenue Focus
                        </p>
                        <p className="text-xs font-bold text-foreground mt-1">{selectedInsights.ai_insights.revenue}</p>
                      </div>

                      <div className="p-3.5 rounded-xl border border-border/40 bg-black/25 space-y-1">
                        <p className="text-[9px] uppercase font-semibold text-muted-foreground flex items-center gap-1">
                          <Award className="h-3 w-3 text-neon" />
                          Monetization Model
                        </p>
                        <p className="text-xs text-muted-foreground font-light leading-relaxed">
                          {selectedInsights.ai_insights.monetization}
                        </p>
                      </div>

                      <div className="p-3.5 rounded-xl border border-border/40 bg-black/25 space-y-1">
                        <p className="text-[9px] uppercase font-semibold text-muted-foreground flex items-center gap-1">
                          <Users className="h-3 w-3 text-neon" />
                          Strategic Growth Action
                        </p>
                        <p className="text-xs text-muted-foreground font-light leading-relaxed">
                          {selectedInsights.ai_insights.growth}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
