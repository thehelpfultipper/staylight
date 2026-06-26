import { cn } from "@/lib/utils/cn";

export type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  padding?: "none" | "sm" | "md" | "lg";
  elevated?: boolean;
};

const paddingStyles = {
  none: "",
  sm: "p-4 sm:p-5",
  md: "p-5 sm:p-6 lg:p-8",
  lg: "p-5 sm:p-8 lg:p-10",
};

export function Card({
  padding = "md",
  elevated = true,
  className,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-border bg-surface",
        elevated && "shadow-soft",
        paddingStyles[padding],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
