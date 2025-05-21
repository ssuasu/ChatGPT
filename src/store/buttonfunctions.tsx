import { create } from 'zustand'

export const useSidebarStore = create<{
  isOpen: boolean;
  toggle: () => void;
}>((set) => ({
  isOpen: true,
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
}));
