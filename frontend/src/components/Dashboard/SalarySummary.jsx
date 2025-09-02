export default function SalarySummary({ rows = [] }) {
  return (
    <table width="100%" border="1" cellPadding="6" style={{ borderCollapse: "collapse" }}>
      <thead>
        <tr>
          <th>Employee</th>
          <th>Total Hours</th>
          <th>Leaves</th>
          <th>Base Salary</th>
          <th>Predicted Salary</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r, idx) => (
          <tr key={idx}>
            <td>{r.employeeName}</td>
            <td>{r.totalHours}</td>
            <td>{r.leaves}</td>
            <td>{r.baseSalary}</td>
            <td>{r.predictedSalary}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
