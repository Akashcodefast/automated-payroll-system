import { useState } from "react";
import { predictForEmployee } from "../../services/salaryService";

export default function PredictForm() {
  const [form, setForm] = useState({ employeeId: "", month: "" });
  const [result, setResult] = useState(null);
  const [err, setErr] = useState("");

  const onChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setResult(null);
    try {
      const { data } = await predictForEmployee(form);
      setResult(data);
    } catch (e) {
      setErr(e?.response?.data?.error || "Prediction failed");
    }
  };

  return (
    <div style={{ padding: 12, border: "1px solid #eee", borderRadius: 6 }}>
      <form onSubmit={onSubmit} style={{ display: "flex", gap: 8, alignItems: "end", flexWrap: "wrap" }}>
        <div>
          <label>Employee ID</label><br />
          <input name="employeeId" value={form.employeeId} onChange={onChange} required />
        </div>
        <div>
          <label>Month (YYYY-MM)</label><br />
          <input name="month" value={form.month} onChange={onChange} placeholder="2025-08" required />
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
