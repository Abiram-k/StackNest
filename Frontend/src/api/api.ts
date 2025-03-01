import axios from "axios";
import { useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const axiosInstancePublic = axios.create({
  baseURL: BASE_URL,
  withCredentials:true
});

// Create a single axios instance
export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// Utility to manage auth state
let accessToken = "";
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const updateToken = (newToken: string) => {
  accessToken = newToken;
};

// Separate function to handle token refresh
const refreshAccessToken = async (): Promise<string | undefined> => {
  if (isRefreshing) {
    return new Promise((resolve) => {
      refreshSubscribers.push((token) => resolve(token));
    });
  }

  isRefreshing = true;

  try {
    const { data } = await axios.get(`${BASE_URL}/users/auth/refresh-token`, {
      withCredentials: true,
    });
    updateToken(data.accessToken);
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

// Request interceptor
axiosInstance.interceptors.request.use(async(config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const newToken = await refreshAccessToken();

        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        updateToken("");
        const navigate = useNavigate();
        navigate("/auth/login");
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

// Hook to initialize token check
// export const useAxiosWithAuth = () => {
//   const navigate = useNavigate();

//   useEffect(() => {
//     const initializeAuth = async () => {
//       try {
//         const token = await refreshAccessToken();
//         updateToken(token);
//       } catch (error) {
//         navigate("/auth/login");
//       }
//     };
//     initializeAuth();
//   }, [navigate]);

//   return { axiosInstance };
// };
