import Navbar from "@/components/layout/Navbar";
import ChatPanel from "@/components/chat/ChatPanel";
import PdfFrame from "@/components/project/PdfFrame";
import { getHomepageSettings } from "@/lib/data";
import type { HomepageSettings } from "@/types";

export const dynamic = "force-dynamic";

const DEFAULT_HOMEPAGE: HomepageSettings = {
  heroHeading: "Hi, I'm Shritik.",
  heroSubtitle: "",
  aboutMe: null,
  resumeUrl: null,
  socialLinks: null,
};

export default async function ResumePage() {
  let homepage = null;

  try {
    homepage = await getHomepageSettings();
  } catch (error) {
    console.error("Resume page DB error:", error);
  }

  const settings: HomepageSettings = homepage
    ? {
        heroHeading: homepage.heroHeading,
        heroSubtitle: homepage.heroSubtitle,
        aboutMe: homepage.aboutMe,
        resumeUrl: homepage.resumeUrl,
        socialLinks: homepage.socialLinks as Record<string, string> | null,
      }
    : DEFAULT_HOMEPAGE;

  return (
    <div className="min-h-screen bg-cream pb-[48px]">
      <Navbar homepage={settings} />
      <main className="mx-auto max-w-[1100px] px-[48px] pt-[40px]">
        <h1 className="m-0 font-serif text-[48px] font-normal leading-[1.08] tracking-[-0.02em] text-forest">
          Resume
        </h1>

        <div className="mt-[32px]">
          {settings.resumeUrl ? (
            <PdfFrame url="/api/resume" />
          ) : (
            <div className="flex min-h-[300px] items-center justify-center rounded-[20px] border border-forest/10 bg-white text-[14px] text-forest/50">
              No resume has been added yet.
            </div>
          )}
        </div>
      </main>
      <ChatPanel />
    </div>
  );
}
