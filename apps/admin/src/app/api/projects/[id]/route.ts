import { NextResponse } from "next/server";
import { prisma } from "@portfolio/database";
import { normalizeSlugInput } from "@/lib/slug";

interface RouteParams {
  params: Promise<{ id: string }>;
}

function pickProjectData(body: Record<string, unknown>) {
  const data: Record<string, unknown> = {};

  if (typeof body.title === "string") data.title = body.title;
  if (typeof body.slug === "string") {
    const normalizedSlug = normalizeSlugInput(body.slug);
    if (!normalizedSlug) {
      return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
    }
    data.slug = normalizedSlug;
  }
  if (typeof body.shortDescription === "string") data.shortDescription = body.shortDescription;
  if (typeof body.longDescription === "string") data.longDescription = body.longDescription;
  if (body.aiContext === null || typeof body.aiContext === "string") data.aiContext = body.aiContext;
  if (body.coverImageUrl === null || typeof body.coverImageUrl === "string") {
    data.coverImageUrl = body.coverImageUrl;
  }
  if (body.pdfUrl === null || typeof body.pdfUrl === "string") data.pdfUrl = body.pdfUrl;
  if (body.pdfFileName === null || typeof body.pdfFileName === "string") {
    data.pdfFileName = body.pdfFileName;
  }
  if (Array.isArray(body.tags)) data.tags = body.tags;
  if (body.githubUrl === null || typeof body.githubUrl === "string") data.githubUrl = body.githubUrl;
  if (body.figmaUrl === null || typeof body.figmaUrl === "string") data.figmaUrl = body.figmaUrl;
  if (typeof body.priority === "number") data.priority = body.priority;
  if (typeof body.published === "boolean") data.published = body.published;

  return data;
}

export async function GET(_req: Request, { params }: RouteParams) {
  const { id } = await params;
  const project = await prisma.project.findUnique({ where: { id } });
  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ project });
}

export async function PUT(req: Request, { params }: RouteParams) {
  const { id } = await params;
  try {
    const body = await req.json();
    const data = pickProjectData(body);

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
    }

    const project = await prisma.project.update({
      where: { id },
      data,
    });
    return NextResponse.json({ project });
  } catch {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: RouteParams) {
  const { id } = await params;
  try {
    const body = await req.json();

    if (typeof body.published !== "boolean") {
      return NextResponse.json({ error: "published boolean required" }, { status: 400 });
    }

    const project = await prisma.project.update({
      where: { id },
      data: { published: body.published },
    });

    return NextResponse.json({ project });
  } catch {
    return NextResponse.json({ error: "Failed to update publish status" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: RouteParams) {
  const { id } = await params;
  try {
    await prisma.project.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
