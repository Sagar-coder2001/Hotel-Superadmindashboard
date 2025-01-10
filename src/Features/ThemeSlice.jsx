// src/Features/ThemeSlice.js
import { createSlice } from '@reduxjs/toolkit';

const storedTheme = localStorage.getItem('theme') || 'white';
const initialState = storedTheme === 'white' ? {
  value: 'white',
  navbar: '#cef4f4',
  textcolor: 'black',
  modal: 'whitesmoke',
  hover:'white'
} : {
  value: '#041C32',
  navbar: '#04293A',
  textcolor: 'white',
  modal:'#142f3b',
  hover:'#04293A'
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
      state.hover = 'white';
      localStorage.setItem('theme', 'white'); // Store in localStorage
    },
    dark: (state) => {
      state.value = '#041C32';
      state.navbar = '#04293A';
      state.textcolor = 'white';
      state.modal = '#0d242e';
      state.hover = '#04293A'
      localStorage.setItem('theme', 'dark'); // Store in localStorage
    },
  },
});

// Export actions
export const { white, dark } = ThemeSlice.actions;

export default ThemeSlice.reducer;
