import { Badge } from "@/components/ui/Badge";
import { LinkButton } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { formatDisplayDate } from "@/lib/utils/dates";
import { formatCurrency } from "@/lib/utils/money";
import type { Stay } from "@/types/stay";

type BookingSidebarProps = {
  stay: Stay;
  checkIn?: string;
  checkOut?: string;
  guests: number;
  estimatedTotal: { nights: number; total: number } | null;
  checkoutHref: string;
  className?: string;
};

export function BookingSidebar({
  stay,
  checkIn,
  checkOut,
  guests,
  estimatedTotal,
  checkoutHref,
  className,
}: BookingSidebarProps) {
  return (
    <Card className={className}>
      <div className="space-y-5">
        <div>
          <p className="text-sm text-muted">From</p>
          <p className="text-2xl font-semibold tabular-nums tracking-tight text-foreground">
            {formatCurrency(stay.pricePerNight)}
            <span className="text-base font-normal text-muted"> / night</span>
          </p>
        </div>

        {estimatedTotal && (
          <div className="rounded-2xl border border-border bg-background px-4 py-3">
            <p className="text-sm font-medium text-foreground">Estimated total</p>
            <p className="mt-1 text-lg font-semibold tabular-nums text-foreground">
              {formatCurrency(estimatedTotal.total)}
            </p>
            <p className="mt-1 text-sm text-muted">
              {estimatedTotal.nights}{" "}
              {estimatedTotal.nights === 1 ? "night" : "nights"}
              {checkIn && checkOut && (
                <>
                  {" "}
                  · {formatDisplayDate(checkIn)} – {formatDisplayDate(checkOut)}
                </>
              )}
            </p>
          </div>
        )}

        {checkIn && checkOut && (
          <p className="text-sm text-muted">
            {guests} guest{guests === 1 ? "" : "s"}
          </p>
        )}

        <p className="text-sm text-muted">
          <span className="font-medium text-foreground">
            {stay.availableRooms}
          </span>{" "}
          room{stay.availableRooms === 1 ? "" : "s"} left
        </p>

        {stay.freeCancellation && (
          <Badge variant="success">Free cancellation</Badge>
        )}

        <LinkButton href={checkoutHref} variant="primary" size="lg" fullWidth>
          Book now
        </LinkButton>

        <p className="text-center text-xs text-muted">
          You won&apos;t be charged — demo checkout only
        </p>
      </div>
    </Card>
  );
}
