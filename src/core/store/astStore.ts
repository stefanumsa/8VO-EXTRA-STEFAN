import { create } from 'zustand';
import type { Node } from 'regexpp/ast';

interface ASTEntry {
  regex: string;
  ast: Node;
}

interface ASTStore {
  astList: ASTEntry[];
  addAST: (entry: ASTEntry) => void;
  clearASTs: () => void;
}

export const useASTStore = create<ASTStore>((set) => ({
  astList: [],
  addAST: (entry) =>
    set((state) => ({
      astList: [entry, ...state.astList],
    })),
  clearASTs: () => set({ astList: [] }),
}));
