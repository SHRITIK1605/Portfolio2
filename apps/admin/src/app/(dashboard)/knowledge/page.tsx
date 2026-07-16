"use client";

import { useEffect, useState } from "react";
import { Trash2, Upload } from "lucide-react";

interface Document {
  id: string;
  title: string;
  type: string;
  scope: string;
  fileName: string;
  project?: { title: string } | null;
  createdAt: string;
}

export default function KnowledgePage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [uploading, setUploading] = useState(false);

  async function load() {
    const res = await fetch("/api/documents");
    const data = await res.json();
    setDocuments(data.documents ?? []);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleUpload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setUploading(true);
    const formData = new FormData(e.currentTarget);
    formData.append("file", formData.get("file") as File);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.documentId) {
        await fetch("/api/documents/ingest", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ documentId: data.documentId }),
        });
      }
      e.currentTarget.reset();
      await load();
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete document and embeddings?")) return;
    await fetch(`/api/documents?id=${id}`, { method: "DELETE" });
    await load();
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold">Knowledge Base</h1>
      <p className="mt-1 text-slate-500">
        Upload documents for RAG — resume, case studies, research notes
      </p>

      <form
        onSubmit={handleUpload}
        className="mt-8 max-w-xl space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <label className="block text-sm font-medium">
          Title
          <input name="title" className="mt-1 w-full rounded-lg border px-3 py-2" required />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-medium">
            Type
            <select name="type" className="mt-1 w-full rounded-lg border px-3 py-2">
              <option value="CASE_STUDY">Case Study</option>
              <option value="RESEARCH">Research Notes</option>
              <option value="OTHER">Other</option>
              <option value="RESUME">Resume</option>
            </select>
          </label>
          <label className="block text-sm font-medium">
            Scope
            <select name="scope" className="mt-1 w-full rounded-lg border px-3 py-2">
              <option value="GLOBAL">Global Knowledge</option>
              <option value="PROJECT">Specific Project</option>
            </select>
          </label>
        </div>
        <label className="block text-sm font-medium">
          PDF File
          <input name="file" type="file" accept="application/pdf" className="mt-1 block w-full" required />
        </label>
        <button
          type="submit"
          disabled={uploading}
          className="inline-flex items-center gap-2 rounded-lg bg-teal-500 px-4 py-2 text-sm font-medium text-slate-950"
        >
          <Upload className="h-4 w-4" />
          {uploading ? "Processing…" : "Upload & Index"}
        </button>
      </form>

      <div className="mt-8 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-slate-50 text-slate-500">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Scope</th>
              <th className="px-4 py-3">Project</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {documents.map((doc) => (
              <tr key={doc.id} className="border-b border-slate-100">
                <td className="px-4 py-3 font-medium">{doc.title}</td>
                <td className="px-4 py-3">{doc.type}</td>
                <td className="px-4 py-3">{doc.scope}</td>
                <td className="px-4 py-3">{doc.project?.title ?? "—"}</td>
                <td className="px-4 py-3">
                  <button type="button" onClick={() => handleDelete(doc.id)} className="text-red-500">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
