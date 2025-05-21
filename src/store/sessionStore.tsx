import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { addSession, getSessions } from '../utils/storage';

interface SessionState {
  sessions: string[];
  createSession: (onSelect: (id: string) => void) => void;
  createSessionAsync: () => Promise<string>;
  loadSessions: () => void;
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set, get) => ({
      sessions: [],
      loadSessions: () => {
        const sessions = getSessions();
        set({ sessions });
      },
      createSession: (onSelect) => {
        const newId = crypto.randomUUID();
        addSession(newId);
        set((state: SessionState) => ({
          sessions: [...state.sessions, newId],
        }));
        onSelect(newId);
      },
      createSessionAsync: async () => {
      const newId = crypto.randomUUID();
      addSession(newId);
      set((state) => ({
        sessions: [...state.sessions, newId],
      }));
      return newId;
    },
    }),
    {
      name: 'session-storage',
    }
  )
);
