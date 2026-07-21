"use client";

import { useId, useLayoutEffect, useState } from "react";

/** Zigzag centerline — stretched to fill the viewport. */
const INTRO_ZIGZAG_PATH =
  "M 285.0 22.0 C 356.5 26.2 732.8 37.5 714.0 47.0 C 695.2 56.5 178.7 68.7 172.0 79.0 C 165.3 89.3 695.0 98.8 674.0 109.0 C 653.0 119.2 36.2 129.8 46.0 140.0 C 55.8 150.2 738.5 159.8 733.0 170.0 C 727.5 180.2 15.3 190.7 13.0 201.0 C 10.7 211.3 705.0 221.7 719.0 232.0 C 733.0 242.3 103.5 252.7 97.0 263.0 C 90.5 273.3 687.2 283.7 680.0 294.0 C 672.8 304.3 38.5 314.5 54.0 325.0 C 69.5 335.5 767.8 346.7 773.0 357.0 C 778.2 367.3 96.0 376.8 85.0 387.0 C 74.0 397.2 717.3 407.7 707.0 418.0 C 696.7 428.3 24.8 438.8 23.0 449.0 C 21.2 459.2 699.8 468.7 696.0 479.0 C 692.2 489.3 10.3 500.8 0.0 511.0 C -10.3 521.2 610.8 530.0 634.0 540.0 C 657.2 550.0 154.7 561.2 139.0 571.0 C 123.3 580.8 473.2 594.3 540.0 599.0";

export const INTRO_SEEN_KEY = "shritik-landing-intro-seen";

const WELCOME_MS = 1600;
const REVEAL_MS = 3400;
const FADE_MS = 500;

type Phase = "welcome" | "reveal" | "fade" | "done";

function clearBootClass() {
  document.documentElement.classList.remove("intro-boot");
  document.documentElement.style.background = "";
}

function prefersReducedMotion(): boolean {
  try {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return false;
  }
}

function shouldPlayIntro(): boolean {
  try {
    const nav = performance.getEntriesByType(
      "navigation"
    )[0] as PerformanceNavigationTiming | undefined;
    if (nav?.type === "reload") return true;
    return sessionStorage.getItem(INTRO_SEEN_KEY) !== "1";
  } catch {
    return true;
  }
}

function markIntroSeen() {
  try {
    sessionStorage.setItem(INTRO_SEEN_KEY, "1");
  } catch {
    /* ignore */
  }
}

/**
 * Full-page intro (first land / reload only):
 * solid black from first paint → welcome → zigzag reveals the real page.
 */
export default function LandingIntro({
  children,
}: {
  children: React.ReactNode;
}) {
  const rawId = useId();
  const maskId = `landing-intro-mask-${rawId.replace(/:/g, "")}`;
  // Start on welcome so SSR + first paint are already black (no page flash).
  const [phase, setPhase] = useState<Phase>("welcome");

  useLayoutEffect(() => {
    clearBootClass();

    if (prefersReducedMotion() || !shouldPlayIntro()) {
      markIntroSeen();
      setPhase("done");
      return;
    }

    setPhase("welcome");

    const tReveal = window.setTimeout(() => setPhase("reveal"), WELCOME_MS);
    const tFade = window.setTimeout(
      () => setPhase("fade"),
      WELCOME_MS + REVEAL_MS
    );
    const tDone = window.setTimeout(() => {
      markIntroSeen();
      setPhase("done");
    }, WELCOME_MS + REVEAL_MS + FADE_MS);

    return () => {
      window.clearTimeout(tReveal);
      window.clearTimeout(tFade);
      window.clearTimeout(tDone);
    };
  }, []);

  useLayoutEffect(() => {
    if (phase === "done") {
      document.body.style.overflow = "";
      document.body.style.overflowY = "";
      return;
    }
    // Lock vertical scroll only — keep overflow-x: clip from CSS so sticky works
    document.body.style.overflowY = "hidden";
    return () => {
      document.body.style.overflow = "";
      document.body.style.overflowY = "";
    };
  }, [phase]);

  const showOverlay = phase !== "done";
  const revealing = phase === "reveal" || phase === "fade";

  return (
    <>
      {children}

      {showOverlay ? (
        <div
          className={`landing-intro fixed inset-0 z-[200] h-[100dvh] w-screen overflow-hidden ${
            phase === "fade" ? "landing-intro--fade" : ""
          }`}
          style={{
            background: phase === "welcome" ? "#000" : "transparent",
          }}
          aria-hidden={phase !== "welcome"}
        >
          <svg
            className="absolute inset-0 h-full w-full"
            viewBox="0 0 775 628"
            preserveAspectRatio="none"
            role="presentation"
          >
            <defs>
              <mask
                id={maskId}
                maskUnits="userSpaceOnUse"
                x="0"
                y="0"
                width="775"
                height="628"
              >
                <rect width="775" height="628" fill="#ffffff" />
                {revealing ? (
                  <path
                    className="landing-intro-stroke"
                    d={INTRO_ZIGZAG_PATH}
                    fill="none"
                    stroke="#000000"
                    strokeWidth={300}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    pathLength={1}
                    strokeDasharray={1}
                    strokeDashoffset={1}
                  />
                ) : null}
              </mask>
            </defs>
            <rect
              width="775"
              height="628"
              fill="#000000"
              mask={`url(#${maskId})`}
            />
          </svg>

          <p
            className={`landing-intro-text pointer-events-none absolute inset-0 z-[1] m-0 flex items-center justify-center px-[24px] text-center text-[clamp(22px,4.2vw,40px)] font-medium tracking-[-0.02em] text-white ${
              phase === "welcome"
                ? "landing-intro-text--in"
                : "landing-intro-text--out"
            }`}
          >
            Welcome to my Portfolio
          </p>
        </div>
      ) : null}
    </>
  );
}
