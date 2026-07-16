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
    <section className="mx-auto max-w-[760px] px-[48px] pb-[88px] pt-[72px]">
      <h1 className="m-0 mb-[28px] text-[60px] font-bold leading-[1.06] tracking-[-0.03em] text-forest">
        {homepage.heroHeading}
      </h1>
      <p className="m-0 max-w-[620px] text-[42px] font-semibold leading-[1.16] tracking-[-0.025em] text-forest/80">
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
