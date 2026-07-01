import Link from "next/link";
import { BookingSidebar } from "@/components/stays/BookingSidebar";
import { SmartMatchBadge } from "@/components/stays/SmartMatchBadge";
import { StayGallery } from "@/components/stays/StayGallery";
import { StayReviewsSection } from "@/components/stays/StayReviewsSection";
import { Badge } from "@/components/ui/Badge";
import { formatAmenity } from "@/lib/stays/stay-detail-helpers";
import type { SmartMatch } from "@/types/search";
import type { Stay } from "@/types/stay";

type StayDetailViewProps = {
  stay: Stay;
  reviews: Stay["reviews"];
  checkIn?: string;
  checkOut?: string;
  guests: number;
  estimatedTotal: { nights: number; total: number } | null;
  smartMatch: SmartMatch | null;
  checkoutHref: string;
  backHref: string;
  hasSearchContext: boolean;
};

export function StayDetailView({
  stay,
  reviews,
  checkIn,
  checkOut,
  guests,
  estimatedTotal,
  smartMatch,
  checkoutHref,
  backHref,
  hasSearchContext,
}: StayDetailViewProps) {
  return (
    <div className="space-y-8">
      {hasSearchContext && (
        <Link
          href={backHref}
          className="inline-flex text-sm font-medium text-muted transition-colors hover:text-foreground"
        >
          ← Back to results
        </Link>
      )}

      <div className="grid gap-8 lg:grid-cols-3 lg:items-start">
        <div className="space-y-8 lg:col-span-2">
          <StayGallery images={stay.images} stayName={stay.name} />

          <header className="space-y-3">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              {stay.name}
            </h1>
            <p className="text-lg text-muted">
              {stay.city}, {stay.country}
            </p>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
              <span>
                <span className="font-medium tabular-nums text-foreground">
                  {stay.rating.toFixed(1)}
                </span>{" "}
                · {reviews.length} review{reviews.length === 1 ? "" : "s"}
              </span>
              <span aria-hidden>·</span>
              <span>{stay.distanceFromCenterKm} km from center</span>
              <span aria-hidden>·</span>
              <span>
                Up to {stay.maxGuests} guest{stay.maxGuests === 1 ? "" : "s"}
              </span>
            </div>
          </header>

          <section aria-labelledby="about-heading">
            <h2
              id="about-heading"
              className="text-lg font-semibold tracking-tight text-foreground"
            >
              About this stay
            </h2>
            <p className="mt-3 text-base leading-relaxed text-muted">
              {stay.description}
            </p>
          </section>

          <section aria-labelledby="amenities-heading">
            <h2
              id="amenities-heading"
              className="text-lg font-semibold tracking-tight text-foreground"
            >
              Amenities
            </h2>
            <ul
              className="mt-4 flex flex-wrap gap-2"
              aria-label="Stay amenities"
            >
              {stay.amenities.map((amenity) => (
                <li key={amenity}>
                  <Badge variant="muted">{formatAmenity(amenity)}</Badge>
                </li>
              ))}
              {stay.freeCancellation && (
                <li>
                  <Badge variant="success">Free cancellation</Badge>
                </li>
              )}
            </ul>
          </section>

          {smartMatch && (
            <section aria-labelledby="smart-match-heading" className="space-y-3">
              <h2
                id="smart-match-heading"
                className="text-lg font-semibold tracking-tight text-foreground"
              >
                Smart Match
              </h2>
              <SmartMatchBadge smartMatch={smartMatch} />
              {smartMatch.tradeoffs[0] && (
                <p className="text-sm text-muted">
                  <span className="font-medium text-foreground">Tradeoff:</span>{" "}
                  {smartMatch.tradeoffs[0]}
                </p>
              )}
            </section>
          )}

          <div className="lg:hidden">
            <BookingSidebar
              stay={stay}
              checkIn={checkIn}
              checkOut={checkOut}
              guests={guests}
              estimatedTotal={estimatedTotal}
              checkoutHref={checkoutHref}
            />
          </div>

          <StayReviewsSection stayId={stay.id} initialReviews={reviews} />
        </div>

        <aside className="hidden lg:col-span-1 lg:block">
          <BookingSidebar
            stay={stay}
            checkIn={checkIn}
            checkOut={checkOut}
            guests={guests}
            estimatedTotal={estimatedTotal}
            checkoutHref={checkoutHref}
            className="sticky top-8"
          />
        </aside>
      </div>
    </div>
  );
}
