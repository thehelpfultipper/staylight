import { cn } from "@/lib/utils/cn";

export type LoadingSkeletonProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Accessible label for screen readers */
  label?: string;
  /** When true, skeleton is decorative inside a parent loading region */
  decorative?: boolean;
};

export function LoadingSkeleton({
  label = "Loading",
  decorative = false,
  className,
  ...props
}: LoadingSkeletonProps) {
  return (
    <div
      role={decorative ? undefined : "status"}
      aria-hidden={decorative ? true : undefined}
      aria-label={decorative ? undefined : label}
      className={cn("animate-pulse rounded-2xl bg-border", className)}
      {...props}
    >
      {!decorative && <span className="sr-only">{label}</span>}
    </div>
  );
}

export type LoadingSkeletonGroupProps = {
  count?: number;
  className?: string;
};

export function LoadingSkeletonGroup({
  count = 3,
  className,
}: LoadingSkeletonGroupProps) {
  return (
    <div className={cn("grid gap-6 sm:grid-cols-2 lg:grid-cols-3", className)}>
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          className="overflow-hidden rounded-3xl border border-border bg-surface shadow-soft"
        >
          <LoadingSkeleton className="aspect-[4/3] rounded-none" />
          <div className="space-y-3 p-6">
            <LoadingSkeleton className="h-5 w-3/4" />
            <LoadingSkeleton className="h-4 w-1/2" />
            <LoadingSkeleton className="h-4 w-1/3" />
          </div>
        </div>
      ))}
    </div>
  );
}
