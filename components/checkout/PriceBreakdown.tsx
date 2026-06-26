import { Badge } from "@/components/ui/Badge";
import { formatCurrency } from "@/lib/utils/money";

export type PriceBreakdownProps = {
  pricePerNight: number;
  nights: number;
  serviceFee?: number;
};

export function PriceBreakdown({
  pricePerNight,
  nights,
  serviceFee = 0,
}: PriceBreakdownProps) {
  const subtotal = pricePerNight * nights;
  const total = subtotal + serviceFee;

  return (
    <div className="space-y-4" aria-label="Price breakdown">
      <dl className="space-y-3 text-sm">
        <div className="flex items-center justify-between gap-4">
          <dt className="text-muted">
            {formatCurrency(pricePerNight)} × {nights}{" "}
            {nights === 1 ? "night" : "nights"}
          </dt>
          <dd className="tabular-nums font-medium text-foreground">
            {formatCurrency(subtotal)}
          </dd>
        </div>

        <div className="flex items-center justify-between gap-4">
          <dt className="text-muted">Service fee</dt>
          <dd className="tabular-nums font-medium text-foreground">
            {formatCurrency(serviceFee)}
          </dd>
        </div>
      </dl>

      <div className="border-t border-border pt-4">
        <div className="flex items-center justify-between gap-4">
          <p className="text-base font-semibold text-foreground">Total</p>
          <p className="text-lg font-semibold tabular-nums tracking-tight text-foreground">
            {formatCurrency(total)}
          </p>
        </div>
      </div>

      <Badge variant="muted" className="w-full justify-center py-1.5">
        Payment mocked for demo
      </Badge>
    </div>
  );
}
