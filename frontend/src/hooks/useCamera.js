import { useRef } from "react";
import Webcam from "react-webcam";

export default function useCamera() {
  const webcamRef = useRef(null);

  const getScreenshot = () => {
    if (!webcamRef.current) return null;
    return webcamRef.current.getScreenshot();
  };

  const WebcamView = (props) => (
    <Webcam
      ref={webcamRef}
      audio={false}
      screenshotFormat="image/jpeg"
      videoConstraints={{ width: 640, height: 480, facingMode: "user" }}
      {...props}
    />
  );

  return { WebcamView, getScreenshot };
}
