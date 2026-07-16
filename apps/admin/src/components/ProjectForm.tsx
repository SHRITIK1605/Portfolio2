"use client";

import { useEffect, useState } from "react";
import { slugify } from "@/lib/slug";

interface ProjectFormProps {
  initial?: Record<string, unknown>;
  onSubmit: (data: FormData) => Promise<void>;
  saving: boolean;
}

const CARD_ASPECT = "aspect-[16/10]";

export default function ProjectForm({ initial, onSubmit, saving }: ProjectFormProps) {
  const [coverPreview, setCoverPreview] = useState<string | null>(
    typeof initial?.coverImageUrl === "string" ? initial.coverImageUrl : null
  );
  const [slug, setSlug] = useState(String(initial?.slug ?? ""));
  const [slugTouched, setSlugTouched] = useState(Boolean(initial?.slug));

  useEffect(() => {
    return () => {
      if (coverPreview?.startsWith("blob:")) {
        URL.revokeObjectURL(coverPreview);
      }
    };
  }, [coverPreview]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    await onSubmit(new FormData(e.currentTarget));
  }

  function handleCoverChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (coverPreview?.startsWith("blob:")) {
      URL.revokeObjectURL(coverPreview);
    }
    setCoverPreview(URL.createObjectURL(file));
  }

  const inputClass =
    "mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-teal-500";

  return (
    <form onSubmit={handleSubmit} className="mt-6 max-w-2xl space-y-5">
      {typeof initial?.id === "string" ? (
        <input type="hidden" name="projectId" value={initial.id} />
      ) : null}

      <label className="block text-sm font-medium">
        Title
        <input
          name="title"
          defaultValue={String(initial?.title ?? "")}
          className={inputClass}
          required
          onChange={(e) => {
            if (!slugTouched) {
              setSlug(slugify(e.target.value));
            }
          }}
        />
      </label>

      <label className="block text-sm font-medium">
        Slug
        <span className="ml-1 font-normal text-slate-500">(URL-safe, e.g. slikk-ai-catalog)</span>
        <input
          name="slug"
          value={slug}
          onChange={(e) => {
            setSlugTouched(true);
            setSlug(slugify(e.target.value));
          }}
          className={inputClass}
          required
          pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
          title="Use lowercase letters, numbers, and hyphens only"
        />
      </label>

      <label className="block text-sm font-medium">
        Short Description
        <span className="ml-1 font-normal text-slate-500">(shown on project card)</span>
        <textarea
          name="shortDescription"
          defaultValue={String(initial?.shortDescription ?? "")}
          rows={2}
          className={inputClass}
          required
        />
      </label>

      <label className="block text-sm font-medium">
        Long Description
        <span className="ml-1 font-normal text-slate-500">(shown on project detail page)</span>
        <textarea
          name="longDescription"
          defaultValue={String(initial?.longDescription ?? "")}
          rows={5}
          className={inputClass}
          required
        />
      </label>

      <label className="block text-sm font-medium">
        Tags
        <span className="ml-1 font-normal text-slate-500">(comma-separated)</span>
        <input
          name="tags"
          defaultValue={
            Array.isArray(initial?.tags) ? (initial.tags as string[]).join(", ") : ""
          }
          className={inputClass}
        />
      </label>

      <div>
        <p className="text-sm font-medium">Thumbnail</p>
        <p className="mt-0.5 text-xs text-slate-500">
          Card preview — 16:10 aspect ratio (matches homepage project cards)
        </p>
        <div
          className={`mt-3 w-full max-w-[480px] overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 ${CARD_ASPECT}`}
        >
          {coverPreview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={coverPreview}
              alt="Cover preview"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-slate-400">
              Upload a cover image to preview
            </div>
          )}
        </div>
        <input
          name="coverImage"
          type="file"
          accept="image/*"
          onChange={handleCoverChange}
          className="mt-3 block w-full text-sm"
        />
      </div>

      <label className="block text-sm font-medium">
        Project PDF
        {initial?.pdfFileName ? (
          <span className="ml-2 font-normal text-slate-500">
            Current: {String(initial.pdfFileName)}
          </span>
        ) : null}
        <input name="pdf" type="file" accept="application/pdf" className="mt-1 block w-full text-sm" />
      </label>

      <label className="block text-sm font-medium">
        Detailed Data for AI
        <span className="ml-1 font-normal text-slate-500">
          (KPIs, decisions, outcomes — used by the portfolio chat assistant)
        </span>
        <textarea
          name="aiContext"
          defaultValue={String(initial?.aiContext ?? "")}
          rows={6}
          className={inputClass}
          placeholder="Add structured notes: problem, approach, metrics, learnings…"
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium">
          GitHub Link
          <input
            name="githubUrl"
            defaultValue={String(initial?.githubUrl ?? "")}
            className={inputClass}
          />
        </label>
        <label className="block text-sm font-medium">
          Figma Link
          <input
            name="figmaUrl"
            defaultValue={String(initial?.figmaUrl ?? "")}
            className={inputClass}
          />
        </label>
      </div>

      <label className="block text-sm font-medium">
        Priority
        <input
          name="priority"
          type="number"
          defaultValue={Number(initial?.priority ?? 0)}
          className={inputClass}
        />
      </label>

      <label className="flex items-center gap-2 text-sm">
        <input
          name="published"
          type="checkbox"
          defaultChecked={Boolean(initial?.published)}
        />
        Published (visible on portfolio website)
      </label>

      <button
        type="submit"
        disabled={saving}
        className="rounded-lg bg-teal-500 px-5 py-2.5 font-medium text-slate-950 hover:bg-teal-400 disabled:opacity-60"
      >
        {saving ? "Saving…" : "Save Project"}
      </button>
    </form>
  );
}
