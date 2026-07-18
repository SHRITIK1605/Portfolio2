import type { HomepageSettings } from "@/types";

interface HeroProps {
  homepage: HomepageSettings;
}

export default function Hero({ homepage }: HeroProps) {
  const subtitleLines = homepage.heroSubtitle.includes("\n")
    ? homepage.heroSubtitle.split("\n")
    : [
        "I build products by",
        "questioning what",
        "everyone else",
        "accepts as given.",
      ];

  return (
    <section className="mx-auto max-w-[760px] px-[20px] pb-[48px] pt-[40px] sm:px-[32px] sm:pb-[64px] sm:pt-[56px] md:px-[48px] md:pb-[88px] md:pt-[72px]">
      <h1 className="m-0 mb-[16px] text-[36px] font-bold leading-[1.08] tracking-[-0.03em] text-forest sm:mb-[22px] sm:text-[48px] md:mb-[28px] md:text-[60px] md:leading-[1.06]">
        {homepage.heroHeading}
      </h1>
      <p className="m-0 max-w-[620px] text-[24px] font-semibold leading-[1.2] tracking-[-0.02em] text-forest/80 sm:text-[32px] sm:leading-[1.18] md:text-[42px] md:leading-[1.16] md:tracking-[-0.025em]">
        {subtitleLines.map((line, index) => (
          <span key={`${line}-${index}`}>
            {line}
            {index < subtitleLines.length - 1 ? <br /> : null}
          </span>
        ))}
      </p>
    </section>
  );
}
