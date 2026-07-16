import { NextResponse } from "next/server";
import { getProjectBySlug } from "@/lib/data";

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export async function GET(_req: Request, { params }: RouteParams) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ project });
}
