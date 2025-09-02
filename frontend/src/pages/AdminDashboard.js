import Navbar from "../components/Layout/Navbar";
import Sidebar from "../components/Layout/Sidebar";
import EmployeeTable from "../components/Dashboard/EmployeeTable";
import SalarySummary from "../components/Dashboard/SalarySummary";
import PredictForm from "../components/Salary/PredictForm";
import { useEffect, useState } from "react";
import { getEmployees } from "../services/employeeService";
import { getMonthlyReport } from "../services/salaryService";

function getCurrentMonth() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export default function AdminDashboard() {
  const [employees, setEmployees] = useState([]);
  const [report, setReport] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const [{ data: eData }, { data: rData }] = await Promise.all([
          getEmployees(),
          getMonthlyReport(getCurrentMonth()),
        ]);
        setEmployees(eData?.items || eData || []);
        setReport(rData?.items || rData || []);
      } catch (e) {
        setEmployees([]);
        setReport([]);
      }
    })();
  }, []);

  const role = localStorage.getItem("role") || "admin";

  return (
    <div>
      <Navbar />
      <div style={{ display: "flex" }}>
        <Sidebar role={role} />
        <div style={{ padding: 16, width: "100%" }}>
          <h2>Admin Dashboard</h2>
          <h3>Employees</h3>
          <EmployeeTable items={employees} />
          <h3 style={{ marginTop: 16 }}>Monthly Salary Summary</h3>
          <SalarySummary rows={report} />
          <h3 style={{ marginTop: 16 }}>Predict Salary (Single Employee)</h3>
          <PredictForm />
        </div>
      </div>
    </div>
  );
}
