import Image from "next/image";
import { PriceBreakdown } from "@/components/checkout/PriceBreakdown";
import { Card } from "@/components/ui/Card";
import { formatDisplayDate } from "@/lib/utils/dates";
import type { Stay } from "@/types/stay";

type CheckoutSummaryProps = {
  stay: Stay;
  checkIn: string;
  checkOut: string;
  guests: number;
  nights: number;
};

export function CheckoutSummary({
  stay,
  checkIn,
  checkOut,
  guests,
  nights,
}: CheckoutSummaryProps) {
  return (
    <Card className="sticky top-8 space-y-6">
      <div className="overflow-hidden rounded-2xl">
        <Image
          src={stay.images[0]}
          alt={`${stay.name} in ${stay.city}`}
          width={640}
          height={360}
          className="aspect-[16/10] w-full object-cover"
          priority
        />
      </div>

      <div className="space-y-1">
        <h2 className="text-lg font-semibold tracking-tight text-foreground">
          {stay.name}
        </h2>
        <p className="text-sm text-muted">
          {stay.city}, {stay.country}
        </p>
      </div>

      <dl className="space-y-2 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-muted">Dates</dt>
          <dd className="text-right font-medium text-foreground">
            {formatDisplayDate(checkIn)} – {formatDisplayDate(checkOut)}
          </dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-muted">Guests</dt>
          <dd className="font-medium text-foreground">
            {guests} guest{guests === 1 ? "" : "s"}
          </dd>
        </div>
      </dl>

      <PriceBreakdown
        pricePerNight={stay.pricePerNight}
        nights={nights}
        serviceFee={0}
      />
    </Card>
  );
}
