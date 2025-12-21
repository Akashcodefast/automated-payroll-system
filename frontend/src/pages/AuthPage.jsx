import { useNavigate } from "react-router-dom";

export default function AuthPage() {
  const navigate = useNavigate();

  return (
    <div style={styles.page}>
      
      {/* Navbar */}
      <nav style={styles.navbar}>
        <h1 style={styles.navTitle}>Automated Payroll System</h1>
      </nav>

      {/* Main Content */}
      <main style={styles.main}>
        <h2 style={styles.heading}>
          Welcome to Automated Payroll System
        </h2>

        <div style={styles.buttonContainer}>
          <button
            style={styles.button}
            onClick={() => navigate("/auth/employee")}
          >
            Employee Login
          </button>

          <button
            style={styles.button}
            onClick={() => navigate("/auth/admin")}
          >
            Admin Login
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer style={styles.footer}>
        © {new Date().getFullYear()} Automated Payroll System. All rights reserved.
      </footer>
    </div>
  );
}

/* ================= STYLES ================= */

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    background: "linear-gradient(135deg, #e0f2fe, #ffffff, #dbeafe)",
    fontFamily: "Arial, sans-serif",
  },

  navbar: {
    position: "fixed",
    top: 0,
    width: "100%",
    backgroundColor: "#111827",
    color: "#ffffff",
    padding: "16px",
    textAlign: "center",
    boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
    zIndex: 1000,
  },

  navTitle: {
    margin: 0,
    fontSize: "22px",
    fontWeight: "600",
    letterSpacing: "1px",
  },

  main: {
    flexGrow: 1,
    marginTop: "100px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    textAlign: "center",
  },

  heading: {
    fontSize: "32px",
    color: "#1d4ed8",
    marginBottom: "40px",
  },

  buttonContainer: {
    display: "flex",
    gap: "40px",
    flexWrap: "wrap",
    justifyContent: "center",
  },

  button: {
    padding: "14px 28px",
    backgroundColor: "#2563eb",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
  },

  footer: {
    padding: "14px",
    textAlign: "center",
    fontSize: "14px",
    color: "#6b7280",
    borderTop: "1px solid #e5e7eb",
    backgroundColor: "#ffffff",
  },
};
