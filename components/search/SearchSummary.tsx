import { formatDisplayDate } from "@/lib/utils/dates";

type SearchSummaryProps = {
  destination: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  count: number;
  nights?: number;
};

export function SearchSummary({
  destination,
  checkIn,
  checkOut,
  guests,
  count,
  nights,
}: SearchSummaryProps) {
  const guestLabel = guests === 1 ? "1 guest" : `${guests} guests`;
  const stayLabel = count === 1 ? "1 stay" : `${count} stays`;

  return (
    <div
      className="rounded-3xl border border-border bg-surface px-5 py-4 shadow-soft sm:px-6 sm:py-5"
      aria-label="Search summary"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 space-y-1">
          <p className="text-sm font-medium uppercase tracking-widest text-muted">
            Results for
          </p>
          <p className="truncate text-xl font-semibold tracking-tight text-foreground">
            {destination}
          </p>
          <p className="text-sm text-muted">
            {formatDisplayDate(checkIn)} – {formatDisplayDate(checkOut)}
            <span aria-hidden className="mx-2 text-border-strong">
              ·
            </span>
            {guestLabel}
            {nights !== undefined && nights > 0 && (
              <>
                <span aria-hidden className="mx-2 text-border-strong">
                  ·
                </span>
                {nights} {nights === 1 ? "night" : "nights"}
              </>
            )}
          </p>
        </div>

        <p className="shrink-0 text-sm font-medium tabular-nums text-foreground sm:text-right">
          {stayLabel} found
        </p>
      </div>
    </div>
  );
}
