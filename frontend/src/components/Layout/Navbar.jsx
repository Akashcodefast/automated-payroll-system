// src/components/Layout/Navbar.jsx
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <nav
      style={{
        width: "100%",
        backgroundColor: "#ffffff",
        padding: "14px 16px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 1000,
      }}
    >
      <h1
        style={{
          fontSize: "18px",
          fontWeight: 600,
          color: "#1f2937",
        }}
      >
        Automated Payroll System
      </h1>

      <button
        onClick={handleLogout}
        style={{
          backgroundColor: "#dc2626",
          color: "#ffffff",
          padding: "10px 16px",
          borderRadius: "10px",
          border: "none",
          fontSize: "14px",
          fontWeight: 600,
          cursor: "pointer",
          boxShadow: "0 4px 6px rgba(0,0,0,0.2)",
          transition: "background-color 0.2s ease",
        }}
        onMouseOver={(e) =>
          (e.target.style.backgroundColor = "#b91c1c")
        }
        onMouseOut={(e) =>
          (e.target.style.backgroundColor = "#dc2626")
        }
      >
        Logout
      </button>
    </nav>
  );
}
