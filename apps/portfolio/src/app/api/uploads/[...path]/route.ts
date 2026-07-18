import { NextResponse } from "next/server";
import fs from "fs/promises";
import { getUploadPath } from "@/lib/upload";

interface RouteParams {
  params: Promise<{ path: string[] }>;
}

export async function GET(_req: Request, { params }: RouteParams) {
  const { path: segments } = await params;
  const filePath = getUploadPath(segments.join("/"));

  try {
    const data = await fs.readFile(filePath);
    const ext = segments.at(-1)?.split(".").pop()?.toLowerCase();
    const contentType =
      ext === "pdf"
        ? "application/pdf"
        : ext === "png"
          ? "image/png"
          : ext === "jpg" || ext === "jpeg"
            ? "image/jpeg"
            : "application/octet-stream";

    return new NextResponse(data, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
