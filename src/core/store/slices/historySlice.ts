import { create } from 'zustand';
import { persist, PersistStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

type HistoryState = {
  history: string[];
  addToHistory: (regex: string) => void;
  clearHistory: () => void;
  removeFromHistory: (index: number) => void; // ✅ NUEVA función
};

const customStorage: PersistStorage<HistoryState> = {
  getItem: async (name) => {
    const json = await AsyncStorage.getItem(name);
    if (!json) return null;
    try {
      return JSON.parse(json);
    } catch {
      return null;
    }
  },
  setItem: async (name, value) => {
    await AsyncStorage.setItem(name, JSON.stringify(value));
  },
  removeItem: async (name) => {
    await AsyncStorage.removeItem(name);
  },
};

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set) => ({
      history: [],
      addToHistory: (regex) =>
        set((state) => ({
          history: [regex, ...state.history.filter((r) => r !== regex)],
        })),
      clearHistory: () => set({ history: [] }),
      removeFromHistory: (index) => // ✅ NUEVA implementación
        set((state) => ({
          history: state.history.filter((_, i) => i !== index),
        })),
    }),
    {
      name: 'regex-history',
      storage: customStorage,
    }
  )
);
