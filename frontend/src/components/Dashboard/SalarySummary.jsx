import React, { useEffect, useState } from "react";
import { getMonthlyReport } from "../../services/salaryService";

export default function SalarySummary() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await getMonthlyReport(); // fetch all salary reports
        console.log("Salary Report API response:", res.data);
        setRows(res.data?.items || []); // safely set rows
      } catch (e) {
        console.error("Error fetching salary report:", e);
        setRows([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <p>Loading salary report...</p>;
  if (!rows.length) return <p>No salary records found.</p>;

  return (
    <table
      width="100%"
      border="1"
      cellPadding="6"
      style={{ borderCollapse: "collapse" }}
    >
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
            <td>{r.employeeName || "N/A"}</td>
            <td>{r.totalHours ?? "N/A"}</td>
            <td>{r.leaves ?? "N/A"}</td>
            <td>{r.baseSalary ?? "N/A"}</td>
            <td>{r.predictedSalary ?? "N/A"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
