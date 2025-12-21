import { useEffect, useRef, useState } from "react";
import useCamera from "../../hooks/useCamera";
import { checkIn, checkOut, getMyAttendance } from "../../services/attendanceService";

export default function AttendanceCapture() {
  const { WebcamView, getScreenshot } = useCamera();
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [showCamera, setShowCamera] = useState(false);
  const [isCheckedIn, setIsCheckedIn] = useState(false);

  const watchIntervalRef = useRef(null);
  const lastLocationRef = useRef(null);
  const autoCheckoutDoneRef = useRef(false);

  const OFFICE_COORDS = { lat: 12.9564672, lng: 77.6208384 };
  const AUTO_CHECKOUT_DISTANCE_M = 500;

  // Restore attendance
  useEffect(() => {
    const restoreAttendance = async () => {
      try {
        const res = await getMyAttendance();
        if (res?.data?.checkIn && !res.data.checkOut) {
          setIsCheckedIn(true);
          startLocationPolling();
        }
      } catch (err) {
        console.error(err);
      }
    };
    restoreAttendance();
    return () => stopLocationPolling();
  }, []);

  // Haversine distance
  const haversine = (lat1, lon1, lat2, lon2) => {
    const R = 6371000;
    const toRad = (v) => (v * Math.PI) / 180;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) ** 2;
    return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  // Safe location getter
  const getLocation = async () => {
    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve(pos.coords),
        () => resolve({ latitude: OFFICE_COORDS.lat, longitude: OFFICE_COORDS.lng }), // fallback
        { enableHighAccuracy: true, timeout: 60000 } // 60s timeout
      );
    });
  };

  // Location polling
  const startLocationPolling = () => {
    stopLocationPolling();
    autoCheckoutDoneRef.current = false;
    watchIntervalRef.current = setInterval(checkAutoCheckout, 5000);
  };
  const stopLocationPolling = () => {
    if (watchIntervalRef.current) clearInterval(watchIntervalRef.current);
    watchIntervalRef.current = null;
  };

  const checkAutoCheckout = async () => {
    if (!isCheckedIn || autoCheckoutDoneRef.current) return;
    const { latitude, longitude } = await getLocation();
    lastLocationRef.current = { latitude, longitude };

    const dist = haversine(latitude, longitude, OFFICE_COORDS.lat, OFFICE_COORDS.lng);
    if (dist > AUTO_CHECKOUT_DISTANCE_M) {
      autoCheckoutDoneRef.current = true;
      await handleAttendance("out", true);
    }
  };

  // Capture image
  const captureImage = async () => {
    setShowCamera(true);
    await new Promise((r) => setTimeout(r, 800));
    const img = getScreenshot();
    setShowCamera(false);
    return img;
  };

  // Handle attendance
  const handleAttendance = async (type, auto = false) => {
    if (busy) return;
    setBusy(true);
    try {
      const coords = await getLocation();
      lastLocationRef.current = coords;

      const image = await captureImage();
      if (!image) throw new Error("Camera capture failed");

      const payload = { type, imageUrl: image, location: lastLocationRef.current };

      if (type === "in") {
        await checkIn(payload);
        setIsCheckedIn(true);
        startLocationPolling();
        setMsg("✅ Checked in successfully");
      } else {
        await checkOut(payload);
        setIsCheckedIn(false);
        stopLocationPolling();
        setMsg(auto ? "⚠️ Auto check-out done" : "✅ Checked out successfully");
      }
    } catch (err) {
      // Ignore time expired / timeout errors
      const message = (err?.response?.data?.message || err.message || "").toLowerCase();
      if (!message.includes("time expired") && !message.includes("timeout")) setMsg(err?.response?.data?.message || err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: 50, fontFamily: "Arial, sans-serif" }}>
      {showCamera && <div style={{ border: "2px solid #2563eb", borderRadius: 12, padding: 10, marginBottom: 20 }}><WebcamView /></div>}

      {!showCamera && (
        <button
          onClick={() => setShowCamera(true)}
          disabled={busy}
          style={{
            backgroundColor: busy ? "#9ca3af" : "#2563eb",
            color: "#fff",
            padding: "12px 24px",
            fontSize: 16,
            border: "none",
            borderRadius: 10,
            cursor: busy ? "not-allowed" : "pointer",
            boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
            transition: "background-color 0.3s, transform 0.2s",
          }}
        >
          🎥 Open Camera
        </button>
      )}

      <div style={{ display: "flex", gap: 20, marginTop: 20 }}>
        <button
          disabled={busy}
          onClick={() => handleAttendance("in")}
          style={{
            backgroundColor: busy ? "#9ca3af" : "#16a34a",
            color: "#fff",
            padding: "12px 28px",
            fontSize: 16,
            fontWeight: "bold",
            border: "none",
            borderRadius: 10,
            cursor: busy ? "not-allowed" : "pointer",
            boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
            transition: "transform 0.2s, background-color 0.3s",
          }}
        >
          ✅ Check In
        </button>
        <button
          disabled={busy}
          onClick={() => handleAttendance("out")}
          style={{
            backgroundColor: busy ? "#9ca3af" : "#dc2626",
            color: "#fff",
            padding: "12px 28px",
            fontSize: 16,
            fontWeight: "bold",
            border: "none",
            borderRadius: 10,
            cursor: busy ? "not-allowed" : "pointer",
            boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
            transition: "transform 0.2s, background-color 0.3s",
          }}
        >
          ⛔ Check Out
        </button>
      </div>

      {msg && (
        <div style={{ marginTop: 20, fontWeight: "bold", color: msg.includes("❌") ? "#dc2626" : "#16a34a" }}>
          {msg}
        </div>
      )}
    </div>
  );
}
