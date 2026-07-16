import { cn } from "@/lib/utils";
import { forwardRef } from "react";

type Variant = "outline" | "primary" | "ghost";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

const variants: Record<Variant, string> = {
  outline:
    "border-[1.5px] border-forest bg-transparent text-forest hover:bg-forest/5",
  primary:
    "border-[1.5px] border-forest bg-btn-cream text-forest hover:bg-[#fde68a]",
  ghost: "border border-transparent text-forest hover:bg-forest/5",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "outline", children, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition-all",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
);

Button.displayName = "Button";
