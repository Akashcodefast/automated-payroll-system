import React, { useEffect, useState, useCallback } from "react";
import { getMonthlyReport } from "../../services/salaryService";

export default function SalarySummary() {
  const [report, setReport] = useState([]);
  // const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [month] = useState(new Date().toISOString().slice(0, 7));


  const fetchReport = useCallback(async () => {
    try {
      const { data } = await getMonthlyReport(month);
      if (data?.success) setReport(data.data);
    } catch (err) {
      console.error("Error fetching salary report:", err);
    }
  }, [month]);

  useEffect(() => {
    fetchReport(); // ✅ added fetchReport to deps
  }, [fetchReport]);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border">
        <thead>
          <tr>
            <th className="px-4 py-2 border">Employee</th>
            <th className="px-4 py-2 border">Department</th>
            <th className="px-4 py-2 border">Base Salary</th>
            <th className="px-4 py-2 border">Predicted Salary</th>
            <th className="px-4 py-2 border">Net Salary</th>
          </tr>
        </thead>
        <tbody>
          {report.length ? (
            report.map((row) => (
              <tr key={row._id}>
                <td className="px-4 py-2 border">{row.employee?.name}</td>
                <td className="px-4 py-2 border">{row.employee?.department}</td>
                <td className="px-4 py-2 border">{row.baseSalary}</td>
                <td className="px-4 py-2 border">{row.predictedSalary}</td>
                <td className="px-4 py-2 border">{row.netSalary}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="px-4 py-2 text-center border">
                No data for {month}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
