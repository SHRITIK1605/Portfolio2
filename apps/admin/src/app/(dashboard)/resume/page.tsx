"use client";

import { useEffect, useState } from "react";

export default function ResumePage() {
  const [resumeUrl, setResumeUrl] = useState("");
  const [driveLink, setDriveLink] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/homepage")
      .then((r) => r.json())
      .then((d) => {
        setResumeUrl(d.settings?.resumeUrl ?? "");
        setDriveLink(d.settings?.resumeUrl ?? "");
      });
  }, []);

  async function handleUpload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    const formData = new FormData(e.currentTarget);
    await fetch("/api/upload", { method: "POST", body: formData });
    const res = await fetch("/api/homepage");
    const data = await res.json();
    setResumeUrl(data.settings?.resumeUrl ?? "");
    setSaving(false);
  }

  async function saveDriveLink(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await fetch("/api/homepage", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resumeUrl: driveLink }),
    });
    setResumeUrl(driveLink);
    setSaving(false);
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold">Resume</h1>
      <p className="mt-1 text-slate-500">Upload resume or set Google Drive link</p>

      <form onSubmit={saveDriveLink} className="mt-8 max-w-xl space-y-4 rounded-xl border bg-white p-6 shadow-sm">
        <label className="block text-sm font-medium">
          Google Drive / Resume URL
          <input
            value={driveLink}
            onChange={(e) => setDriveLink(e.target.value)}
            className="mt-1 w-full rounded-lg border px-3 py-2"
            placeholder="https://drive.google.com/..."
          />
        </label>
        <button type="submit" disabled={saving} className="rounded-lg bg-teal-500 px-4 py-2 text-sm font-medium text-slate-950">
          Save Link
        </button>
      </form>

      <form onSubmit={handleUpload} className="mt-6 max-w-xl space-y-4 rounded-xl border bg-white p-6 shadow-sm">
        <label className="block text-sm font-medium">
          Upload Resume PDF
          <input name="resume" type="file" accept="application/pdf" className="mt-1 block w-full" />
        </label>
        <button type="submit" disabled={saving} className="rounded-lg border px-4 py-2 text-sm">
          Upload & Replace
        </button>
      </form>

      {resumeUrl ? (
        <div className="mt-6">
          <a href={resumeUrl} target="_blank" rel="noreferrer" className="text-teal-600 underline">
            Preview current resume
          </a>
        </div>
      ) : null}
    </div>
  );
}
