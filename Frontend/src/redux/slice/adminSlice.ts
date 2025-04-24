import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
};

 const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    setAdminCredentials: (state) => {
      state.isAuthenticated = true;
    },
    adminLogout: (state) => {
      state.isAuthenticated = false;
    },
  },
});

export const { setAdminCredentials, adminLogout } = adminSlice.actions;
export default adminSlice.reducer;
