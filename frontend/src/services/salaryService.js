import api from "./api";

// =====================
// Fetch employee by email
// =====================
export const getEmployee = (email) =>
  api.get(`/api/employee/email/${encodeURIComponent(email)}`);

// =====================
// Predict salary for an employee
// =====================
export const predictForEmployee = async (payload) => {
  return api.post("/api/salary/predict", {
    email: payload.email,
    baseSalary: payload.baseSalary ?? 0,
    hoursWorked: payload.hoursWorked ?? 160,
    leavesTaken: payload.leavesTaken ?? 0,
    experienceYears: payload.experienceYears ?? 1,
    month: payload.month
  });
};


// =====================
// Get monthly salary report
// =====================
export const getMonthlyReport = (month) =>
  api.get("/api/salary/report", {
    params: { month: month ?? new Date().toISOString().slice(0, 7) },
  });
