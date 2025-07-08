import { create } from 'zustand';
import { persist, PersistStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type HistoryItem = {
  regex: string;
  text: string;
  result: string;
  timestamp: string; // Ahora correctamente tipado como string
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
          const newItem: HistoryItem = {
            ...item,
            timestamp: new Date().toISOString(), // ⏰ Fecha en formato string ISO
          };

          // Evita duplicados exactos por regex + text
          const filtered = state.history.filter(
            (h) => !(h.regex === newItem.regex && h.text === newItem.text)
          );

          return {
            history: [newItem, ...filtered].sort((a, b) =>
              b.timestamp.localeCompare(a.timestamp)
            ),
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
