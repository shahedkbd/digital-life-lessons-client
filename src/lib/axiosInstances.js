import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://digital-life-lessons-server-alpha.vercel.app/api";

// Public axios instance (no auth required)
export const axiosPublic = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Secure axios instance (requires auth token)
export const axiosSecure = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
axiosSecure.interceptors.request.use(
  async (config) => {
    // Get Firebase auth token
    const auth = (await import("./firebase.config.js")).auth;
    const user = auth.currentUser;

    if (user) {
      const token = await user.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
axiosSecure.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      console.error("Unauthorized access - redirecting to login");
      // You can add redirect logic here if needed
    }
    return Promise.reject(error);
  }
);

export default axiosSecure;
