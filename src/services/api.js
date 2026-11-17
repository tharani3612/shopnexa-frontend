
import axios from "axios";

const API = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    "http://https://shopnexa-backend-wjk6.onrender.com/api",

  headers: {
    "Content-Type": "application/json",
  },
});

// Attach the correct token based on API route
API.interceptors.request.use(
  (config) => {
    const url = config.url || "";

    const isAdminRequest = url.startsWith("/admin");

    const token = isAdminRequest
      ? localStorage.getItem("adminToken")
      : sessionStorage.getItem("customerToken") ||
        localStorage.getItem("customerToken");

    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default API;
