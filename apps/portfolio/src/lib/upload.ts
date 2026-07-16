import path from "path";
import fs from "fs/promises";

const UPLOAD_DIR =
  process.env.UPLOAD_DIR ?? path.join(process.cwd(), "../../uploads");

export async function ensureUploadDir(subdir?: string) {
  const dir = subdir ? path.join(UPLOAD_DIR, subdir) : UPLOAD_DIR;
  await fs.mkdir(dir, { recursive: true });
  return dir;
}

export async function saveUploadedFile(
  file: File,
  subdir: string
): Promise<{ url: string; fileName: string }> {
  const dir = await ensureUploadDir(subdir);
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const fileName = `${Date.now()}-${safeName}`;
  const filePath = path.join(dir, fileName);
  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(filePath, buffer);
  return {
    url: `/api/uploads/${subdir}/${fileName}`,
    fileName: file.name,
  };
}

export function getUploadPath(relativePath: string) {
  return path.join(UPLOAD_DIR, relativePath);
}
