"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Trash2 } from "lucide-react";
import ProjectForm from "@/components/ProjectForm";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EditProjectPage({ params }: PageProps) {
  const router = useRouter();
  const [projectId, setProjectId] = useState<string | null>(null);
  const [initial, setInitial] = useState<Record<string, unknown> | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    params.then(({ id }) => {
      setProjectId(id);
      fetch(`/api/projects/${id}`)
        .then((r) => r.json())
        .then((d) => setInitial(d.project));
    });
  }, [params]);

  async function handleSubmit(data: FormData) {
    if (!projectId) return;
    setSaving(true);
    setError("");

    try {
      let coverImageUrl = initial?.coverImageUrl;
      let pdfUrl = initial?.pdfUrl;
      let pdfFileName = initial?.pdfFileName;

      const cover = data.get("coverImage");
      const pdf = data.get("pdf");
      if ((cover && cover instanceof File && cover.size > 0) || (pdf && pdf instanceof File && pdf.size > 0)) {
        const uploadRes = await fetch("/api/upload", { method: "POST", body: data });
        const uploadData = await uploadRes.json();
        if (!uploadRes.ok) throw new Error(uploadData.error ?? "Upload failed");
        if (uploadData.coverImageUrl) coverImageUrl = uploadData.coverImageUrl;
        if (uploadData.pdfUrl) {
          pdfUrl = uploadData.pdfUrl;
          pdfFileName = uploadData.pdfFileName;
        }
        if (uploadData.documentId) {
          await fetch("/api/documents/ingest", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ documentId: uploadData.documentId, projectId }),
          });
        }
      }

      const tags = String(data.get("tags") ?? "")
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const res = await fetch(`/api/projects/${projectId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: data.get("title"),
          slug: data.get("slug"),
          shortDescription: data.get("shortDescription"),
          longDescription: data.get("longDescription"),
          aiContext: data.get("aiContext") || null,
          tags,
          githubUrl: data.get("githubUrl") || null,
          figmaUrl: data.get("figmaUrl") || null,
          priority: Number(data.get("priority") ?? 0),
          published: data.get("published") === "on",
          coverImageUrl,
          pdfUrl,
          pdfFileName,
        }),
      });

      if (!res.ok) throw new Error("Failed to update project");

      await fetch("/api/documents/ingest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId }),
      });

      router.push("/projects");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!projectId || !initial?.title) return;
    if (!confirm(`Delete "${String(initial.title)}"? This cannot be undone.`)) return;

    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/projects/${projectId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete project");
      router.push("/projects");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete");
      setSaving(false);
    }
  }

  if (!initial) {
    return <p className="text-slate-500">Loading project…</p>;
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link
            href="/projects"
            className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to projects
          </Link>
          <h1 className="mt-2 text-2xl font-semibold">Edit Project</h1>
        </div>
        <button
          type="button"
          onClick={handleDelete}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
        >
          <Trash2 className="h-4 w-4" />
          Delete Project
        </button>
      </div>
      {error ? (
        <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </p>
      ) : null}
      <ProjectForm initial={initial} onSubmit={handleSubmit} saving={saving} />
    </div>
  );
}
