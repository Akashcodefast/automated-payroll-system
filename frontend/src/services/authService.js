import axios from "axios";

// ✅ Vite-safe env access
const baseURL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8080";
const API = `${baseURL}/api/auth`;

console.log("Auth API:", API);

export const login = async (formData) => {
  const res = await axios.post(`${API}/login`, formData, {
    timeout: 15000, // ✅ prevents mobile hanging forever
  });
  return res.data; // { user, token }
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
};
