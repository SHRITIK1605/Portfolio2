import { NextResponse } from "next/server";
import { getHomepageSettings } from "@/lib/data";

export async function GET() {
  const settings = await getHomepageSettings();
  return NextResponse.json({ settings });
}
