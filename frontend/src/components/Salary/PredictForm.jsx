// import { useState } from "react";
// import { predictForEmployee } from "../../services/salaryService";

// export default function PredictForm() {
//   const [form, setForm] = useState({ employeeId: "", month: "" });
//   const [result, setResult] = useState(null);
//   const [err, setErr] = useState("");

//   const onChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

//   const onSubmit = async (e) => {
//     e.preventDefault();
//     setErr("");
//     setResult(null);
//     try {
//       // Automatically generate defaults for missing fields
//       const payload = {
//         baseSalary: 300003,            // default baseSalary
//         hoursWorked: 160,             // default hoursWorked
//         leavesTaken: 0,               // default leavesTaken
//         experienceYears: 1,           // default experienceYears
//       };

//       const { data } = await predictForEmployee(payload);
//       setResult(data);
//     } catch (e) {
//       setErr(e?.response?.data?.message || "Prediction failed");
//     }
//   };

//   return (
//     <div style={{ padding: 12, border: "1px solid #eee", borderRadius: 6 }}>
//       <form
//         onSubmit={onSubmit}
//         style={{ display: "flex", gap: 8, alignItems: "end", flexWrap: "wrap" }}
//       >
//         <div>
//           <label>Employee ID</label><br />
//           <input name="employeeId" value={form.employeeId} onChange={onChange} required />
//         </div>
//         <div>
//           <label>Month (YYYY-MM)</label><br />
//           <input name="month" value={form.month} onChange={onChange} placeholder="2025-08" required />
//         </div>
//         <button type="submit">Predict</button>
//       </form>

//       {err && <div style={{ color: "red", marginTop: 8 }}>{err}</div>}
//       {result && (
//         <div style={{ marginTop: 8 }}>
//           <pre>{JSON.stringify(result, null, 2)}</pre>
//         </div>
//       )}
//     </div>
//   );
// }

import { useState } from "react";
import { predictForEmployee, getEmployee } from "../../services/salaryService";
  


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
      if (!form.employeeId) throw new Error("Employee ID is required");

      // Fetch employee details from DB
      const { data: employee } = await getEmployee(form.employeeId);

      if (!employee) throw new Error("Employee not found");

      const payload = {
        baseSalary: employee.salaryPerMonth,
        hoursWorked: 160,        // default or you can add to employee schema
        leavesTaken: 0,           // default
        experienceYears: 1        // default or calculate from joinDate
      };

      const { data } = await predictForEmployee(payload);
      setResult(data);
    } catch (e) {
      setErr(e?.response?.data?.message || e.message || "Prediction failed");
    }
  };

  return (
    <div style={{ padding: 12, border: "1px solid #eee", borderRadius: 6 }}>
      <form
        onSubmit={onSubmit}
        style={{ display: "flex", gap: 8, alignItems: "end", flexWrap: "wrap" }}
      >
        <div>
          <label>Employee ID</label><br />
          <input name="employeeId" value={form.employeeId} onChange={onChange} required />
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

