import axios from "axios";

// ✅ CRA ENV (THIS IS CORRECT FOR YOU)
const baseURL =
  process.env.REACT_APP_API_BASE || "http://localhost:8080";

const API = `${baseURL}/api/auth`;
console.log("API BASE:", process.env.REACT_APP_API_BASE);
console.log("Auth API:", API);

export const login = async (formData) => {
  const res = await axios.post(`${API}/login`, formData, {
    timeout: 15000,
  });
  return res.data;
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
};
