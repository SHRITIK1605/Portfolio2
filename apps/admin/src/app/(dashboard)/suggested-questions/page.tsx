"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";

interface Question {
  id: string;
  text: string;
  category: string;
  order: number;
  active: boolean;
}

export default function SuggestedQuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [text, setText] = useState("");

  async function load() {
    const res = await fetch("/api/suggested-questions");
    const data = await res.json();
    setQuestions(data.questions ?? []);
  }

  useEffect(() => {
    load();
  }, []);

  async function addQuestion(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    await fetch("/api/suggested-questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, category: "general", order: questions.length }),
    });
    setText("");
    await load();
  }

  async function remove(id: string) {
    await fetch(`/api/suggested-questions?id=${id}`, { method: "DELETE" });
    await load();
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold">Suggested Questions</h1>
      <form onSubmit={addQuestion} className="mt-6 flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="New suggested prompt…"
          className="flex-1 rounded-lg border px-3 py-2"
        />
        <button type="submit" className="inline-flex items-center gap-1 rounded-lg bg-teal-500 px-4 py-2 text-sm font-medium text-slate-950">
          <Plus className="h-4 w-4" /> Add
        </button>
      </form>
      <ul className="mt-6 space-y-2">
        {questions.map((q) => (
          <li key={q.id} className="flex items-center justify-between rounded-lg border bg-white px-4 py-3">
            <span>{q.text}</span>
            <button type="button" onClick={() => remove(q.id)} className="text-red-500">
              <Trash2 className="h-4 w-4" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
