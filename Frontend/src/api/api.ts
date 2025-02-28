import axios from "axios";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const axiosInstancePublic = axios.create({
  baseURL: BASE_URL,
});

export const useAxiosWithAuth = () => {
  const navigate = useNavigate();
  const accessToken = useRef<string>("");
  const isRefreshing = useRef(false);
  const refreshSubscribers = useRef<((token: string) => void)[]>([]);

  const updateToken = (newToken: string) => {
    accessToken.current = newToken;
  };

  const refreshAccessToken = async (): Promise<string> => {
    if (isRefreshing.current) {
      return new Promise((resolve) => {
        refreshSubscribers.current.push((token) => resolve(token));
      });
    }

    isRefreshing.current = true;

    try {
      const { data } = await axios.get(
        `${BASE_URL}/auth/refresh-token?role=user`,
        {
          withCredentials: true,
        }
      );

      const newToken = data.accessToken;
      updateToken(newToken);

      refreshSubscribers.current.forEach((cb) => cb(newToken));
      refreshSubscribers.current = [];

      return newToken;
    } catch (error) {
      accessToken.current = "";
      navigate("/auth/login");
      throw error;
    } finally {
      isRefreshing.current = false;
    }
  };

  const axiosInstance = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
  });

  axiosInstance.interceptors.request.use((config) => {
    if (accessToken.current) {
      config.headers.Authorization = `Bearer ${accessToken.current}`;
    }
    return config;
  });

  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        try {
          originalRequest._retry = true;
          const newToken = await refreshAccessToken();
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          return Promise.reject(refreshError);
        }
      }
      return Promise.reject(error);
    }
  );

  useEffect(() => {
    if (accessToken.current) {
      refreshAccessToken();
    }
  }, []);

  return { axiosInstance, updateToken };
};
