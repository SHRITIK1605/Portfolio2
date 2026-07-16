"use client";

import { useEffect, useState } from "react";

interface Analytics {
  projectViews: number;
  resumeDownloads: number;
  chatSessions: number;
  topProjects: { title: string; views: number }[];
  recentQuestions: unknown[];
}

export default function AnalyticsPage() {
  const [data, setData] = useState<Analytics | null>(null);

  useEffect(() => {
    fetch("/api/analytics")
      .then((r) => r.json())
      .then(setData);
  }, []);

  if (!data) return <p className="text-slate-500">Loading analytics…</p>;

  return (
    <div>
      <h1 className="text-2xl font-semibold">Analytics</h1>
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {[
          { label: "Project Views", value: data.projectViews },
          { label: "Resume Downloads", value: data.resumeDownloads },
          { label: "Chat Sessions", value: data.chatSessions },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">{s.label}</p>
            <p className="mt-2 text-3xl font-semibold">{s.value}</p>
          </div>
        ))}
      </div>
      <div className="mt-8 rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="font-medium">Most Viewed Projects</h2>
        <ul className="mt-4 space-y-2">
          {data.topProjects.length === 0 ? (
            <li className="text-sm text-slate-500">No data yet</li>
          ) : (
            data.topProjects.map((p) => (
              <li key={p.title} className="flex justify-between text-sm">
                <span>{p.title}</span>
                <span className="text-slate-400">{p.views} views</span>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
