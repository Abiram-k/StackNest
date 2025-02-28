import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import { persistConfig } from "./persistConfig";
import logger from "redux-logger";

import userReducer from "./slice/userSlice";
import adminReducer from "./slice/adminSlice";

const reducers = combineReducers({
  user: userReducer,
  admin:adminReducer
});

const persistedReducer = persistReducer(persistConfig, reducers);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(import.meta.env.APP_MODE !== "production" ? [logger] : []),
});
export type RootState = ReturnType<typeof store.getState>;
export const persistor = persistStore(store);
