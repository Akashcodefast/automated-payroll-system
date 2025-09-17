import { useState } from "react";
import useCamera from "../../hooks/useCamera";
import { checkIn, checkOut } from "../../services/attendanceService";

export default function AttendanceCapture() {
  const { WebcamView, getScreenshot } = useCamera();
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  // Fixed GPS coordinates for now
  const FIXED_LAT = 12.9716; // Bangalore example
  const FIXED_LNG = 77.5946;

  const handle = async (type) => {
    try {
      setBusy(true);
      setMsg("");

      // Capture employee selfie
      const image = getScreenshot();
      if (!image) throw new Error("Could not capture image. Check camera permission.");

      // Payload for backend
      const payload = {
        type, // "in" or "out"
        imageUrl: image, // base64 string
        location: {
          latitude: FIXED_LAT,
          longitude: FIXED_LNG,
        },
      };

      // Call API
      if (type === "in") {
        await checkIn(payload);
        setMsg("✅ Check-in marked successfully.");
      } else {
        await checkOut(payload);
        setMsg("✅ Check-out marked successfully.");
      }
    } catch (e) {
      setMsg(e?.response?.data?.message || e?.message || "❌ Failed to mark attendance");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: 50 }}>
      <WebcamView />
      <div style={{ display: "flex", gap: 16, marginTop: 16 }}>
        <button disabled={busy} onClick={() => handle("in")}>Check In</button>
        <button disabled={busy} onClick={() => handle("out")}>Check Out</button>
      </div>
      {msg && <div style={{ marginTop: 16, fontWeight: "bold" }}>{msg}</div>}
    </div>
  );
}
