import { NextResponse } from "next/server";
import { getUploadPath } from "@/lib/upload";
import fs from "fs/promises";

interface RouteParams {
  params: Promise<{ path: string[] }>;
}

export async function GET(_req: Request, { params }: RouteParams) {
  const { path: segments } = await params;
  const filePath = getUploadPath(segments.join("/"));
  try {
    const data = await fs.readFile(filePath);
    return new NextResponse(data);
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
