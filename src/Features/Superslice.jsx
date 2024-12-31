import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoggedIn: localStorage.getItem('isLoggedIn') ? true : false,
  token: localStorage.getItem('token') || null,  // Track the token
  username: localStorage.getItem('username') || null,  // Track the username
  password: localStorage.getItem('password') || null,
};

export const Superslice = createSlice({
  name: "loggedin",
  initialState,
  reducers: {
    userlogin: (state, action) => {
      state.isLoggedIn = true;
      state.token = action.payload.token;  // Set token from action payload
      state.username = action.payload.username;  // Set username from action payload
      state.password = action.payload.password;  // Set username from action payload


      // Save to localStorage
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('username', action.payload.username);
      localStorage.setItem('password', action.payload.password);

    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.token = null;
      state.username = null;

      // Remove from localStorage
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('token');
      localStorage.removeItem('username');
    }
  },
});

export const { userlogin, logout } = Superslice.actions;
export default Superslice.reducer;
