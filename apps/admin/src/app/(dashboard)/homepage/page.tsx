"use client";

import { useEffect, useState } from "react";

type CraftSlot = {
  src: string;
  alt: string;
  caption: string;
  rotate: number;
};

const EMPTY_SLOT: CraftSlot = {
  src: "",
  alt: "",
  caption: "",
  rotate: -4,
};

export default function HomepagePage() {
  const [form, setForm] = useState({
    heroHeading: "",
    heroSubtitle: "",
    aboutMe: "",
    resumeUrl: "",
    socialLinks: { github: "", linkedin: "", twitter: "", email: "" },
  });
  const [craftImages, setCraftImages] = useState<CraftSlot[]>([
    { ...EMPTY_SLOT, rotate: -6, caption: "sketches" },
    { ...EMPTY_SLOT, rotate: 5, caption: "build days" },
    { ...EMPTY_SLOT, rotate: -3, caption: "late reads" },
    { ...EMPTY_SLOT, rotate: 7, caption: "make stuff" },
  ]);
  const [saving, setSaving] = useState(false);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const [message, setMessage] = useState("");

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
          socialLinks:
            (s.socialLinks as typeof form.socialLinks) ?? form.socialLinks,
        });
        if (Array.isArray(s.craftImages) && s.craftImages.length > 0) {
          setCraftImages(
            s.craftImages.map(
              (img: Partial<CraftSlot>, i: number) =>
                ({
                  src: img.src ?? "",
                  alt: img.alt ?? "",
                  caption: img.caption ?? "",
                  rotate: typeof img.rotate === "number" ? img.rotate : [-6, 5, -3, 7][i] ?? -4,
                }) satisfies CraftSlot
            )
          );
        }
      });
  }, []);

  async function uploadCraft(index: number, file: File) {
    setUploadingIndex(index);
    setMessage("");
    try {
      const body = new FormData();
      body.append("craftImage", file);
      const res = await fetch("/api/upload", { method: "POST", body });
      const data = await res.json();
      if (!res.ok || !data.craftImageUrl) {
        throw new Error(data.error ?? "Upload failed");
      }
      setCraftImages((prev) =>
        prev.map((slot, i) =>
          i === index ? { ...slot, src: data.craftImageUrl as string } : slot
        )
      );
      setMessage(`Craft image ${index + 1} uploaded.`);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploadingIndex(null);
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    const cleaned = craftImages
      .filter((img) => img.src.trim())
      .map((img) => ({
        src: img.src.trim(),
        alt: img.alt.trim() || "Craft photo",
        caption: img.caption.trim(),
        rotate: img.rotate,
      }));
    await fetch("/api/homepage", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, craftImages: cleaned }),
    });
    setSaving(false);
    setMessage("Homepage saved.");
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

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <h2 className="text-base font-semibold text-slate-900">
            Experience craft polaroids
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Upload or paste image URLs for the scrapbook photos beside Experience.
            Leave empty to use the built-in defaults.
          </p>
          <div className="mt-4 space-y-4">
            {craftImages.map((slot, index) => (
              <div
                key={index}
                className="rounded-lg border border-slate-200 bg-white p-3"
              >
                <div className="mb-2 flex items-center justify-between gap-2">
                  <span className="text-sm font-medium">Photo {index + 1}</span>
                  {slot.src ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={slot.src}
                      alt=""
                      className="h-12 w-12 rounded object-cover"
                    />
                  ) : null}
                </div>
                <label className="block text-xs font-medium text-slate-600">
                  Image URL
                  <input
                    value={slot.src}
                    onChange={(e) =>
                      setCraftImages((prev) =>
                        prev.map((s, i) =>
                          i === index ? { ...s, src: e.target.value } : s
                        )
                      )
                    }
                    placeholder="/experience/craft/polaroid-notebook.jpg"
                    className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
                  />
                </label>
                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                  <label className="block text-xs font-medium text-slate-600">
                    Caption
                    <input
                      value={slot.caption}
                      onChange={(e) =>
                        setCraftImages((prev) =>
                          prev.map((s, i) =>
                            i === index ? { ...s, caption: e.target.value } : s
                          )
                        )
                      }
                      className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
                    />
                  </label>
                  <label className="block text-xs font-medium text-slate-600">
                    Upload
                    <input
                      type="file"
                      accept="image/*"
                      disabled={uploadingIndex === index}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) void uploadCraft(index, file);
                        e.target.value = "";
                      }}
                      className="mt-1 block w-full text-sm"
                    />
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>

        {message ? (
          <p className="text-sm text-slate-600">{message}</p>
        ) : null}

        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-teal-500 px-4 py-2 text-sm font-medium text-slate-950"
        >
          {saving ? "Saving…" : "Save Homepage"}
        </button>
      </form>
    </div>
  );
}
