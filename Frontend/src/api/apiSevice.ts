import { tokenManager } from "@/lib/tokenManager";
import { adminLogout } from "@/redux/slice/adminSlice";
import { userLogout } from "@/redux/slice/userSlice";
import { store } from "@/redux/store";
import axios from "axios";
import toast from "react-hot-toast";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const axiosInstancePublic = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

let accessToken = "";
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const updateToken = (newToken: string) => {
  accessToken = newToken;
};

export const refreshAccessToken = async (
  role: "user" | "admin"
): Promise<string | undefined> => {
  if (isRefreshing) {
    return new Promise((resolve) => {
      refreshSubscribers.push((token) => resolve(token));
    });
  }
  isRefreshing = true;
  try {
    const { data } = await axios.get(
      `${BASE_URL}/auth/refresh-token?role=${role}`,
      {
        withCredentials: true,
      }
    );
    updateToken(data.accessToken);
    tokenManager.updateToken(data.accessToken, role);
    refreshSubscribers.forEach((cb) => cb(data.accessToken));
    refreshSubscribers = [];
    return data.accessToken;
  } catch (error) {
    updateToken("");
    throw error;
  } finally {
    isRefreshing = false;
  }
};

axiosInstance.interceptors.request.use( (config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status == 403 &&
      error.response?.data?.message?.includes("blocked")
    ) {
      toast.error("You account is Suspended!");
      store.dispatch(userLogout());
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      let currentRole;
      try {
        const role = originalRequest.url.includes("admin") ? "admin" : "user";
        currentRole = role;
        const newToken = await refreshAccessToken(role);
        tokenManager.updateToken(newToken, role);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        updateToken("");
        if (currentRole == "user") store.dispatch(userLogout());
        else store.dispatch(adminLogout());
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);


