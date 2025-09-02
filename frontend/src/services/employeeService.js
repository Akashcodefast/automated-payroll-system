import api from "./api";

export const getEmployees = () => api.get("/api/employees");
export const createEmployee = (payload) => api.post("/api/employees", payload);
export const updateEmployee = (id, payload) => api.put(`/api/employees/${id}`, payload);
export const deleteEmployee = (id) => api.delete(`/api/employees/${id}`);
    