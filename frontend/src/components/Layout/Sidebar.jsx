import { Link } from "react-router-dom";

export default function Sidebar({ role }) {
  return (
    <div style={{ width: 220, borderRight: "1px solid #eee", padding: 12 }}>
      {role === "admin" ? (
        <>
          <div style={{ marginBottom: 8 }}><Link to="/admin">Dashboard</Link></div>
          <div style={{ marginBottom: 8 }}><Link to="/reports">Reports</Link></div>
        </>
      ) : (
        <>
          <div style={{ marginBottom: 8 }}><Link to="/employee">My Attendance</Link></div>
        </>
      )}
    </div>
  );
}
