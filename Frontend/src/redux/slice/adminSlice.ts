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
    adminLogout: (state) => {
      state.isAuthenticated = false;
    },
  },
});

export const { setCredentials, adminLogout } = adminSlice.actions;
export default adminSlice.reducer;
