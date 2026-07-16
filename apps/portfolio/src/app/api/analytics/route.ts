import { NextResponse } from "next/server";
import { prisma } from "@portfolio/database";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { type, projectId, metadata } = body;

    if (!type) {
      return NextResponse.json({ error: "Missing type" }, { status: 400 });
    }

    await prisma.analyticsEvent.create({
      data: {
        type,
        projectId: projectId ?? undefined,
        metadata: metadata ?? undefined,
      },
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to track event" }, { status: 500 });
  }
}
