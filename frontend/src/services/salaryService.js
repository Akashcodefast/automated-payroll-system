import api from "./api";

// Predict salary for employee
export const predictForEmployee = (payload) =>
  api.post("/api/salary/predict", payload);

// Get salary of an employee (latest or all, no month filter)
export const getSalary = (employeeId) =>
  api.get(`/api/salary/${employeeId}`);

// Get salary report (all months or latest, depending on backend implementation)
export const getMonthlyReport = () =>
  api.get("/api/salary/report");
