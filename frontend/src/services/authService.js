import axios from "axios";

const API = "http://localhost:8080/api/auth";

export const login = async (formData) => {
  const res = await axios.post(`${API}/login`, formData);
  return res.data; // { user, token }
};

// ✅ Add logout here
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
};
