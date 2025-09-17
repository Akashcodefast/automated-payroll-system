import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ allowed, children }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role")?.toLowerCase(); // ensure lowercase

  if (!token) {
    return <Navigate to="/auth" replace />;
  }

  if (!allowed.includes(role)) {
    // Redirect to the correct dashboard based on role
    if (role === "admin") return <Navigate to="/admin" replace />;
    if (role === "employee") return <Navigate to="/employee" replace />;

    // fallback
    return <Navigate to="/auth" replace />;
  }

  return children;
}
