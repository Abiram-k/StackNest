import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
};

 const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.isAuthenticated = false;
    },
  },
});

export const { setCredentials, logout } = adminSlice.actions;
export default adminSlice.reducer;
