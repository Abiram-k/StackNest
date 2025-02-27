import axios from "axios";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
let memoryToken = "";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const axiosInstancePublic = axios.create({
  baseURL: BASE_URL,
});

export const useAxiosWithAuth = () => {
  const accessTokenRef = useRef<string>(memoryToken);
  const navigate = useNavigate();

  const updateToken = (newToken: string) => {
    memoryToken = newToken;
    accessTokenRef.current = newToken;
  };

  let isRefreshing = false;
  let refreshSubscribers: ((token: string) => void)[] = [];

  const axiosInstance = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
  });

  const refreshAccessToken = async () => {
    if (isRefreshing) {
      return new Promise((resolve) => refreshSubscribers.push(resolve));
    }

    isRefreshing = true;
    try {
      const response = await axios.get(`${BASE_URL}/users/auth/refresh-token`, {
        withCredentials: true,
      });
      const newAccessToken = response.data.accessToken;
      console.log(newAccessToken, "from intercepter");
      accessTokenRef.current = newAccessToken;

      refreshSubscribers.forEach((callback) => callback(newAccessToken));
      refreshSubscribers = [];

      return newAccessToken;
    } catch (error) {
      console.error("Error refreshing access token:", error);
      navigate("/user/auth/login");
      return null;
    } finally {
      isRefreshing = false;
    }
  };

  axiosInstance.interceptors.request.use(
    (config) => {
      if (accessTokenRef.current) {
        config.headers.Authorization = `Bearer ${accessTokenRef.current}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  axiosInstance.interceptors.response.use(
    (response) => response,

    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        const newAccessToken = await refreshAccessToken();

        if (newAccessToken) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return axiosInstance(originalRequest); // retrying again by generating new refresh token
        }
      }

      return Promise.reject(error);
    }
  );

  useEffect(() => {
    console.log(memoryToken)
    if (memoryToken) {
      refreshAccessToken();
    }
  }, []);

  return { axiosInstance, updateToken };
};
