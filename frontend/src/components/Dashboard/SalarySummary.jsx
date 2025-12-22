import React, { useEffect, useState, useCallback } from "react";
import { getMonthlyReport } from "../../services/salaryService";

export default function SalarySummary() {
  const [report, setReport] = useState([]);
  const [month] = useState(new Date().toISOString().slice(0, 7));

  const fetchReport = useCallback(async () => {
    try {
      const { data } = await getMonthlyReport(month);
      if (data?.success && Array.isArray(data.data)) {
        setReport(data.data);
      } else {
        setReport([]);
      }
    } catch (err) {
      console.error("Error fetching salary report:", err);
    }
  }, [month]);

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);
  const td = {
  padding: "10px",
  fontSize: "13px",
  color: "#374151",
  border: "1px solid #e5e7eb",
  whiteSpace: "nowrap",
};


return (
  <div
    className="salary-summary-wrapper"
    style={{
      width: "100%",
      overflowX: "auto",
      backgroundColor: "#ffffff",
      borderRadius: "16px",
      boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
      padding: "16px",
    }}
  >
    <h2
      style={{
        fontSize: "18px",
        fontWeight: 600,
        marginBottom: "12px",
        color: "#1f2937",
      }}
    >
      Salary Report for {month}
    </h2>

    <table
      style={{
        width: "100%",
        minWidth: "800px", // IMPORTANT for mobile scroll
        borderCollapse: "collapse",
      }}
    >
      <thead style={{ backgroundColor: "#f9fafb" }}>
        <tr>
          {[
            "Employee Name",
            "Email",
            "Department",
            "Base Salary",
            "Predicted Salary",
            "Net Salary",
          ].map((head) => (
            <th
              key={head}
              style={{
                padding: "10px",
                fontSize: "12px",
                fontWeight: 700,
                textTransform: "uppercase",
                color: "#6b7280",
                border: "1px solid #e5e7eb",
                textAlign: "left",
                whiteSpace: "nowrap",
              }}
            >
              {head}
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        {report.length ? (
          report.map((row) => (
            <tr key={row._id}>
              <td style={td}>{row.employeeName || "-"}</td>
              <td style={td}>{row.employeeEmail || "-"}</td>
              <td style={td}>{row.department || "-"}</td>
              <td style={td}>{row.baseSalary}</td>
              <td style={td}>{row.predictedSalary}</td>
              <td style={td}>{row.netSalary}</td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="6" style={{ ...td, textAlign: "center" }}>
              No salary data available for {month}.
            </td>
          </tr>
        )}
      </tbody>
    </table>

    {/* Mobile tweaks */}
    <style>{`
      @media (max-width: 640px) {
        .salary-summary-wrapper {
          padding: 10px;
        }
      }
    `}</style>
  </div>
);

}
