import { NextResponse } from "next/server";
import { prisma } from "@portfolio/database";
import { normalizeSlugInput } from "@/lib/slug";

export async function GET() {
  const projects = await prisma.project.findMany({
    orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
  });
  return NextResponse.json({ projects });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      title,
      slug,
      shortDescription,
      longDescription,
      aiContext,
      coverImageUrl,
      pdfUrl,
      pdfFileName,
      tags = [],
      githubUrl,
      figmaUrl,
      priority = 0,
      published = false,
    } = body;

    if (!title || !slug || !shortDescription || !longDescription) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const normalizedSlug = normalizeSlugInput(slug);
    if (!normalizedSlug) {
      return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
    }

    const project = await prisma.project.create({
      data: {
        title,
        slug: normalizedSlug,
        shortDescription,
        longDescription,
        aiContext: aiContext ?? null,
        coverImageUrl,
        pdfUrl,
        pdfFileName,
        tags,
        githubUrl,
        figmaUrl,
        priority,
        published,
      },
    });

    return NextResponse.json({ project }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}
