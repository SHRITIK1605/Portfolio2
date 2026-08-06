export default function ImpactLoading() {
  return (
    <div className="min-h-screen bg-cream pb-[48px]">
      <div className="mx-auto max-w-[1100px] animate-pulse px-[16px] pt-[24px] sm:px-[24px] sm:pt-[32px] md:px-[48px] md:pt-[40px]">
        <div className="h-[36px] w-[min(420px,70%)] rounded-lg bg-forest/10 sm:h-[48px]" />
        <div className="mt-[18px] space-y-[10px] sm:mt-[24px]">
          <div className="h-[14px] w-full max-w-[720px] rounded bg-forest/8" />
          <div className="h-[14px] w-full max-w-[640px] rounded bg-forest/8" />
          <div className="h-[14px] w-full max-w-[520px] rounded bg-forest/8" />
        </div>
        <div className="mt-[24px] h-[420px] rounded-[20px] bg-forest/6 sm:mt-[32px]" />
        <div className="mx-auto mt-[32px] h-[56px] max-w-[1100px] rounded-[28px] bg-forest/6 sm:mt-[40px] sm:rounded-full md:mt-[48px]" />
      </div>
    </div>
  );
}
