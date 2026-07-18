export default function ProjectLoading() {
  return (
    <div className="min-h-screen bg-cream pb-[48px]">
      <div className="mx-auto max-w-[1100px] animate-pulse px-[48px] pt-[40px]">
        <div className="h-[52px] w-[min(420px,70%)] rounded-lg bg-forest/10" />
        <div className="mt-[20px] flex gap-[10px]">
          <div className="h-[32px] w-[88px] rounded-full bg-forest/8" />
          <div className="h-[32px] w-[72px] rounded-full bg-forest/8" />
          <div className="h-[32px] w-[96px] rounded-full bg-forest/8" />
        </div>
        <div className="mt-[24px] space-y-[10px]">
          <div className="h-[14px] w-full max-w-[720px] rounded bg-forest/8" />
          <div className="h-[14px] w-full max-w-[640px] rounded bg-forest/8" />
        </div>
        <div className="mt-[32px] h-[420px] rounded-[20px] bg-forest/6" />
      </div>
    </div>
  );
}
