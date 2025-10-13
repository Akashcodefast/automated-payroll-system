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
  try {
    if (!payload.email) throw new Error("Employee email is required for prediction");

    return api.post("/api/salary/predict", {
      baseSalary: payload.baseSalary ?? 0,
      hoursWorked: payload.hoursWorked ?? 160,
      leavesTaken: payload.leavesTaken ?? 0,
      experienceYears: payload.experienceYears ?? 1,
    });
  } catch (err) {
    console.error("Error predicting salary:", err);
    throw err;
  }
};

// =====================
// Get monthly salary report
// =====================
export const getMonthlyReport = (month) =>
  api.get("/api/salary/report", {
    params: { month: month ?? new Date().toISOString().slice(0, 7) },
  });
