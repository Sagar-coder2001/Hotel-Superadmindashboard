// src/store.js
import { configureStore } from '@reduxjs/toolkit';
import Superslice from '../Features/Superslice';

export const store = configureStore({
  reducer: {
    loggedin: Superslice
  },
});
