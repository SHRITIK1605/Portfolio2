import { NextResponse } from "next/server";
import { prisma } from "@portfolio/database";
import { saveUploadedFile } from "@/lib/upload";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const coverImage = formData.get("coverImage");
    const pdf = formData.get("pdf");
    const resume = formData.get("resume");
    const knowledge = formData.get("file");
    const craftImage = formData.get("craftImage");

    let coverImageUrl: string | undefined;
    let pdfUrl: string | undefined;
    let pdfFileName: string | undefined;
    let documentId: string | undefined;
    let craftImageUrl: string | undefined;

    if (craftImage instanceof File && craftImage.size > 0) {
      const saved = await saveUploadedFile(craftImage, "craft");
      craftImageUrl = saved.url;
      return NextResponse.json({ craftImageUrl });
    }

    if (coverImage instanceof File && coverImage.size > 0) {
      const saved = await saveUploadedFile(coverImage, "covers");
      coverImageUrl = saved.url;
    }

    if (pdf instanceof File && pdf.size > 0) {
      const saved = await saveUploadedFile(pdf, "projects");
      pdfUrl = saved.url;
      pdfFileName = saved.fileName;
      const projectId = String(formData.get("projectId") ?? "") || null;

      const doc = await prisma.document.create({
        data: {
          title: saved.fileName,
          type: "PROJECT_PDF",
          scope: "PROJECT",
          fileUrl: saved.url,
          fileName: saved.fileName,
          projectId,
        },
      });
      documentId = doc.id;
    }

    if (resume instanceof File && resume.size > 0) {
      const saved = await saveUploadedFile(resume, "resume");
      const doc = await prisma.document.create({
        data: {
          title: "Resume",
          type: "RESUME",
          scope: "GLOBAL",
          fileUrl: saved.url,
          fileName: saved.fileName,
        },
      });

      await prisma.homepageSettings.update({
        where: { id: "homepage" },
        data: { resumeUrl: saved.url },
      });

      return NextResponse.json({
        resumeUrl: saved.url,
        documentId: doc.id,
      });
    }

    if (knowledge instanceof File && knowledge.size > 0) {
      const scope = String(formData.get("scope") ?? "GLOBAL");
      const projectId = String(formData.get("projectId") ?? "") || null;
      const type = String(formData.get("type") ?? "OTHER");
      const saved = await saveUploadedFile(knowledge, "knowledge");

      const doc = await prisma.document.create({
        data: {
          title: String(formData.get("title") ?? saved.fileName),
          type: type as "RESUME" | "PROJECT_PDF" | "CASE_STUDY" | "RESEARCH" | "OTHER",
          scope: scope as "GLOBAL" | "PROJECT",
          fileUrl: saved.url,
          fileName: saved.fileName,
          projectId,
        },
      });

      return NextResponse.json({ documentId: doc.id, fileUrl: saved.url });
    }

    return NextResponse.json({ coverImageUrl, pdfUrl, pdfFileName, documentId });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
