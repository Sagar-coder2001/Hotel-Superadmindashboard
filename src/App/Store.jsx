// src/store.js
import { configureStore } from '@reduxjs/toolkit';
import Superslice from '../Features/Superslice';
import ThemeSlice from '../Features/Themeslice';

export const store = configureStore({
  reducer: {
    loggedin: Superslice,
    theme: ThemeSlice
  },
});
