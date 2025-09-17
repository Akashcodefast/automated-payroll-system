import api from "./api";

// Single endpoint for check-in/check-out
export const checkIn = (payload) => api.post("/api/attendance/mark", { ...payload, type: "in" });
export const checkOut = (payload) => api.post("/api/attendance/mark", { ...payload, type: "out" });

// Optional: fetch employee attendance by month (if implemented)
export const getMyAttendance = (month) => api.get(`/api/attendance/me?month=${month}`);
