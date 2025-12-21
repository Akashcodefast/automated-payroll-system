// src/components/Layout/Navbar.jsx
import { useNavigate } from "react-router-dom";
import { logout } from "../../services/authService";

export default function Navbar() {
  const navigate = useNavigate(); 

    const handleLogout = () => {
    localStorage.clear();      // remove token, role, email
    navigate("/login");        // redirect to login page
  };

  return (
    <nav className="w-full bg-white text-black py-4 shadow-md">
  <div className="max-w-4xl mx-auto text-center">
    <h1 className="text-xl sm:text-2xl font-semibold tracking-wide">
      Automated Payroll System
    </h1>
  </div>
  <button
  onClick={handleLogout}
  style={{
    marginLeft: "1150px",
    backgroundColor: "#dc2626", // red
    color: "#ffffff",
    padding: "10px 18px",
    borderRadius: "8px",
    border: "none",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    boxShadow: "0 4px 6px rgba(0,0,0,0.2)"
  }}
  onMouseOver={(e) => (e.target.style.backgroundColor = "#b91c1c")}
  onMouseOut={(e) => (e.target.style.backgroundColor = "#dc2626")}
>
  Logout
</button>

</nav>

  );
}
