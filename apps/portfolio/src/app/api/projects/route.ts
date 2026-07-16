import { NextResponse } from "next/server";
import { getPublishedProjects } from "@/lib/data";

export async function GET() {
  const projects = await getPublishedProjects();
  return NextResponse.json({ projects });
}
