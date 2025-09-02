import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, "uploads/attendance"),
  filename: (_req, file, cb) =>
    cb(null, `attendance-${Date.now()}${path.extname(file.originalname)}`)
});

const fileFilter = (_req, file, cb) => {
  const ok =
    /jpeg|jpg|png/.test(path.extname(file.originalname).toLowerCase()) &&
    /image\/(jpeg|jpg|png)/.test(file.mimetype);
  cb(ok ? null : new Error("Only JPG/PNG images allowed"), ok);
};

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter
});
