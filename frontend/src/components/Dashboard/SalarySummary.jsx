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

  return (
    <div className="overflow-x-auto p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-3">
        Salary Report for {month}
      </h2>
      <table className="min-w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 border">Employee Name</th>
            <th className="px-4 py-2 border">Email</th>
            <th className="px-4 py-2 border">Department</th>
            <th className="px-4 py-2 border">Base Salary</th>
            <th className="px-4 py-2 border">Predicted Salary</th>
            <th className="px-4 py-2 border">Net Salary</th>
          </tr>
        </thead>
        <tbody>
          {report.length ? (
            report.map((row) => (
              <tr key={row._id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border">{row.employeeName || "-"}</td>
                <td className="px-4 py-2 border">{row.employeeEmail || "-"}</td>
                <td className="px-4 py-2 border">{row.department || "-"}</td>
                <td className="px-4 py-2 border">{row.baseSalary}</td>
                <td className="px-4 py-2 border">{row.predictedSalary}</td>
                <td className="px-4 py-2 border">{row.netSalary}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="px-4 py-2 text-center border">
                No salary data available for {month}.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
