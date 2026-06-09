import { createContext, useContext, useState, useEffect, ReactNode } from "react";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { localDB, isSupabaseConfigured, supabase } from "@/lib/supabaseClient";

export type UserRole = "admin" | "user";

export interface User {
  avatar: string;
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isAdmin: boolean;
  premiumUnlocked: boolean;
  unlockPremium: () => Promise<void>;
  uploadAvatar: (file: File) => Promise<string | null>;
  updateProfile: (profile: { name?: string; avatar?: string }) => Promise<boolean>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

const DEMO_USERS = [
  {
    id: "1",
    email: "admin@machrou3i.com",
    name: "Admin",
    role: "admin" as UserRole,
    avatar: "",
    password: "admin123",
  },
  {
    id: "2",
    email: "user@machrou3i.com",
    name: "User",
    role: "user" as UserRole,
    avatar: "",
    password: "user123",
  },
];

const createUserObject = (id: string, email: string, name: string, role: UserRole, avatar = "") => ({
  id,
  email,
  name,
  role,
  avatar,
});

const resolveUserRole = (supaUser: any): UserRole => {
  const metadataRole = (supaUser.user_metadata as any)?.role;
  if (metadataRole === "admin") return "admin";
  if (supaUser.email === import.meta.env.VITE_ADMIN_EMAIL) return "admin";
  return "user";
};

const resolveUserName = (supaUser: any) => {
  return (
    (supaUser.user_metadata as any)?.full_name ||
    (supaUser.user_metadata as any)?.name ||
    supaUser.email?.split("@")[0] ||
    "User"
  );
};

const resolveUserAvatar = (supaUser: any) => {
  return (supaUser.user_metadata as any)?.avatar_url || "";
};

const buildUserFromSupabase = (supaUser: any) =>
  createUserObject(
    supaUser.id,
    supaUser.email || "",
    resolveUserName(supaUser),
    resolveUserRole(supaUser),
    resolveUserAvatar(supaUser)
  );

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window === "undefined") return null;
    const saved = localStorage.getItem("machrou3i_user");
    return saved ? JSON.parse(saved) : null;
  });

  const [premiumUnlocked, setPremiumUnlocked] = useState(false);

  useEffect(() => {
    const loadPremium = async () => {
      if (user) {
        const unlocked = await localDB.getPremiumUnlocked(user.id);
        setPremiumUnlocked(unlocked);
      } else {
        setPremiumUnlocked(false);
      }
    };
    loadPremium();
  }, [user]);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return undefined;
    const subscription = supabase.auth.onAuthStateChange((_event, session) => {
      const supaUser = session?.user;
      if (supaUser) {
        const storedUser = buildUserFromSupabase(supaUser);
        setUser(storedUser);
        localStorage.setItem("machrou3i_user", JSON.stringify(storedUser));
      } else {
        setUser(null);
        localStorage.removeItem("machrou3i_user");
      }
    });

    return () => subscription.data?.subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error || !data.user) return false;
      const loggedInUser = buildUserFromSupabase(data.user);
      setUser(loggedInUser);
      localStorage.setItem("machrou3i_user", JSON.stringify(loggedInUser));
      await localDB.logUserAction(loggedInUser.id, "user_login");
      return true;
    }

    const saved = await localDB.getLocalAuthUsers();
    const current = saved.find((item) => item.email === email && item.password === password);
    if (!current) return false;
    const fallbackUser = createUserObject(current.id, current.email, current.name, current.role, current.avatar);
    setUser(fallbackUser);
    localStorage.setItem("machrou3i_user", JSON.stringify(fallbackUser));
    await localDB.logUserAction(fallbackUser.id, "user_login");
    return true;
  };

  const signup = async (name: string, email: string, password: string) => {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name, full_name: name } },
      });
      if (error || !data.user) return false;
      const newUser = buildUserFromSupabase(data.user);
      setUser(newUser);
      localStorage.setItem("machrou3i_user", JSON.stringify(newUser));
      await localDB.logUserAction(newUser.id, "user_signup");
      return true;
    }

    const existing = await localDB.findLocalUserByEmail(email);
    if (existing) return false;

    const newUser: User = createUserObject(crypto.randomUUID(), email, name, "user");
    await localDB.saveLocalAuthUser({ ...newUser, password });
    setUser(newUser);
    localStorage.setItem("machrou3i_user", JSON.stringify(newUser));
    await localDB.logUserAction(newUser.id, "user_signup");
    return true;
  };

  const logout = async () => {
    try {
      if (user) {
        await localDB.logUserAction(user.id, "user_logout");
      }
    } catch (error) {
      console.warn("Logout audit failed", error);
    }

    try {
      if (isSupabaseConfigured && supabase) {
        await supabase.auth.signOut();
      }
    } catch (error) {
      console.warn("Supabase sign out failed", error);
    }

    setUser(null);
    localStorage.removeItem("machrou3i_user");
    localStorage.removeItem("machrou3i_premium_unlocked");
  };

  const uploadAvatar = async (file: File): Promise<string | null> => {
    if (!user) return null;
    if (isSupabaseConfigured && supabase) {
      const fileExt = file.name.split(".").pop() || "png";
      const filePath = `avatars/${user.id}.${fileExt}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });
      if (uploadError || !uploadData) return null;
      const { data: publicUrlData, error: publicUrlError } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);
      if (publicUrlError || !publicUrlData) return null;
      return publicUrlData.publicUrl;
    }
    return null;
  };

  const updateProfile = async (profile: { name?: string; avatar?: string }) => {
    if (!user) return false;
    if (isSupabaseConfigured && supabase) {
      const updateData: any = {};
      if (profile.name) updateData.full_name = profile.name;
      if (profile.avatar) updateData.avatar_url = profile.avatar;

      const { data, error } = await supabase.auth.updateUser({ data: updateData });
      if (error || !data) return false;
      const supaUser = (data as any).user ?? data;
      const updatedUser = buildUserFromSupabase(supaUser);
      setUser(updatedUser);
      localStorage.setItem("machrou3i_user", JSON.stringify(updatedUser));
      await localDB.saveProfile(updatedUser.id, {
        name: updatedUser.name,
        email: updatedUser.email,
        avatar: updatedUser.avatar,
      });
      await localDB.logUserAction(updatedUser.id, "admin_profile_updated");
      return true;
    }

    const saved = await localDB.findLocalUserByEmail(user.email);
    if (!saved) return false;
    const next = {
      ...saved,
      name: profile.name ?? saved.name,
      avatar: profile.avatar ?? saved.avatar,
    };
    await localDB.saveLocalAuthUser(next);
    const updatedUser = createUserObject(next.id, next.email, next.name, next.role, next.avatar);
    setUser(updatedUser);
    localStorage.setItem("machrou3i_user", JSON.stringify(updatedUser));
    await localDB.saveProfile(updatedUser.id, { name: updatedUser.name, email: updatedUser.email, avatar: updatedUser.avatar });
    return true;
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    if (!user) return false;
    if (isSupabaseConfigured && supabase) {
      const { data: verifyData, error: verifyError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword,
      });
      if (verifyError || !verifyData.user) return false;
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) return false;
      await localDB.logUserAction(user.id, "admin_password_changed");
      return true;
    }

    const saved = await localDB.findLocalUser(user.email, currentPassword);
    if (!saved) return false;
    await localDB.saveLocalAuthUser({ ...saved, password: newPassword });
    await localDB.logUserAction(user.id, "admin_password_changed");
    return true;
  };

  const unlockPremium = async () => {
    if (!user) return;
    await localDB.setPremiumUnlocked(user.id, true);
    setPremiumUnlocked(true);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        isAdmin: user?.role === "admin",
        premiumUnlocked,
        unlockPremium,
        uploadAvatar,
        updateProfile,
        changePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
