import multer from "multer";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const UPLOADS_ROOT = path.join(__dirname, "..", "..", "uploads");
const PRODUCTS_DIR = path.join(UPLOADS_ROOT, "products");

fs.mkdirSync(PRODUCTS_DIR, { recursive: true });

const ALLOWED = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, PRODUCTS_DIR),
  filename: (req, file, cb) => {
    cb(null, `${crypto.randomUUID()}${ALLOWED[file.mimetype]}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (req, file, cb) => {
    if (!ALLOWED[file.mimetype]) {
      return cb(new Error("Faqat JPG, PNG yoki WEBP rasm yuklash mumkin"));
    }
    cb(null, true);
  },
}).single("image");

export function uploadProductImage(req, res, next) {
  upload(req, res, (err) => {
    if (!err) return next();

    if (err instanceof multer.MulterError) {
      const message =
        err.code === "LIMIT_FILE_SIZE"
          ? "Rasm hajmi 5 MB dan oshmasligi kerak"
          : "Rasm yuklashda xatolik";
      return res.status(400).json({ message });
    }

    return res.status(400).json({ message: err.message });
  });
}