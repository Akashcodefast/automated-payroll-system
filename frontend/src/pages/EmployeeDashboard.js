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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await getMyAttendance(getCurrentMonth());
        setLogs(data?.items || []);
      } catch (e) {
        setLogs([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const role = localStorage.getItem("role") || "employee";

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar role={role} />
        <main className="flex-1 p-8 space-y-8">
          {/* Attendance Capture Card */}
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
            <h1 className="text-2xl font-bold text-blue-700 mb-4">📝 Mark Attendance</h1>
            <AttendanceCapture />
          </div>

          {/* Recent Attendance Logs */}
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">📋 My Recent Logs</h2>
            {loading ? (
              <p className="text-gray-500 text-center py-6">Loading attendance...</p>
            ) : logs.length === 0 ? (
              <p className="text-gray-500 text-center py-6">No attendance logs found.</p>
            ) : (
              <div className="overflow-x-auto">
                <AttendanceTable logs={logs} />
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
