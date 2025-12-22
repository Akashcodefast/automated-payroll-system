import React, { useEffect, useState } from "react";
import { getEmployees, deleteEmployee } from "../../services/employeeService";

export default function EmployeeTable() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEmployees = async () => {
    try {
      const res = await getEmployees();
      setEmployees(res.data?.data || []);
    } catch (e) {
      console.error("Error fetching employees:", e);
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this employee?"
    );
    if (!confirmDelete) return;

    try {
      await deleteEmployee(id);
      setEmployees((prev) => prev.filter((emp) => emp._id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete employee");
    }
  };

  if (loading)
    return (
      <p className="text-gray-500 text-center py-6 text-lg">
        Loading employees...
      </p>
    );

  if (!employees.length)
    return (
      <p className="text-gray-500 text-center py-6 text-lg">
        No employees found.
      </p>
    );
     const cell = {
    padding: "10px",
    fontSize: "13px",
    color: "#374151",
  };

 return (
  <div
    style={{
      width: "100%",
      overflowX: "auto",
      backgroundColor: "#ffffff",
      borderRadius: "16px",
      boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
      padding: "16px",
    }}
    className="employee-table-wrapper"
  >
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "12px",
      }}
    >
      <h2
        style={{
          fontSize: "18px",
          fontWeight: 600,
          color: "#1f2937",
        }}
      >
        👥 Employees ({employees.length})
      </h2>
    </div>

    <table
      style={{
        width: "100%",
        minWidth: "720px", // KEY for mobile scroll
        borderCollapse: "collapse",
      }}
    >
      <thead style={{ backgroundColor: "#f9fafb" }}>
        <tr>
          {["#", "Name", "Role", "Department", "Salary", "Actions"].map(
            (h) => (
              <th
                key={h}
                style={{
                  padding: "10px",
                  fontSize: "12px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  color: "#6b7280",
                  textAlign: h === "Actions" ? "center" : "left",
                  borderBottom: "1px solid #e5e7eb",
                }}
              >
                {h}
              </th>
            )
          )}
        </tr>
      </thead>

      <tbody>
        {employees.map((e, idx) => (
          <tr
            key={e._id}
            style={{
              borderBottom: "1px solid #f1f5f9",
            }}
          >
            <td style={cell}>{idx + 1}</td>
            <td style={{ ...cell, fontWeight: 600 }}>{e.name || "N/A"}</td>
            <td style={cell}>
              <span
                style={{
                  padding: "4px 8px",
                  fontSize: "11px",
                  fontWeight: 600,
                  borderRadius: "999px",
                  backgroundColor:
                    e.role === "admin"
                      ? "#fee2e2"
                      : e.role === "hr"
                      ? "#dbeafe"
                      : "#dcfce7",
                  color:
                    e.role === "admin"
                      ? "#991b1b"
                      : e.role === "hr"
                      ? "#1e40af"
                      : "#166534",
                }}
              >
                {e.role}
              </span>
            </td>
            <td style={cell}>{e.department || "N/A"}</td>
            <td style={{ ...cell, fontWeight: 600 }}>
              ₹{e.baseSalary ?? "N/A"}
            </td>
            <td style={{ ...cell, textAlign: "center" }}>
              <button
                onClick={() => handleDelete(e._id)}
                style={{
                  backgroundColor: "#dc2626",
                  color: "#fff",
                  padding: "6px 10px",
                  fontSize: "12px",
                  borderRadius: "8px",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>

    {/* Responsive tweaks */}
    <style>{`
      @media (max-width: 640px) {
        .employee-table-wrapper {
          padding: 10px;
        }
      }
    `}</style>
  </div>
);

}