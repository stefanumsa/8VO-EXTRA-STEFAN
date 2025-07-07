import { create } from 'zustand';

type ASTItem = {
  regex: string;
  ast: any;
};

type ASTState = {
  astList: ASTItem[];
  astHistory: ASTItem[];
  addAST: (item: ASTItem) => void;
  removeAST: (regex: string) => void; 
  clearASTHistory: () => void;
};

export const useASTStore = create<ASTState>((set, get) => ({
  astList: [],
  astHistory: [],

  addAST: (item) => {
    const currentHistory = get().astHistory;
    const alreadyExists = currentHistory.some((ast) => ast.regex === item.regex);

    if (!alreadyExists) {
      set({
        astHistory: [...currentHistory, item],
        astList: [...get().astList, item],
      });
    }
  },

  //  Función para eliminar un solo AST por regex
  removeAST: (regex) => {
    const newHistory = get().astHistory.filter((entry) => entry.regex !== regex);
    const newList = get().astList.filter((entry) => entry.regex !== regex);
    set({ astHistory: newHistory, astList: newList });
  },

  clearASTHistory: () => set({ astHistory: [], astList: [] }),
}));
