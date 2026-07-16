import { NextResponse } from "next/server";
import { prisma } from "@portfolio/database";

export async function GET() {
  const questions = await prisma.suggestedQuestion.findMany({
    orderBy: { order: "asc" },
  });
  return NextResponse.json({ questions });
}

export async function POST(req: Request) {
  const body = await req.json();
  const question = await prisma.suggestedQuestion.create({ data: body });
  return NextResponse.json({ question }, { status: 201 });
}

export async function PUT(req: Request) {
  const body = await req.json();
  const { id, ...data } = body;
  const question = await prisma.suggestedQuestion.update({ where: { id }, data });
  return NextResponse.json({ question });
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  await prisma.suggestedQuestion.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
