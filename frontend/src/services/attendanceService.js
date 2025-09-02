import api from "./api";

export const checkIn = (payload) => api.post("/api/attendance/check-in", payload);
export const checkOut = (payload) => api.post("/api/attendance/check-out", payload);
export const getMyAttendance = (month) => api.get(`/api/attendance/me?month=${month}`);
