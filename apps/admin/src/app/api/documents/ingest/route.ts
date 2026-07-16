import { NextResponse } from "next/server";
import fs from "fs/promises";
import { prisma } from "@portfolio/database";
import { ingestDocument, ingestProjectContext } from "@portfolio/ai";
import { getUploadPath } from "@/lib/upload";

export async function POST(req: Request) {
  try {
    const { documentId, projectId } = await req.json();

    if (projectId && !documentId) {
      const result = await ingestProjectContext(projectId);
      return NextResponse.json(result);
    }

    if (!documentId) {
      return NextResponse.json({ error: "documentId or projectId required" }, { status: 400 });
    }

    const document = await prisma.document.findUnique({ where: { id: documentId } });
    if (!document) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const relativePath = document.fileUrl.replace(/^.*\/api\/uploads\//, "");
    const buffer = await fs.readFile(getUploadPath(relativePath));

    const resolvedProjectId = projectId ?? document.projectId;

    const result = await ingestDocument({
      documentId,
      buffer,
      projectId: resolvedProjectId,
    });

    if (resolvedProjectId) {
      await prisma.document.update({
        where: { id: documentId },
        data: { projectId: resolvedProjectId },
      });
      await ingestProjectContext(resolvedProjectId).catch(() => {});
    }

    return NextResponse.json(result);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Ingest failed" }, { status: 500 });
  }
}
