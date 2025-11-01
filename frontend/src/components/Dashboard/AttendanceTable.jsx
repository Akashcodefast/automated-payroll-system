export default function AttendanceTable({ logs = [] }) {
  if (!Array.isArray(logs)) logs = logs ? [logs] : [];

  const sortedLogs = [...logs].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );
  const latest = sortedLogs[0];

  if (!latest) {
    return (
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2 text-gray-800">Recent Attendance</h3>
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="min-w-full border border-gray-300 text-sm text-center">
            <tbody>
              <tr>
                <td colSpan="5" className="py-4 text-gray-500">
                  No attendance records found.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  const checkInTime =
    latest.checkIn?.time || latest.checkInTime || latest.checkIn || null;
  const checkOutTime =
    latest.checkOut?.time || latest.checkOutTime || latest.checkOut || null;
  const totalHours =
    latest.totalHours ||
    latest.totalhours ||
    latest.hoursWorked ||
    latest.hoursworked ||
    null;

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-3 text-gray-800">Recent Attendance</h3>
      <div className="overflow-x-auto rounded-lg shadow-md">
        <table className="min-w-full border border-gray-300 text-sm text-center">
          <thead className="bg-gray-100 border-b border-gray-300">
            <tr>
              <th className="py-3 px-4 font-semibold text-gray-700 border-r border-gray-300">Date</th>
              <th className="py-3 px-4 font-semibold text-gray-700 border-r border-gray-300">Check-In</th>
              <th className="py-3 px-4 font-semibold text-gray-700 border-r border-gray-300">Check-Out</th>
              <th className="py-3 px-4 font-semibold text-gray-700 border-r border-gray-300">Total Hours</th>
              <th className="py-3 px-4 font-semibold text-gray-700">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr className="hover:bg-gray-50 transition-colors">
              <td className="py-3 px-4 border-t border-gray-300">
                {latest.date ? new Date(latest.date).toLocaleDateString() : "-"}
              </td>
              <td className="py-3 px-4 border-t border-gray-300">
                {checkInTime ? new Date(checkInTime).toLocaleTimeString() : "-"}
              </td>
              <td className="py-3 px-4 border-t border-gray-300">
                {checkOutTime ? new Date(checkOutTime).toLocaleTimeString() : "-"}
              </td>
              <td className="py-3 px-4 border-t border-gray-300">
                {totalHours ? Number(totalHours).toFixed(2) : "-"}
              </td>
              <td
                className={`py-3 px-4 border-t border-gray-300 font-medium ${
                  checkInTime && checkOutTime
                    ? "text-green-600"
                    : checkInTime
                    ? "text-yellow-600"
                    : "text-red-600"
                }`}
              >
                {checkInTime && checkOutTime
                  ? "Completed"
                  : checkInTime
                  ? "Checked In"
                  : "Absent"}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
