import { useState } from "react";
import useCamera from "../../hooks/useCamera";
import { getCurrentPosition } from "../../hooks/useGeo";
import { checkIn, checkOut } from "../../services/attendanceService";

export default function AttendanceCapture() {
  const { WebcamView, getScreenshot } = useCamera();
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  const handle = async (type) => {
    try {
      setBusy(true);
      setMsg("");
      const image = getScreenshot();
      if (!image) throw new Error("Could not capture image. Check camera permission.");
      const { lat, lng } = await getCurrentPosition({ enableHighAccuracy: true, timeout: 10000 });
      const payload = { image, lat, lng, timestamp: new Date().toISOString() };
      if (type === "in") await checkIn(payload);
      else await checkOut(payload);
      setMsg(`Attendance ${type === "in" ? "check-in" : "check-out"} marked.`);
    } catch (e) {
      setMsg(e?.message || "Failed to mark attendance");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <WebcamView />
      <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
        <button disabled={busy} onClick={() => handle("in")}>Check In</button>
        <button disabled={busy} onClick={() => handle("out")}>Check Out</button>
      </div>
      {msg && <div style={{ marginTop: 8 }}>{msg}</div>}
    </div>
  );
}
