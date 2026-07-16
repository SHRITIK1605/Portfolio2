import { cn } from "@/lib/utils";

export function Tag({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full bg-tag-blue px-3.5 py-1.5 text-sm font-medium text-forest",
        className
      )}
    >
      {children}
    </span>
  );
}
