// src/Features/ThemeSlice.js
import { createSlice } from '@reduxjs/toolkit';

const storedTheme = localStorage.getItem('theme') || 'white';
const initialState = storedTheme === 'white' ? {
  value: 'white',
  navbar: '#cef4f4',
  textcolor: 'black',
  modal: 'whitesmoke'
} : {
  value: '#0E1027',
  navbar: 'black',
  textcolor: 'white',
  modal:'#495057'
};

export const ThemeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    white: (state) => {
      state.value = 'white';
      state.navbar = '#cef4f4';
      state.textcolor = 'black';
      state.modal = 'whitesmoke';
      localStorage.setItem('theme', 'white'); // Store in localStorage
    },
    dark: (state) => {
      state.value = '#0E1027';
      state.navbar = 'black';
      state.textcolor = 'white';
      state.modal = '#495057';
      localStorage.setItem('theme', 'dark'); // Store in localStorage
    },
  },
});

// Export actions
export const { white, dark } = ThemeSlice.actions;

export default ThemeSlice.reducer;
