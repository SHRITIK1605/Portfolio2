"use client";

import { useEffect, useState } from "react";

export default function PromptsPage() {
  const [systemPrompt, setSystemPrompt] = useState("");
  const [projectPrompt, setProjectPrompt] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/prompts")
      .then((r) => r.json())
      .then((d) => {
        setSystemPrompt(d.settings?.systemPrompt ?? "");
        setProjectPrompt(d.settings?.projectPrompt ?? "");
      });
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await fetch("/api/prompts", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ systemPrompt, projectPrompt }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold">AI Prompt Settings</h1>
      <p className="mt-1 max-w-2xl text-sm text-slate-500">
        Edit how the portfolio chatbot talks to recruiters. The global prompt applies on the
        homepage; the project prompt applies when viewing a specific project.
      </p>
      <form onSubmit={handleSave} className="mt-8 max-w-3xl space-y-5">
        <label className="block text-sm font-medium">
          Global System Prompt
          <span className="ml-1 font-normal text-slate-500">(recruiter-facing chat)</span>
          <textarea
            value={systemPrompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
            rows={10}
            className="mt-1 w-full rounded-lg border px-3 py-2 font-mono text-sm"
          />
        </label>
        <label className="block text-sm font-medium">
          Project Assistant Prompt
          <textarea
            value={projectPrompt}
            onChange={(e) => setProjectPrompt(e.target.value)}
            rows={8}
            className="mt-1 w-full rounded-lg border px-3 py-2 font-mono text-sm"
          />
        </label>
        <button type="submit" disabled={saving} className="rounded-lg bg-teal-500 px-4 py-2 text-sm font-medium text-slate-950">
          {saving ? "Saving…" : saved ? "Saved!" : "Save Prompts"}
        </button>
      </form>
    </div>
  );
}
