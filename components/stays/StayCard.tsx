import Image from "next/image";
import { SmartMatchBadge } from "@/components/stays/SmartMatchBadge";
import { Badge } from "@/components/ui/Badge";
import { LinkButton } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { formatCurrency } from "@/lib/utils/money";
import type { SearchResultApiItem } from "@/types/api";

type StayCardProps = {
  result: SearchResultApiItem;
  detailHref: string;
};

const AMENITY_LABELS: Record<string, string> = {
  wifi: "WiFi",
  breakfast: "Breakfast",
  "city-view": "City view",
  concierge: "Concierge",
  "air-conditioning": "A/C",
  workspace: "Workspace",
  kitchen: "Kitchen",
  laundry: "Laundry",
  "family-friendly": "Family friendly",
  parking: "Parking",
  pool: "Pool",
  gym: "Gym",
  spa: "Spa",
};

function formatAmenity(slug: string): string {
  return AMENITY_LABELS[slug] ?? slug.replace(/-/g, " ");
}

export function StayCard({ result, detailHref }: StayCardProps) {
  const { stay, totalPrice, nights, smartMatch } = result;
  const amenityPreview = stay.amenities.slice(0, 4);
  const firstTradeoff = smartMatch.tradeoffs[0];

  return (
    <Card padding="none" className="overflow-hidden">
      <article className="flex flex-col lg:flex-row">
        <div className="relative aspect-[16/10] shrink-0 overflow-hidden bg-border lg:aspect-auto lg:w-72 xl:w-80">
          {stay.imageUrl ? (
            <Image
              src={stay.imageUrl}
              alt={`${stay.name} in ${stay.city}`}
              fill
              sizes="(max-width: 1024px) 100vw, 320px"
              className="object-cover"
            />
          ) : (
            <div className="h-full min-h-[200px] w-full bg-border" aria-hidden />
          )}
          {stay.freeCancellation && (
            <div className="absolute left-4 top-4">
              <Badge variant="success">Free cancellation</Badge>
            </div>
          )}
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-5 p-5 sm:p-6 lg:p-8">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold tracking-tight text-foreground">
              {stay.name}
            </h2>
            <p className="text-sm text-muted">
              {stay.city}, {stay.country}
            </p>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
              <span>
                <span className="font-medium tabular-nums text-foreground">
                  {stay.rating.toFixed(1)}
                </span>{" "}
                · {stay.reviewCount} review{stay.reviewCount === 1 ? "" : "s"}
              </span>
              <span aria-hidden>·</span>
              <span>{stay.distanceFromCenterKm} km from center</span>
            </div>
          </div>

          {amenityPreview.length > 0 && (
            <ul className="flex flex-wrap gap-2" aria-label="Amenities">
              {amenityPreview.map((amenity) => (
                <li key={amenity}>
                  <Badge variant="muted">{formatAmenity(amenity)}</Badge>
                </li>
              ))}
            </ul>
          )}

          <div className="space-y-3">
            <SmartMatchBadge smartMatch={smartMatch} />

            {firstTradeoff && (
              <p className="text-sm text-muted">
                <span className="font-medium text-foreground">Tradeoff:</span>{" "}
                {firstTradeoff}
              </p>
            )}
          </div>

          <p className="text-sm text-muted">
            {stay.availableRooms} room{stay.availableRooms === 1 ? "" : "s"}{" "}
            available
          </p>
        </div>

        <div className="flex flex-col justify-between gap-5 border-t border-border p-5 sm:p-6 lg:w-56 lg:border-l lg:border-t-0 lg:p-8 xl:w-64">
          <div className="space-y-1">
            <p className="text-lg font-semibold tabular-nums text-foreground">
              {formatCurrency(stay.pricePerNight)}
              <span className="text-sm font-normal text-muted"> / night</span>
            </p>
            <p className="text-sm tabular-nums text-muted">
              {formatCurrency(totalPrice)} total · {nights}{" "}
              {nights === 1 ? "night" : "nights"}
            </p>
          </div>

          <LinkButton href={detailHref} variant="primary" size="md" fullWidth className="mt-auto">
            View details
          </LinkButton>
        </div>
      </article>
    </Card>
  );
}
