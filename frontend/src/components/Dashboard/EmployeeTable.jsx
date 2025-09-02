export default function EmployeeTable({ items = [] }) {
  return (
    <table width="100%" border="1" cellPadding="6" style={{ borderCollapse: "collapse" }}>
      <thead>
        <tr>
          <th>Name</th>
          <th>Designation</th>
          <th>Experience</th>
          <th>Base Salary</th>
        </tr>
      </thead>
      <tbody>
        {items.map((e) => (
          <tr key={e._id}>
            <td>{e.name}</td>
            <td>{e.designation}</td>
            <td>{e.experienceYears}</td>
            <td>{e.baseSalary}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
