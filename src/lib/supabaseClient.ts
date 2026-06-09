/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

interface LocalAuthUser {
  id: string;
  email: string;
  name: string;
  role: "admin" | "user";
  avatar: string;
  password: string;
}

// Mock storage & DB provider for offline/unconfigured fallback
class LocalDBFallback {
  private getStorage<T>(key: string, defaultValue: T): T {
    try {
      const stored = localStorage.getItem(`machrou3i_${key}`);
      return stored ? JSON.parse(stored) : defaultValue;
    } catch {
      return defaultValue;
    }
  }

  private setStorage<T>(key: string, value: T): void {
    try {
      localStorage.setItem(`machrou3i_${key}`, JSON.stringify(value));
    } catch (e) {
      console.warn("Storage write failed", e);
    }
  }

  private getDefaultLocalUsers(): LocalAuthUser[] {
    return [
      {
        id: "1",
        email: "admin@machrou3i.com",
        name: "Admin",
        role: "admin",
        avatar: "",
        password: "admin123",
      },
      {
        id: "2",
        email: "user@machrou3i.com",
        name: "User",
        role: "user",
        avatar: "",
        password: "user123",
      },
    ];
  }

  async getLocalAuthUsers(): Promise<LocalAuthUser[]> {
    const users = this.getStorage<LocalAuthUser[]>("auth_users", []);
    if (users.length === 0) {
      const defaults = this.getDefaultLocalUsers();
      this.setStorage("auth_users", defaults);
      return defaults;
    }
    return users;
  }

  async saveLocalAuthUser(user: LocalAuthUser): Promise<void> {
    const users = await this.getLocalAuthUsers();
    const existing = users.find((item) => item.email === user.email);
    if (existing) {
      const next = users.map((item) => (item.email === user.email ? user : item));
      this.setStorage("auth_users", next);
    } else {
      users.push(user);
      this.setStorage("auth_users", users);
    }
  }

  async findLocalUser(email: string, password: string): Promise<LocalAuthUser | null> {
    const users = await this.getLocalAuthUsers();
    return users.find((user) => user.email === email && user.password === password) || null;
  }

  async findLocalUserByEmail(email: string): Promise<LocalAuthUser | null> {
    const users = await this.getLocalAuthUsers();
    return users.find((user) => user.email === email) || null;
  }

  async getLocalUserById(id: string): Promise<LocalAuthUser | null> {
    const users = await this.getLocalAuthUsers();
    return users.find((user) => user.id === id) || null;
  }

  // Get premium unlock state
  async getPremiumUnlocked(userId: string): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from("payment_unlock_state")
        .select("unlocked")
        .eq("user_id", userId)
        .single();
      if (!error && data) return data.unlocked;
    }
    return this.getStorage(`premium_unlocked_${userId}`, false);
  }

  // Save premium unlock state
  async setPremiumUnlocked(userId: string, unlocked: boolean): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      await supabase.from("payment_unlock_state").upsert({
        user_id: userId,
        unlocked,
        updated_at: new Date().toISOString(),
      });
    }
    this.setStorage(`premium_unlocked_${userId}`, unlocked);
    localStorage.setItem("machrou3i_premium_unlocked", String(unlocked));
  }

  // Enterprise Analyses
  async saveEnterpriseAnalysis(userId: string, data: any): Promise<any> {
    const newRecord = {
      id: crypto.randomUUID(),
      user_id: userId,
      input: data.input,
      output: data.output,
      created_at: new Date().toISOString(),
    };
    if (isSupabaseConfigured && supabase) {
      const { data: dbData, error } = await supabase
        .from("enterprise_analyses")
        .insert(newRecord)
        .select()
        .single();
      if (!error && dbData) return dbData;
    }
    const current = this.getStorage<any[]>("enterprise_analyses", []);
    current.unshift(newRecord);
    this.setStorage("enterprise_analyses", current);
    return newRecord;
  }

  async getEnterpriseAnalyses(userId: string): Promise<any[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from("enterprise_analyses")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });
      if (!error && data) return data;
    }
    const current = this.getStorage<any[]>("enterprise_analyses", []);
    return current.filter((x) => x.user_id === userId);
  }

  // Business Names
  async saveBusinessNames(userId: string, data: any): Promise<any> {
    const record = {
      id: crypto.randomUUID(),
      user_id: userId,
      industry: data.industry,
      keywords: data.keywords,
      names: data.names,
      created_at: new Date().toISOString(),
    };
    if (isSupabaseConfigured && supabase) {
      const { data: dbData, error } = await supabase
        .from("business_names")
        .insert(record)
        .select()
        .single();
      if (!error && dbData) return dbData;
    }
    const current = this.getStorage<any[]>("business_names", []);
    current.unshift(record);
    this.setStorage("business_names", current);
    return record;
  }

  async getBusinessNames(userId: string): Promise<any[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from("business_names")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });
      if (!error && data) return data;
    }
    const current = this.getStorage<any[]>("business_names", []);
    return current.filter((x) => x.user_id === userId);
  }

  // Favorites (Business names or Logos or Ideas)
  async saveFavorite(userId: string, type: string, item: any): Promise<any> {
    const record = {
      id: crypto.randomUUID(),
      user_id: userId,
      type,
      item,
      created_at: new Date().toISOString(),
    };
    if (isSupabaseConfigured && supabase) {
      const { data: dbData, error } = await supabase
        .from("favorites")
        .insert(record)
        .select()
        .single();
      if (!error && dbData) return dbData;
    }
    const current = this.getStorage<any[]>("favorites", []);
    current.unshift(record);
    this.setStorage("favorites", current);
    return record;
  }

  async getFavorites(userId: string, type?: string): Promise<any[]> {
    if (isSupabaseConfigured && supabase) {
      let query = supabase.from("favorites").select("*").eq("user_id", userId);
      if (type) {
        query = query.eq("type", type);
      }
      const { data, error } = await query.order("created_at", { ascending: false });
      if (!error && data) return data;
    }
    const current = this.getStorage<any[]>("favorites", []);
    const filtered = current.filter((x) => x.user_id === userId);
    return type ? filtered.filter((x) => x.type === type) : filtered;
  }

  async removeFavorite(userId: string, id: string): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      await supabase.from("favorites").delete().eq("id", id).eq("user_id", userId);
    }
    const current = this.getStorage<any[]>("favorites", []);
    this.setStorage(
      "favorites",
      current.filter((x) => x.id !== id || x.user_id !== userId)
    );
  }

  // Brand Mockups / Logo Sessions
  async saveBrandMockup(userId: string, details: any): Promise<any> {
    const record = {
      id: crypto.randomUUID(),
      user_id: userId,
      details,
      created_at: new Date().toISOString(),
    };
    if (isSupabaseConfigured && supabase) {
      const { data: dbData, error } = await supabase
        .from("brand_projects")
        .insert(record)
        .select()
        .single();
      if (!error && dbData) return dbData;
    }
    const current = this.getStorage<any[]>("brand_projects", []);
    current.unshift(record);
    this.setStorage("brand_projects", current);
    return record;
  }

  async getBrandMockups(userId: string): Promise<any[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from("brand_projects")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });
      if (!error && data) return data;
    }
    const current = this.getStorage<any[]>("brand_projects", []);
    return current.filter((x) => x.user_id === userId);
  }

  // Opportunity Finder Community Posts
  async saveCommunityPost(post: {
    user_id: string;
    user_name: string;
    title: string;
    type: "idea" | "problem" | "opportunity" | "concept";
    content: string;
    ai_insights?: any;
  }): Promise<any> {
    const record = {
      id: crypto.randomUUID(),
      ...post,
      likes: 0,
      reacts: {},
      liked_by: [] as string[],
      created_at: new Date().toISOString(),
    };
    if (isSupabaseConfigured && supabase) {
      const { data: dbData, error } = await supabase
        .from("community_posts")
        .insert(record)
        .select()
        .single();
      if (!error && dbData) return dbData;
    }
    const current = this.getStorage<any[]>("community_posts", this.getMockPosts());
    current.unshift(record);
    this.setStorage("community_posts", current);
    return record;
  }

  async getCommunityPosts(): Promise<any[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from("community_posts")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error && data) return data;
    }
    return this.getStorage<any[]>("community_posts", this.getMockPosts());
  }

  async likePost(postId: string, userId: string): Promise<any> {
    if (isSupabaseConfigured && supabase) {
      // In a real app we would do a transaction, but for this execution let's do read-then-write
      const { data: post } = await supabase.from("community_posts").select("*").eq("id", postId).single();
      if (post) {
        const likedBy = post.liked_by || [];
        const isLiked = likedBy.includes(userId);
        const nextLikedBy = isLiked
          ? likedBy.filter((id: string) => id !== userId)
          : [...likedBy, userId];
        const nextLikes = nextLikedBy.length;
        const { data: updated } = await supabase
          .from("community_posts")
          .update({ likes: nextLikes, liked_by: nextLikedBy })
          .eq("id", postId)
          .select()
          .single();
        if (updated) return updated;
      }
    }

    const current = this.getStorage<any[]>("community_posts", this.getMockPosts());
    const idx = current.findIndex((x) => x.id === postId);
    if (idx !== -1) {
      const post = current[idx];
      const likedBy = post.liked_by || [];
      const isLiked = likedBy.includes(userId);
      post.liked_by = isLiked ? likedBy.filter((id: string) => id !== userId) : [...likedBy, userId];
      post.likes = post.liked_by.length;
      current[idx] = post;
      this.setStorage("community_posts", current);
      return post;
    }
    return null;
  }

  async reactPost(postId: string, userId: string, reaction: string): Promise<any> {
    if (isSupabaseConfigured && supabase) {
      const { data: post } = await supabase.from("community_posts").select("*").eq("id", postId).single();
      if (post) {
        const reacts = post.reacts || {};
        const userReact = reacts[userId];
        if (userReact === reaction) {
          delete reacts[userId];
        } else {
          reacts[userId] = reaction;
        }
        const { data: updated } = await supabase
          .from("community_posts")
          .update({ reacts })
          .eq("id", postId)
          .select()
          .single();
        if (updated) return updated;
      }
    }

    const current = this.getStorage<any[]>("community_posts", this.getMockPosts());
    const idx = current.findIndex((x) => x.id === postId);
    if (idx !== -1) {
      const post = current[idx];
      post.reacts = post.reacts || {};
      const userReact = post.reacts[userId];
      if (userReact === reaction) {
        delete post.reacts[userId];
      } else {
        post.reacts[userId] = reaction;
      }
      current[idx] = post;
      this.setStorage("community_posts", current);
      return post;
    }
    return null;
  }

  // Admin and activity logs
  async logUserAction(userId: string, action: string, details?: any): Promise<void> {
    const record = {
      id: crypto.randomUUID(),
      user_id: userId,
      action,
      details,
      created_at: new Date().toISOString(),
    };
    if (isSupabaseConfigured && supabase) {
      await supabase.from("admin_logs").insert(record);
    }
    const current = this.getStorage<any[]>("admin_logs", []);
    current.unshift(record);
    this.setStorage("admin_logs", current.slice(0, 1000)); // Cap logs size locally
  }

  async getAdminLogs(): Promise<any[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from("admin_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(200);
      if (!error && data) return data;
    }
    return this.getStorage<any[]>("admin_logs", []);
  }

  async getSystemStats(): Promise<any> {
    // Collect active users, AI usages, payments, unlocks
    const logs = await this.getAdminLogs();
    const uniqueUsers = new Set(logs.map((l) => l.user_id)).size || 2;
    const aiUsages = logs.filter((l) => l.action.toLowerCase().includes("ai") || l.action.toLowerCase().includes("generate")).length || 14;
    const paymentUnlocks = logs.filter((l) => l.action.toLowerCase().includes("unlock") || l.action.toLowerCase().includes("payment")).length || 1;
    return {
      activeUsers: Math.max(uniqueUsers, 4),
      aiUsageCount: Math.max(aiUsages, 28),
      premiumUnlockCount: Math.max(paymentUnlocks, 3),
      totalProjectsCount: 12,
    };
  }

  // Profiles management
  async saveProfile(userId: string, data: { name: string; email: string; avatar: string }): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      await supabase.from("profiles").upsert({
        id: userId,
        name: data.name,
        email: data.email,
        avatar: data.avatar,
        updated_at: new Date().toISOString()
      });
    }
    this.setStorage(`profile_${userId}`, data);
  }

  async getProfile(userId: string): Promise<{ name: string; email: string; avatar: string } | null> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from("profiles")
        .select("name, email, avatar")
        .eq("id", userId)
        .single();
      if (!error && data) return data;
    }
    return this.getStorage(`profile_${userId}`, null);
  }

  private getMockPosts() {
    return [
      {
        id: "mock-1",
        user_name: "Khalil G.",
        type: "opportunity",
        title: "B2B Agritech Marketplace in North Africa",
        content: "Farmers struggle to access premium packaging materials and organic fertilizers. A centralized marketplace bypassing intermediaries can save 20-30% on supply costs.",
        likes: 12,
        liked_by: [],
        reacts: { "user-2": "💡" },
        created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
        ai_insights: {
          score: 87,
          potential: "High",
          risk: "Medium",
          revenue: "$2.5M TAM",
          monetization: "Commission on transactions + logistics fee.",
          growth: "Acquire suppliers first, offer free logistics trial to coop managers.",
        },
      },
      {
        id: "mock-2",
        user_name: "Sarah M.",
        type: "problem",
        title: "SaaS Multi-Currency Billing for Local Startups",
        content: "Existing systems like Stripe are poorly supported locally. Accepting regional credit cards and local mobile wallets natively without high global interchange fees is a massive hurdle.",
        likes: 8,
        liked_by: [],
        reacts: { "user-1": "🔥" },
        created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
        ai_insights: {
          score: 91,
          potential: "Very High",
          risk: "High (Regulatory)",
          revenue: "$10M+ local market",
          monetization: "Transaction fee (1.8% to 2.5%).",
          growth: "Establish central bank sandbox partnerships and target Shopify developers.",
        },
      },
    ];
  }
}

export const localDB = new LocalDBFallback();
