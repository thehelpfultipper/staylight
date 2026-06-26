import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { formatCurrency } from "@/lib/utils/money";
import type { StayCard } from "@/types/stay";

const STAY_TYPE_LABELS: Record<StayCard["stayType"], string> = {
  boutique_hotel: "Boutique hotel",
  business_hotel: "Business hotel",
  budget_studio: "Budget studio",
  family_apartment: "Family apartment",
  romantic_suite: "Romantic suite",
  urban_loft: "Urban loft",
};

type StayPreviewCardProps = {
  stay: StayCard;
  searchHref?: string;
};

export function StayPreviewCard({ stay, searchHref }: StayPreviewCardProps) {
  const href =
    searchHref ??
    `/stays?destination=${encodeURIComponent(stay.city)}&guests=2&tripType=leisure`;

  return (
    <Link
      href={href}
      aria-label={`View ${stay.name} in ${stay.city}`}
      className="group block focus-visible:outline-none"
    >
      <Card padding="none" className="overflow-hidden transition-shadow hover:shadow-soft-lg">
        <div className="relative aspect-[4/3] overflow-hidden bg-border">
          {stay.imageUrl ? (
            <Image
              src={stay.imageUrl}
              alt=""
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            />
          ) : (
            <div className="h-full w-full bg-border" aria-hidden />
          )}
          {stay.freeCancellation && (
            <div className="absolute left-4 top-4">
              <Badge variant="success">Free cancellation</Badge>
            </div>
          )}
        </div>

        <div className="space-y-3 p-6">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="truncate text-base font-semibold tracking-tight text-foreground group-hover:opacity-80">
                {stay.name}
              </h3>
              <p className="mt-0.5 text-sm text-muted">
                {stay.city}, {stay.country}
              </p>
            </div>
            <div className="shrink-0 text-right">
              <p className="text-sm font-semibold tabular-nums text-foreground">
                {stay.rating.toFixed(1)}
              </p>
              <p className="text-xs text-muted">
                {stay.reviewCount} review{stay.reviewCount === 1 ? "" : "s"}
              </p>
            </div>
          </div>

          <p className="line-clamp-2 text-sm leading-relaxed text-muted">
            {stay.description}
          </p>

          <div className="flex items-center justify-between gap-3 pt-1">
            <Badge variant="muted">{STAY_TYPE_LABELS[stay.stayType]}</Badge>
            <p className="text-sm font-medium tabular-nums text-foreground">
              {formatCurrency(stay.pricePerNight)}
              <span className="font-normal text-muted"> / night</span>
            </p>
          </div>
        </div>
      </Card>
    </Link>
  );
}
