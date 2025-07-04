import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Importa AsyncStorage para guardar datos localmente

// Define la forma del estado del tema
interface ThemeState {
  isDarkMode: boolean;
}

// Estado inicial: modo claro
const initialState: ThemeState = {
  isDarkMode: false,
};

// Crea un slice llamado "theme" para manejar el modo oscuro
const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setDarkMode: (state, action: PayloadAction<boolean>) => {
      state.isDarkMode = action.payload;     // Acción para establecer explícitamente el modo oscuro o claro
      AsyncStorage.setItem('isDarkMode', JSON.stringify(action.payload)); // Guarda la preferencia en AsyncStorage
    },
    toggleTheme: (state) => {
      const newVal = !state.isDarkMode;
      state.isDarkMode = newVal;     // Acción para alternar entre modo oscuro y claro
      AsyncStorage.setItem('isDarkMode', JSON.stringify(newVal));       // Guarda el nuevo valor en AsyncStorage
    },
  },
});


// Exporta las acciones generadas
export const { setDarkMode, toggleTheme } = themeSlice.actions;
export default themeSlice.reducer; // Exporta el reducer para integrarlo al store

