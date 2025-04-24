import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
  isNotificationAllowed:false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserCredentials: (state) => {
      state.isAuthenticated = true;
    },
    
    userLogout: (state) => {
      state.isAuthenticated = false;
    },
  },
});

export const { setUserCredentials, userLogout } = userSlice.actions;
export default userSlice.reducer;
