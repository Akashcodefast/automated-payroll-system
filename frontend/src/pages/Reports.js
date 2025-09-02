import Navbar from "../components/Layout/Navbar";
import Sidebar from "../components/Layout/Sidebar";
import SalarySummary from "../components/Dashboard/SalarySummary";
import { useEffect, useState } from "react";
import { getMonthlyReport } from "../services/salaryService";

export default function Reports() {
  const [month, setMonth] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  });
  const [rows, setRows] = useState([]);
  const role = localStorage.getItem("role") || "admin";

  useEffect(() => {
    (async () => {
      try {
        const { data } = await getMonthlyReport(month);
        setRows(data?.items || data || []);
      } catch (e) {
        setRows([]);
      }
    })();
  }, [month]);

  const exportCSV = () => {
    const header = "Employee,TotalHours,Leaves,BaseSalary,PredictedSalary\n";
    const body = rows
      .map((r) => [r.employeeName, r.totalHours, r.leaves, r.baseSalary, r.predictedSalary].join(","))
      .join("\n");
    const blob = new Blob([header + body], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `salary_report_${month}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <Navbar />
      <div style={{ display: "flex" }}>
        <Sidebar role={role} />
        <div style={{ padding: 16, width: "100%" }}>
          <h2>Reports</h2>
          <div style={{ marginBottom: 8 }}>
            <label>Month: </label>
            <input value={month} onChange={(e) => setMonth(e.target.value)} placeholder="YYYY-MM" />
            <button onClick={exportCSV} style={{ marginLeft: 8 }}>Export CSV</button>
          </div>
          <SalarySummary rows={rows} />
        </div>
      </div>
    </div>
  );
}
