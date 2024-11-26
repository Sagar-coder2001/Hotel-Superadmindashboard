import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoggedIn: localStorage.getItem('isLoggedIn') ? true : false,
};

export const Superslice = createSlice({
  name: "loggedin",
  initialState, // Corrected spelling
  reducers: {
    userlogin: (state , action) => {
      state.isLoggedIn = true; // Consistent casing
    }
  },
});

export const { userlogin, logout } = Superslice.actions;
export default Superslice.reducer;