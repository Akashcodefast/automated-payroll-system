import axios from "axios";

// Create axios instance with backend base URL
const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE || "https://automated-payroll-system.onrender.com",
});

// Add authorization token from localStorage to every request header if exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;


