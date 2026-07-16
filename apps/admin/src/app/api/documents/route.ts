import { NextResponse } from "next/server";
import { prisma } from "@portfolio/database";

export async function GET() {
  const documents = await prisma.document.findMany({
    orderBy: { createdAt: "desc" },
    include: { project: { select: { title: true } } },
  });
  return NextResponse.json({ documents });
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  await prisma.document.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
