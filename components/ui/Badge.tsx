import { cn } from "@/lib/utils/cn";

type BadgeVariant = "default" | "muted" | "success";

export type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant;
};

const variantStyles: Record<BadgeVariant, string> = {
  default: "border-border bg-background text-foreground",
  muted: "border-transparent bg-background text-muted",
  success: "border-emerald-200/60 bg-emerald-50 text-emerald-800",
};

export function Badge({
  variant = "default",
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium tracking-wide",
        variantStyles[variant],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
