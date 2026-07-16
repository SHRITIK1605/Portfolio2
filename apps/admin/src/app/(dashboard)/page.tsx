import { prisma } from "@portfolio/database";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [projectCount, documentCount, chatCount, recentEvents] =
    await Promise.all([
      prisma.project.count(),
      prisma.document.count(),
      prisma.chat.count(),
      prisma.analyticsEvent.findMany({
        orderBy: { createdAt: "desc" },
        take: 8,
        include: { project: { select: { title: true } } },
      }),
    ]);

  return (
    <div>
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p className="mt-1 text-slate-500">Overview of your portfolio CMS</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {[
          { label: "Projects", value: projectCount },
          { label: "Documents", value: documentCount },
          { label: "Chat Sessions", value: chatCount },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <p className="text-sm text-slate-500">{stat.label}</p>
            <p className="mt-2 text-3xl font-semibold">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="font-medium">Recent Activity</h2>
        <ul className="mt-4 space-y-3">
          {recentEvents.length === 0 ? (
            <li className="text-sm text-slate-500">No activity yet.</li>
          ) : (
            recentEvents.map((event) => (
              <li
                key={event.id}
                className="flex items-center justify-between text-sm"
              >
                <span>
                  {event.type.replace(/_/g, " ")}
                  {event.project?.title ? ` — ${event.project.title}` : ""}
                </span>
                <span className="text-slate-400">
                  {event.createdAt.toLocaleString()}
                </span>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
