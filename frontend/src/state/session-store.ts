import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SessionUser } from '@/types/auth';

interface SessionState {
  user: SessionUser | null;
  status: 'idle' | 'authenticated' | 'guest';
  setSession: (user: SessionUser | null) => void;
  clearSession: () => void;
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      user: null,
      status: 'guest',
      setSession: (user) =>
        set({
          user,
          status: user ? 'authenticated' : 'guest',
        }),
      clearSession: () => set({ user: null, status: 'guest' }),
    }),
    { name: 'medical-service-session' },
  ),
);
