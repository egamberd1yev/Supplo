import fs from "fs/promises";
import path from "path";
import { UPLOADS_ROOT } from "../middlewares/upload.js";

export function fileToUrl(file) {
  return file ? `/uploads/products/${file.filename}` : null;
}

export async function deleteUploadedFile(fileUrl) {
  if (!fileUrl || !fileUrl.startsWith("/uploads/")) return;

  const full = path.join(UPLOADS_ROOT, fileUrl.replace("/uploads/", ""));
  if (!full.startsWith(UPLOADS_ROOT)) return;

  try {
    await fs.unlink(full);
  } catch {
    // fayl allaqachon yo'q bo'lsa, e'tibor bermaymiz
  }
}