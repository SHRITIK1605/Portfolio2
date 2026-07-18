import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { getUploadPath } from "@/lib/upload";

interface RouteParams {
  params: Promise<{ path: string[] }>;
}

function contentTypeForFile(name: string) {
  const ext = name.split(".").pop()?.toLowerCase();
  if (ext === "pdf") return "application/pdf";
  if (ext === "png") return "image/png";
  if (ext === "jpg" || ext === "jpeg") return "image/jpeg";
  return "application/octet-stream";
}

async function readPdfWithFallback(relativePath: string) {
  const fileName = path.basename(relativePath);

  try {
    return await fs.readFile(getUploadPath(relativePath));
  } catch {
    // Deployed builds don't include repo-root uploads/ — serve from public/projects.
    if (relativePath.startsWith("projects/")) {
      return fs.readFile(
        path.join(process.cwd(), "public", "projects", fileName)
      );
    }
    throw new Error("Not found");
  }
}

export async function GET(_req: Request, { params }: RouteParams) {
  const { path: segments } = await params;
  const relativePath = segments.join("/");
  const fileName = segments.at(-1) ?? "file";

  try {
    const data = await readPdfWithFallback(relativePath);

    return new NextResponse(new Uint8Array(data), {
      headers: {
        "Content-Type": contentTypeForFile(fileName),
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
