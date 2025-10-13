import { useEffect, useRef, useState } from "react";
import useCamera from "../../hooks/useCamera";
import { checkIn, checkOut } from "../../services/attendanceService";

export default function AttendanceCapture() {
  const { WebcamView, getScreenshot } = useCamera();
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [showCamera, setShowCamera] = useState(false);

  const watchIntervalRef = useRef(null);
  const lastLocationRef = useRef(null);
  const consecutiveFarRef = useRef(0);
  const autoCheckoutDoneRef = useRef(false);

  const AUTO_CHECKOUT_DISTANCE_M = 10000; // 10 km
  const REQUIRED_CONSECUTIVE = 2;
  const OFFICE_COORDS = { lat: 12.9716, lng: 77.5946 };

  const haversineDistanceMeters = (lat1, lon1, lat2, lon2) => {
    const R = 6371000;
    const toRad = (v) => (v * Math.PI) / 180;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  const getCurrentPosition = (options = {}) =>
    new Promise((resolve, reject) => {
      if (!navigator.geolocation) return reject(new Error("Geolocation not supported"));
      navigator.geolocation.getCurrentPosition(resolve, reject, options);
    });

  const startLocationPolling = () => {
    stopLocationPolling();
    consecutiveFarRef.current = 0;
    autoCheckoutDoneRef.current = false;
    sampleLocationAndMaybeAutoCheckout();
    watchIntervalRef.current = setInterval(sampleLocationAndMaybeAutoCheckout, 1000);
  };

  const stopLocationPolling = () => {
    if (watchIntervalRef.current) {
      clearInterval(watchIntervalRef.current);
      watchIntervalRef.current = null;
    }
    consecutiveFarRef.current = 0;
  };

  const sampleLocationAndMaybeAutoCheckout = async () => {
    if (busy || autoCheckoutDoneRef.current) return;

    try {
      const pos = await getCurrentPosition({
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 5000,
      });
      const { latitude, longitude, accuracy } = pos.coords;
      lastLocationRef.current = { latitude, longitude, accuracy, timestamp: Date.now() };

      const dist = haversineDistanceMeters(latitude, longitude, OFFICE_COORDS.lat, OFFICE_COORDS.lng);
      console.log("📍 Location poll:", latitude, longitude, "→", dist.toFixed(2), "m");

      if (accuracy > AUTO_CHECKOUT_DISTANCE_M * 2) return;

      consecutiveFarRef.current = dist > AUTO_CHECKOUT_DISTANCE_M
        ? consecutiveFarRef.current + 1
        : 0;

      if (consecutiveFarRef.current >= REQUIRED_CONSECUTIVE) {
        autoCheckoutDoneRef.current = true;
        console.log("⚠️ Auto-checkout triggered");
        await performAutoCheckout();
      }
    } catch (err) {
      console.warn("Location sample failed:", err.message || err);
    }
  };

  const captureImageSafe = async () => {
    setShowCamera(true);
    for (let i = 0; i < 3; i++) {
      const img = getScreenshot();
      if (img) {
        setShowCamera(false);
        return img;
      }
      await new Promise((r) => setTimeout(r, 1000));
    }
    setShowCamera(false);
    return null;
  };

  const performAutoCheckout = async () => {
    if (busy) return;
    setBusy(true);
    try {
      setMsg("⚠️ Auto check-out: leaving office area...");
      const image = await captureImageSafe();
      if (!image) throw new Error("Camera capture failed for auto-checkout.");

      const payload = { type: "out", imageUrl: image, location: lastLocationRef.current };
      await checkOut(payload);
      setMsg("✅ Auto check-out completed.");
      stopLocationPolling();
    } catch (e) {
      console.error("Auto-checkout error:", e);
      setMsg(e?.response?.data?.message || e?.message || "❌ Auto check-out failed");
    } finally {
      setBusy(false);
    }
  };

  const handleAttendance = async (type) => {
    if (busy) return;
    setBusy(true);
    setMsg("");

    try {
      const pos = await getCurrentPosition({ enableHighAccuracy: true, timeout: 10000 });
      lastLocationRef.current = {
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
        accuracy: pos.coords.accuracy,
        timestamp: pos.timestamp,
      };

      const image = await captureImageSafe();
      if (!image) throw new Error("Could not capture image. Check camera permission.");

      const payload = { type, imageUrl: image, location: lastLocationRef.current };
      if (type === "in") {
        await checkIn(payload);
        setMsg("✅ Check-in marked successfully.");
        startLocationPolling();
      } else {
        await checkOut(payload);
        setMsg("✅ Check-out marked successfully.");
        stopLocationPolling();
      }
    } catch (e) {
      console.error("Attendance error:", e);
      setMsg(e?.response?.data?.message || e?.message || "❌ Failed to mark attendance");
    } finally {
      setBusy(false);
      setShowCamera(false);
    }
  };

  useEffect(() => () => stopLocationPolling(), []);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: 50 }}>
      {showCamera && <WebcamView />}
      {!showCamera && <button onClick={() => setShowCamera(true)} disabled={busy}>🎥 Open Camera</button>}

      <div style={{ display: "flex", gap: 16, marginTop: 16 }}>
        <button disabled={busy} onClick={() => handleAttendance("in")}>Check In</button>
        <button disabled={busy} onClick={() => handleAttendance("out")}>Check Out</button>
      </div>

      {msg && <div style={{ marginTop: 16, fontWeight: "bold" }}>{msg}</div>}
    </div>
  );
}
