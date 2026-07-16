"use client";

import { useEffect, useState } from "react";

export default function HomepagePage() {
  const [form, setForm] = useState({
    heroHeading: "",
    heroSubtitle: "",
    aboutMe: "",
    resumeUrl: "",
    socialLinks: { github: "", linkedin: "", twitter: "", email: "" },
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/homepage")
      .then((r) => r.json())
      .then((d) => {
        const s = d.settings;
        if (!s) return;
        setForm({
          heroHeading: s.heroHeading ?? "",
          heroSubtitle: s.heroSubtitle ?? "",
          aboutMe: s.aboutMe ?? "",
          resumeUrl: s.resumeUrl ?? "",
          socialLinks: (s.socialLinks as typeof form.socialLinks) ?? form.socialLinks,
        });
      });
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await fetch("/api/homepage", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold">Homepage Content</h1>
      <form onSubmit={handleSave} className="mt-8 max-w-2xl space-y-4">
        {(["heroHeading", "heroSubtitle"] as const).map((field) => (
          <label key={field} className="block text-sm font-medium capitalize">
            {field.replace(/([A-Z])/g, " $1")}
            <input
              value={form[field]}
              onChange={(e) => setForm({ ...form, [field]: e.target.value })}
              className="mt-1 w-full rounded-lg border px-3 py-2"
            />
          </label>
        ))}
        <label className="block text-sm font-medium">
          About Me
          <textarea
            value={form.aboutMe}
            onChange={(e) => setForm({ ...form, aboutMe: e.target.value })}
            rows={4}
            className="mt-1 w-full rounded-lg border px-3 py-2"
          />
        </label>
        <label className="block text-sm font-medium">
          Resume URL
          <input
            value={form.resumeUrl}
            onChange={(e) => setForm({ ...form, resumeUrl: e.target.value })}
            className="mt-1 w-full rounded-lg border px-3 py-2"
          />
        </label>
        <button type="submit" disabled={saving} className="rounded-lg bg-teal-500 px-4 py-2 text-sm font-medium text-slate-950">
          {saving ? "Saving…" : "Save Homepage"}
        </button>
      </form>
    </div>
  );
}
