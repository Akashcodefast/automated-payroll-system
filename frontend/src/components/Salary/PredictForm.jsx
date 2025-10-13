import { useState } from "react";
import { predictForEmployee, getEmployee } from "../../services/salaryService";

export default function PredictForm() {
  const [form, setForm] = useState({ employeeEmail: "", month: "" });
  const [result, setResult] = useState(null);
  const [err, setErr] = useState("");

  const onChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setResult(null);

    try {
      if (!form.employeeEmail) throw new Error("Employee email is required");

      // 1️⃣ Fetch employee details by email
      const { data: employeeRes } = await getEmployee(form.employeeEmail);
      const employee = employeeRes.data;

      if (!employee) throw new Error("Employee not found");

      // 2️⃣ Calculate experience years from joinDate if exists
      let experienceYears = 1;
      if (employee.joinDate) {
        const join = new Date(employee.joinDate);
        const now = new Date();
        experienceYears = now.getFullYear() - join.getFullYear();
      }

      // 3️⃣ Prepare payload for prediction
      const payload = {
        email: employee.email,                // send email, not employeeId
        baseSalary: employee.baseSalary ?? 30000,
        hoursWorked: 160,
        leavesTaken: 0,
        experienceYears: experienceYears,
        month: form.month
      };

      const { data } = await predictForEmployee(payload);
      setResult(data);

    } catch (err) {
      setErr(err?.response?.data?.message || err.message || "Prediction failed");
    }
  };

  return (
    <div style={{ padding: 12, border: "1px solid #eee", borderRadius: 6 }}>
      <form
        onSubmit={onSubmit}
        style={{ display: "flex", gap: 8, alignItems: "end", flexWrap: "wrap" }}
      >
        <div>
          <label>Employee Email</label><br />
          <input
            name="employeeEmail"
            value={form.employeeEmail}
            onChange={onChange}
            required
          />
        </div>
        <div>
          <label>Month (YYYY-MM)</label><br />
          <input
            name="month"
            value={form.month}
            onChange={onChange}
            placeholder="2025-08"
            required
          />
        </div>
        <button type="submit">Predict</button>
      </form>

      {err && <div style={{ color: "red", marginTop: 8 }}>{err}</div>}
      {result && (
        <div style={{ marginTop: 8 }}>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
