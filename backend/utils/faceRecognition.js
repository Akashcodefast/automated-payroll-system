// utils/faceRecognition.js
import * as faceapi from "@vladmandic/face-api"; // if using face-api.js
import fs from "fs";
import path from "path";

export const verifyFace = async (uploadedImage, storedImagePath) => {
  try {
    // load face models
    await faceapi.nets.ssdMobilenetv1.loadFromDisk("./models");
    await faceapi.nets.faceRecognitionNet.loadFromDisk("./models");
    await faceapi.nets.faceLandmark68Net.loadFromDisk("./models");

    // read images
    const img1 = await canvas.loadImage(uploadedImage);
    const img2 = await canvas.loadImage(storedImagePath);

    // compute descriptors
    const desc1 = await faceapi.computeFaceDescriptor(img1);
    const desc2 = await faceapi.computeFaceDescriptor(img2);

    // cosine similarity
    const distance = faceapi.euclideanDistance(desc1, desc2);

    return distance < 0.6; // ✅ true if faces match
  } catch (err) {
    console.error("Face recognition failed:", err);
    return false;
  }
};


// // utils/faceRecognition.js (mock version)
// export const verifyFace = async (uploadedImage, storedImagePath) => {
//   // Mock: 90% chance of success
//   return Math.random() > 0.1;
// };