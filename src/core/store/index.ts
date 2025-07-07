import { configureStore } from '@reduxjs/toolkit'; // Importa la función principal para configurar el store de Redux Toolkit
import themeReducer from './slices/themeSlice'; // Importa el reducer del slice de tema (modo claro/oscuro)
export * from './slices/historySlice';


// Crea y exporta el store de Redux, registrando el slice de 'theme'
export const store = configureStore({
  reducer: {
    theme: themeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>; // Define y exporta el tipo RootState, que representa el estado completo de la app
export type AppDispatch = typeof store.dispatch; // Define y exporta el tipo AppDispatch, útil para usar dispatch con tipado fuerte

