import { cn } from "@/lib/utils/cn";

export type LoadingSkeletonProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Accessible label for screen readers */
  label?: string;
};

export function LoadingSkeleton({
  label = "Loading",
  className,
  ...props
}: LoadingSkeletonProps) {
  return (
    <div
      role="status"
      aria-label={label}
      className={cn(
        "animate-pulse rounded-2xl bg-border",
        className,
      )}
      {...props}
    >
      <span className="sr-only">{label}</span>
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
