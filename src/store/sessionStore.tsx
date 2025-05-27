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
  persist(  //새로고침, 앱 종료 돼도 데이터 유지.
    (set) => ({
      sessions: [],
      loadSessions: () => {
        const sessions = getSessions();
        set({ sessions });
      },
      createSession: (onSelect) => {
        const newId = crypto.randomUUID();
        addSession(newId);
        set((state: SessionState) => ({
          sessions: [newId, ...state.sessions],
        }));
        onSelect(newId);
      },
      createSessionAsync: async () => {
      const newId = crypto.randomUUID();
      addSession(newId);
      set((state) => ({
        sessions: [newId, ...state.sessions],
      }));
      return newId;
    },
    }),
    {
      name: 'session-storage',
    }
  )
);
