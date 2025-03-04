import { userLogout } from "@/redux/slice/userSlice";
import { store } from "@/redux/store";
import axios from "axios";

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

const refreshAccessToken = async (
  role: string
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

axiosInstance.interceptors.request.use(async (config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const role = originalRequest.url.includes("/admin") ? "admin" : "user";
        const newToken = await refreshAccessToken(role);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        updateToken("");
        store.dispatch(userLogout());
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

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
