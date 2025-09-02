export default function AttendanceTable({ logs = [] }) {
  return (
    <table width="100%" border="1" cellPadding="6" style={{ borderCollapse: "collapse" }}>
      <thead>
        <tr>
          <th>Date</th>
          <th>Check-In</th>
          <th>Check-Out</th>
          <th>Hours</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {logs.map((r, i) => (
          <tr key={i}>
            <td>{r.date}</td>
            <td>{r.checkIn?.time || "-"}</td>
            <td>{r.checkOut?.time || "-"}</td>
            <td>{r.hoursWorked ?? "-"}</td>
            <td>{r.status ?? "ok"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
