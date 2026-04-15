import { createContext, useContext, useState, ReactNode } from "react";

export type UserRole = "admin" | "user";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

const TEST_USERS: Record<string, { password: string; user: User }> = {
  "admin@machrou3i.com": {
    password: "admin123",
    user: { id: "1", email: "admin@machrou3i.com", name: "Admin", role: "admin" },
  },
  "user@machrou3i.com": {
    password: "user123",
    user: { id: "2", email: "user@machrou3i.com", name: "User", role: "user" },
  },
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("machrou3i_user");
    return saved ? JSON.parse(saved) : null;
  });

  const login = async (email: string, password: string) => {
    const entry = TEST_USERS[email];
    if (entry && entry.password === password) {
      setUser(entry.user);
      localStorage.setItem("machrou3i_user", JSON.stringify(entry.user));
      return true;
    }
    return false;
  };

  const signup = async (name: string, email: string, password: string) => {
    if (TEST_USERS[email]) return false;
    const newUser: User = { id: crypto.randomUUID(), email, name, role: "user" };
    TEST_USERS[email] = { password, user: newUser };
    setUser(newUser);
    localStorage.setItem("machrou3i_user", JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("machrou3i_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isAdmin: user?.role === "admin" }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
