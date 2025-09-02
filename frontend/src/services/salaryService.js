import api from "./api";

export const predictForEmployee = (payload) => api.post("/api/salary/predict", payload);
export const getSalary = (employeeId, month) =>
  api.get(`/api/salary/${employeeId}?month=${month}`);
export const getMonthlyReport = (month) =>
  api.get(`/api/salary/report?month=${month}`);
