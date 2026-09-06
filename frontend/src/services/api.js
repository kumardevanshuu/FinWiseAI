import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
});

// 🔥 Automatically attach token to every request
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");

    if (token && token !== "undefined" && token !== "null") {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// 🔥 Global 401 handler
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error?.response?.status === 401) {
      console.warn("API 401 → Invalid or expired token");
    }

    return Promise.reject(error);
  }
);

export default API;
