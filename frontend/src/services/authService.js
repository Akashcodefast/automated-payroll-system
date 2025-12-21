import axios from "axios";
const baseURL = process.env.REACT_APP_API_BASE || "http://127.0.0.1:8080";
const API = `${baseURL}/api/auth`;

console.log(API)
export const login = async (formData) => {
  const res = await axios.post(`${API}/login`, formData);
  return res.data; // { user, token }
};

// ✅ Add logout here
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
};
