import Navbar from "../components/Layout/Navbar";
import Sidebar from "../components/Layout/Sidebar";
import AttendanceCapture from "../components/Attendance/AttendanceCapture";
import AttendanceTable from "../components/Dashboard/AttendanceTable";
import { useEffect, useState } from "react";
import { getMyAttendance } from "../services/attendanceService";

function getCurrentMonth() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export default function EmployeeDashboard() {
  const [logs, setLogs] = useState([]);
  useEffect(() => {
    (async () => {
      try {
        const { data } = await getMyAttendance(getCurrentMonth());
        setLogs(data?.items || []);
      } catch (e) {
        setLogs([]);
      }
    })();
  }, []);
  const role = localStorage.getItem("role") || "employee";

  return (
    <div>
      <Navbar />
      <div style={{ display: "flex" }}>
        <Sidebar role={role} />
        <div style={{ padding: 16, width: "100%" }}>
          <h2>Mark Attendance</h2>
          <AttendanceCapture />
          <h3 style={{ marginTop: 16 }}>My Recent Logs</h3>
          <AttendanceTable logs={logs} />
        </div>
      </div>
    </div>
  );
}
