import api from "./api";

// Predict salary for an employee via Node.js backend
export const predictForEmployee = (payload) =>
  api.post("/api/salary/predict", {
    baseSalary: payload.baseSalary || 0,
    hoursWorked: payload.hoursWorked || 160,
    leavesTaken: payload.leavesTaken || 0,
    experienceYears: payload.experienceYears || 1,
  });


// Get monthly salary report
export const getMonthlyReport = (month) =>
  api.get("/api/salary/report", {
    params: { month: month || new Date().toISOString().slice(0, 7) },
  });

// Get employee details by email
export const getEmployee = (email) =>
  api.get(`/api/employee/email/${encodeURIComponent(email)}`);
