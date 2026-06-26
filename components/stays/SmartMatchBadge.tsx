import { cn } from "@/lib/utils/cn";
import type { SmartMatch } from "@/types/search";

type SmartMatchBadgeProps = {
  smartMatch: SmartMatch;
  className?: string;
};

function scoreTone(label: SmartMatch["label"]): {
  container: string;
  score: string;
} {
  switch (label) {
    case "Excellent match":
      return {
        container: "border-emerald-200/70 bg-emerald-50/80",
        score: "text-emerald-900",
      };
    case "Good match":
      return {
        container: "border-border-strong bg-background",
        score: "text-foreground",
      };
    case "Fair match":
      return {
        container: "border-amber-200/70 bg-amber-50/60",
        score: "text-amber-950",
      };
  }
}

export function SmartMatchBadge({ smartMatch, className }: SmartMatchBadgeProps) {
  const { score, label, reasons } = smartMatch;
  const tone = scoreTone(label);
  const visibleReasons = reasons.slice(0, 3);
  const headingId = `smart-match-${score}-${label.replace(/\s+/g, "-").toLowerCase()}`;

  return (
    <section
      aria-labelledby={headingId}
      className={cn(
        "rounded-2xl border px-4 py-3",
        tone.container,
        className,
      )}
    >
      <p
        id={headingId}
        className={cn("text-sm font-semibold tracking-tight", tone.score)}
      >
        {label} · {score}%
      </p>

      {visibleReasons.length > 0 && (
        <ul
          className="mt-2 space-y-1 text-sm leading-relaxed text-muted"
          aria-label="Why this stay matches your search"
        >
          {visibleReasons.map((reason) => (
            <li key={reason} className="flex gap-2">
              <span aria-hidden className="shrink-0 text-emerald-700">
                ·
              </span>
              <span>{reason}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
