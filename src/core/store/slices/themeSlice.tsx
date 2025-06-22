import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ThemeState {
  isDarkMode: boolean;
}

const initialState: ThemeState = {
  isDarkMode: false,
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setDarkMode: (state, action: PayloadAction<boolean>) => {
      state.isDarkMode = action.payload;
      AsyncStorage.setItem('isDarkMode', JSON.stringify(action.payload));
    },
    toggleTheme: (state) => {
      const newVal = !state.isDarkMode;
      state.isDarkMode = newVal;
      AsyncStorage.setItem('isDarkMode', JSON.stringify(newVal));
    },
  },
});

export const { setDarkMode, toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;
