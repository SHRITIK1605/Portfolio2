import { NextResponse } from "next/server";
import { prisma } from "@portfolio/database";
import { getResumeUrlFromEnv } from "@/lib/env";

export const dynamic = "force-dynamic";

const EXPORT_FILENAME = "Shritik Jaiswal Resume.pdf";

function driveFileId(url: string): string | null {
  const pathMatch = url.match(/drive\.google\.com\/file\/d\/([^/?#]+)/);
  if (pathMatch) return pathMatch[1];
  const queryMatch = url.match(/[?&]id=([^&#]+)/);
  return queryMatch ? queryMatch[1] : null;
}

export async function GET(req: Request) {
  const { searchParams, origin } = new URL(req.url);
  const download = searchParams.get("download") === "1";

  const settings = await prisma.homepageSettings
    .findUnique({ where: { id: "homepage" } })
    .catch(() => null);

  const resumeUrl = settings?.resumeUrl?.trim() || getResumeUrlFromEnv();
  if (!resumeUrl) {
    return NextResponse.json({ error: "No resume configured" }, { status: 404 });
  }

  let fetchUrl = resumeUrl;
  if (resumeUrl.includes("drive.google.com")) {
    const id = driveFileId(resumeUrl);
    if (id) fetchUrl = `https://drive.google.com/uc?export=download&id=${id}`;
  } else if (resumeUrl.startsWith("/")) {
    fetchUrl = new URL(resumeUrl, origin).toString();
  }

  const upstream = await fetch(fetchUrl, { redirect: "follow" }).catch(() => null);
  if (!upstream?.ok || !upstream.body) {
    return NextResponse.json(
      { error: "Could not fetch resume file" },
      { status: 502 }
    );
  }

  const contentType = upstream.headers.get("content-type") ?? "";
  if (contentType.includes("text/html")) {
    // Drive returned its HTML viewer instead of the file (permissions or scan page)
    return NextResponse.json(
      { error: "Resume file is not directly downloadable" },
      { status: 502 }
    );
  }

  return new Response(upstream.body, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `${download ? "attachment" : "inline"}; filename="${EXPORT_FILENAME}"`,
      "Cache-Control": "private, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
