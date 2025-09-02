import { useNavigate } from "react-router-dom";
import { logout } from "../../services/authService";

export default function Navbar() {
  const nav = useNavigate();
  const doLogout = () => {
    logout();
    nav("/login", { replace: true });
  };
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: 12, background: "#222", color: "#fff" }}>
      <div>Automated Payroll</div>
      <button onClick={doLogout} style={{ background: "#444", color: "#fff", border: 0, padding: "6px 12px" }}>Logout</button>
    </div>
  );
}
