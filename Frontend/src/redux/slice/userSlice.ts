import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserCredentials: (state, action) => {
      state.isAuthenticated = true;
    },
    userLogout: (state) => {
      state.isAuthenticated = false;
    },
  },
});

export const { setUserCredentials, userLogout } = userSlice.actions;
export default userSlice.reducer;
