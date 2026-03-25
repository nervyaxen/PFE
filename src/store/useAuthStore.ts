import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type UserRole = 'user' | 'manager' | 'admin';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
  login: (email: string, role?: UserRole) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
}

// Mock auth data for demonstration
const MOCK_TOKENS: Record<UserRole, string> = {
  user: 'mock_jwt_token_user_base64_etc...',
  manager: 'mock_jwt_token_manager_base64_etc...',
  admin: 'mock_jwt_token_admin_base64_etc...',
};

const MOCK_USERS: Record<string, User> = {
  'admin@machrou3i.com': { id: 'usr_admin123', name: 'System Admin', email: 'admin@machrou3i.com', role: 'admin' },
  'manager@machrou3i.com': { id: 'usr_mgr123', name: 'Project Manager', email: 'manager@machrou3i.com', role: 'manager' },
  'user@machrou3i.com': { id: 'usr_reg123', name: 'Standard User', email: 'user@machrou3i.com', role: 'user' },
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      token: null,

      login: async (email: string, requestedRole?: UserRole) => {
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 800));
        
        // Find mocked user or generate a default one based on requested role
        const foundUser = Object.values(MOCK_USERS).find((u) => u.email === email);
        const activeRole = foundUser?.role || requestedRole || 'user';
        
        const loggedInUser: User = foundUser || {
          id: `usr_new_${Date.now()}`,
          name: email.split('@')[0],
          email,
          role: activeRole,
        };

        set({
          user: loggedInUser,
          isAuthenticated: true,
          token: MOCK_TOKENS[activeRole],
        });
      },

      logout: () => {
        set({ user: null, isAuthenticated: false, token: null });
      },

      updateProfile: (data) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...data } : null,
        }));
      },
    }),
    {
      name: 'machrou3i-auth-storage', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), 
    }
  )
);
