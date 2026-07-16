import { NextResponse } from "next/server";
import { prisma } from "@portfolio/database";

export async function GET() {
  const settings = await prisma.homepageSettings.findUnique({
    where: { id: "homepage" },
  });
  return NextResponse.json({ settings });
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const settings = await prisma.homepageSettings.upsert({
      where: { id: "homepage" },
      update: body,
      create: { id: "homepage", ...body },
    });
    return NextResponse.json({ settings });
  } catch {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}
