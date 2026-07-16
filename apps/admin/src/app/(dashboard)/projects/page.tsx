"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Eye, EyeOff, Pencil, Plus, Trash2 } from "lucide-react";
import { parseTags } from "@/lib/projects";

interface Project {
  id: string;
  title: string;
  slug: string;
  tags: unknown;
  published: boolean;
  coverImageUrl: string | null;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(
    null
  );

  useEffect(() => {
    fetch("/api/projects")
      .then((r) => r.json())
      .then((d) => setProjects(d.projects ?? []))
      .finally(() => setLoading(false));
  }, []);

  function showMessage(type: "success" | "error", text: string) {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  }

  async function handleTogglePublish(project: Project) {
    setBusyId(project.id);
    const nextPublished = !project.published;

    try {
      const res = await fetch(`/api/projects/${project.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: nextPublished }),
      });

      if (!res.ok) throw new Error("Failed to update status");

      const { project: updated } = await res.json();
      setProjects((prev) =>
        prev.map((item) => (item.id === project.id ? { ...item, published: updated.published } : item))
      );
      showMessage(
        "success",
        nextPublished ? `"${project.title}" published` : `"${project.title}" moved to draft`
      );
    } catch {
      showMessage("error", "Could not update publish status");
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(project: Project) {
    if (!confirm(`Delete "${project.title}"? This cannot be undone.`)) return;

    setBusyId(project.id);
    try {
      const res = await fetch(`/api/projects/${project.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");

      setProjects((prev) => prev.filter((p) => p.id !== project.id));
      showMessage("success", `"${project.title}" deleted`);
    } catch {
      showMessage("error", "Could not delete project");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Projects</h1>
          <p className="mt-1 text-slate-500">
            Create, edit, delete, and control publish status for portfolio projects
          </p>
        </div>
        <Link
          href="/projects/new"
          className="inline-flex items-center gap-2 rounded-lg bg-teal-500 px-4 py-2 text-sm font-medium text-slate-950 hover:bg-teal-400"
        >
          <Plus className="h-4 w-4" />
          Create Project
        </Link>
      </div>

      {message ? (
        <p
          className={`mt-4 rounded-lg px-3 py-2 text-sm ${
            message.type === "success"
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-600"
          }`}
        >
          {message.text}
        </p>
      ) : null}

      <div className="mt-8 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-slate-500">
            <tr>
              <th className="px-4 py-3">Cover</th>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Tags</th>
              <th className="px-4 py-3">Publish</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                  Loading…
                </td>
              </tr>
            ) : projects.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                  No projects yet. Create your first project.
                </td>
              </tr>
            ) : (
              projects.map((project) => {
                const isBusy = busyId === project.id;

                return (
                  <tr key={project.id} className="border-b border-slate-100">
                    <td className="px-4 py-3">
                      {project.coverImageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={project.coverImageUrl}
                          alt=""
                          className="h-10 w-16 rounded object-cover"
                        />
                      ) : (
                        <div className="h-10 w-16 rounded bg-slate-100" />
                      )}
                    </td>
                    <td className="px-4 py-3 font-medium">{project.title}</td>
                    <td className="px-4 py-3 text-slate-500">{project.slug}</td>
                    <td className="px-4 py-3 text-slate-500">
                      {parseTags(project.tags).slice(0, 2).join(", ")}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          disabled={isBusy}
                          onClick={() => handleTogglePublish(project)}
                          className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors disabled:opacity-50 ${
                            project.published ? "bg-teal-500" : "bg-slate-300"
                          }`}
                          role="switch"
                          aria-checked={project.published}
                          aria-label={
                            project.published
                              ? `Unpublish ${project.title}`
                              : `Publish ${project.title}`
                          }
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              project.published ? "translate-x-6" : "translate-x-1"
                            }`}
                          />
                        </button>
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                            project.published
                              ? "bg-green-100 text-green-700"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {project.published ? (
                            <>
                              <Eye className="h-3 w-3" />
                              Published
                            </>
                          ) : (
                            <>
                              <EyeOff className="h-3 w-3" />
                              Draft
                            </>
                          )}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        <Link
                          href={`/projects/${project.id}`}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                          Edit
                        </Link>
                        <button
                          type="button"
                          disabled={isBusy}
                          onClick={() => handleDelete(project)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
