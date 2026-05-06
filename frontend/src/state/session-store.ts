import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SessionUser } from '@/types/auth';

interface SessionState {
  user: SessionUser | null;
  status: 'idle' | 'authenticated' | 'guest';
  hasHydrated: boolean;
  setSession: (user: SessionUser | null) => void;
  clearSession: () => void;
  setHasHydrated: (value: boolean) => void;
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      user: null,
      status: 'guest',
      hasHydrated: false,
      setSession: (user) =>
        set({
          user,
          status: user ? 'authenticated' : 'guest',
        }),
      clearSession: () => set({ user: null, status: 'guest' }),
      setHasHydrated: (value) => set({ hasHydrated: value }),
    }),
    {
      name: 'medical-service-session',
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
