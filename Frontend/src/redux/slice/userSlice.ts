import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.isAuthenticated = true;
    },
    userLogout: (state) => {
      state.isAuthenticated = false;
    },
  },
});

export const { setCredentials, userLogout } = userSlice.actions;
export default userSlice.reducer;
