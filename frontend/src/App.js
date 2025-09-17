import { Routes, Route, Navigate } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import AdminDashboard from "./pages/AdminDashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import ProtectedRoute from "./routes/ProtectedRoute";
import Reports from "./pages/Reports";
import  "./output.css"

export default function App() {
  return (
    <Routes>
      <Route path="/auth" element={<AuthPage />} />

      <Route
        path="/employee"
        element={
          <ProtectedRoute allowed={["employee"]}>
            <EmployeeDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowed={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
       <Route
  path="/reports"
  element={
    <ProtectedRoute allowed={["admin"]}>
      <Reports />
    </ProtectedRoute>
  }
/>
      {/* Redirect all other paths */}
      <Route path="*" element={<Navigate to="/auth" replace />} />
    </Routes>
  );
}
