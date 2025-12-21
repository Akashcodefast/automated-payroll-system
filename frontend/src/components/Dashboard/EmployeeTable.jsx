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

  return (
    <div className="overflow-x-auto bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">
          👥 Employees ({employees.length})
        </h2>
      </div>

      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">#</th>
            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Name</th>
            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Role</th>
            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Department</th>
            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Salary</th>
            <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>

        <tbody className="bg-white divide-y divide-gray-100">
          {employees.map((e, idx) => (
            <tr key={e._id} className="hover:bg-gray-50">
              <td className="px-6 py-4 text-gray-600">{idx + 1}</td>

              <td className="px-6 py-4 font-medium text-gray-800">
                {e.name || "N/A"}
              </td>

              <td className="px-6 py-4">
                <span
                  className={`px-2 text-xs font-semibold rounded-full ${
                    e.role === "admin"
                      ? "bg-red-100 text-red-800"
                      : e.role === "hr"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {e.role}
                </span>
              </td>

              <td className="px-6 py-4 text-gray-700">
                {e.department || "N/A"}
              </td>

              <td className="px-6 py-4 font-semibold text-gray-900">
                ₹{e.baseSalary ?? "N/A"}
              </td>

              <td className="px-6 py-4 text-center">
                <button
                  onClick={() => handleDelete(e._id)}
                  className="bg-red-500 hover:bg-red-600 text-black px-3 py-1 rounded text-sm"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}