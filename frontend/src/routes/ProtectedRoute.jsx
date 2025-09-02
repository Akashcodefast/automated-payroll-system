import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, allowed = [] }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // If no token → redirect to login
  if (!token) return <Navigate to="/login" replace />;

  // If route has restrictions & role is not allowed → redirect
  if (allowed.length > 0 && !allowed.includes(role)) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

