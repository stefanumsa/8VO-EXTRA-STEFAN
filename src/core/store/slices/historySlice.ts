import { create } from 'zustand';
import { persist, PersistStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type HistoryItem = {
  regex: string;
  text: string;
  result: string;
  timestamp: number; // <-- nuevo campo timestamp
};

type HistoryState = {
  history: HistoryItem[];
  addToHistory: (item: Omit<HistoryItem, 'timestamp'>) => void;
  clearHistory: () => void;
  removeFromHistory: (index: number) => void;
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
      addToHistory: (item) =>
        set((state) => {
          const newItem = { ...item, timestamp: Date.now() };
          const filtered = state.history.filter(
            (h) => !(h.regex === newItem.regex && h.text === newItem.text)
          );
          return {
            history: [newItem, ...filtered].sort((a, b) => b.timestamp - a.timestamp),
          };
        }),
      clearHistory: () => set({ history: [] }),
      removeFromHistory: (index) =>
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
