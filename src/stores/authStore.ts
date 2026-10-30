import { create } from 'zustand';
import { User, onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export interface SavedUser {
  email: string;
  displayName: string;
  photoURL?: string;
}

interface AuthState {
  user: User | null;
  savedUser: SavedUser | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  saveUserInfo: (user: SavedUser) => void;
  clearSavedUserInfo: () => void;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  init: () => () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  savedUser: null,
  loading: true,
  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),
  saveUserInfo: (userInfo) => {
    localStorage.setItem('saved_user_info', JSON.stringify(userInfo));
    set({ savedUser: userInfo });
  },
  clearSavedUserInfo: () => {
    localStorage.removeItem('saved_user_info');
    set({ savedUser: null });
  },
  logout: async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error', error);
    } finally {
      get().clearSavedUserInfo();
    }
  },
  refreshUser: async () => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      await currentUser.reload();
      set({ user: auth.currentUser });
    }
  },
  init: () => {
    const saved = localStorage.getItem('saved_user_info');
    if (saved) {
      try {
        set({ savedUser: JSON.parse(saved) });
      } catch {
        localStorage.removeItem('saved_user_info');
      }
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      set({ user, loading: false });
    });
    return unsubscribe;
  },
}));
