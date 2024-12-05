// src/Features/ThemeSlice.js
import { createSlice } from '@reduxjs/toolkit';

// Get initial theme from localStorage or default to 'light'
const initialState = {
  theme: localStorage.getItem('theme') || 'light',
};

export const ThemeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', state.theme); // Store theme in localStorage
    },

    // Action to set a specific theme
    setTheme: (state, action) => {
      state.theme = action.payload;
      localStorage.setItem('theme', action.payload); // Store theme in localStorage
    },
  },
});

// Export actions
export const { toggleTheme, setTheme } = ThemeSlice.actions;

export default ThemeSlice.reducer;
