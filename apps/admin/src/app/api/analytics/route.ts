import { NextResponse } from "next/server";
import { prisma } from "@portfolio/database";

export async function GET() {
  const [
    projectViews,
    resumeDownloads,
    chatQuestions,
    chatSessions,
    topProjects,
  ] = await Promise.all([
    prisma.analyticsEvent.count({ where: { type: "PROJECT_VIEW" } }),
    prisma.analyticsEvent.count({ where: { type: "RESUME_DOWNLOAD" } }),
    prisma.analyticsEvent.findMany({
      where: { type: "CHAT_QUESTION" },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
    prisma.chat.count(),
    prisma.analyticsEvent.groupBy({
      by: ["projectId"],
      where: { type: "PROJECT_VIEW", projectId: { not: null } },
      _count: { projectId: true },
      orderBy: { _count: { projectId: "desc" } },
      take: 5,
    }),
  ]);

  const projectIds = topProjects
    .map((p) => p.projectId)
    .filter(Boolean) as string[];
  const projects = await prisma.project.findMany({
    where: { id: { in: projectIds } },
    select: { id: true, title: true },
  });
  const projectMap = Object.fromEntries(projects.map((p) => [p.id, p.title]));

  return NextResponse.json({
    projectViews,
    resumeDownloads,
    chatSessions,
    recentQuestions: chatQuestions.map((q) => q.metadata),
    topProjects: topProjects.map((p) => ({
      title: p.projectId ? projectMap[p.projectId] ?? "Unknown" : "Unknown",
      views: p._count.projectId,
    })),
  });
}
