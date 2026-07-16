"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import ProjectForm from "@/components/ProjectForm";

export default function NewProjectPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(data: FormData) {
    setSaving(true);
    setError("");
    try {
      const uploadRes = await fetch("/api/upload", { method: "POST", body: data });
      const uploadData = await uploadRes.json();
      if (!uploadRes.ok) throw new Error(uploadData.error ?? "Upload failed");

      const tags = String(data.get("tags") ?? "")
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const res = await fetch("/api/projects", {
        method: "POST",
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
          coverImageUrl: uploadData.coverImageUrl ?? null,
          pdfUrl: uploadData.pdfUrl ?? null,
          pdfFileName: uploadData.pdfFileName ?? null,
        }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error ?? "Failed to create project");

      if (uploadData.documentId) {
        await fetch("/api/documents/ingest", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            documentId: uploadData.documentId,
            projectId: result.project.id,
          }),
        });
      }

      await fetch("/api/documents/ingest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId: result.project.id }),
      });

      router.push("/projects");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold">Create Project</h1>
      {error ? (
        <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </p>
      ) : null}
      <ProjectForm onSubmit={handleSubmit} saving={saving} />
    </div>
  );
}
