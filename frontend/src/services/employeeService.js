import api from "./api";

// CRUD operations for employees
export const getEmployees = () => api.get("/api/employee");
export const createEmployee = (payload) => api.post("/api/employee", payload);
export const updateEmployee = (id, payload) => api.put(`/api/employee/${id}`, payload);
export const deleteEmployee = (id) => api.delete(`/api/employee/${id}`);
