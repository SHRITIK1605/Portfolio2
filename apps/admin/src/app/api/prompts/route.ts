import { NextResponse } from "next/server";
import { prisma } from "@portfolio/database";

export async function GET() {
  const settings = await prisma.promptSettings.findUnique({
    where: { id: "default" },
  });
  return NextResponse.json({ settings });
}

export async function PUT(req: Request) {
  try {
    const { systemPrompt, projectPrompt } = await req.json();
    const settings = await prisma.promptSettings.upsert({
      where: { id: "default" },
      update: { systemPrompt, projectPrompt },
      create: { id: "default", systemPrompt, projectPrompt },
    });
    return NextResponse.json({ settings });
  } catch {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}
