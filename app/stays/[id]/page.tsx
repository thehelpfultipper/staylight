"use client";

import Link from "next/link";
import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { ReviewForm } from "@/components/stays/ReviewForm";
import { ReviewList } from "@/components/stays/ReviewList";
import { SmartMatchBadge } from "@/components/stays/SmartMatchBadge";
import { StayGallery } from "@/components/stays/StayGallery";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ErrorState } from "@/components/ui/ErrorState";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";
import { calculateSmartMatch } from "@/lib/smart-match/calculateSmartMatch";
import { formatDisplayDate, getNightCount } from "@/lib/utils/dates";
import { calculateTotalPrice, formatCurrency } from "@/lib/utils/money";
import type { ApiErrorBody } from "@/types/api";
import type { Review } from "@/types/review";
import type { TripType } from "@/types/search";
import type { Stay } from "@/types/stay";

const TRIP_TYPES: TripType[] = [
  "leisure",
  "business",
  "family",
  "budget",
  "romantic",
];

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

function parseTripType(value: string | null): TripType | undefined {
  if (value && TRIP_TYPES.includes(value as TripType)) {
    return value as TripType;
  }
  return undefined;
}

function parseBudget(value: string | null): number | undefined {
  if (!value) {
    return undefined;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
}

function parseGuests(value: string | null): number {
  const parsed = Number(value ?? "1");
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
}

function buildCheckoutHref(
  stayId: string,
  checkIn?: string,
  checkOut?: string,
  guests?: number,
): string {
  const params = new URLSearchParams();

  if (checkIn) {
    params.set("checkIn", checkIn);
  }
  if (checkOut) {
    params.set("checkOut", checkOut);
  }
  if (guests !== undefined) {
    params.set("guests", String(guests));
  }

  const query = params.toString();
  return query ? `/checkout/${stayId}?${query}` : `/checkout/${stayId}`;
}

function buildBackHref(searchParams: URLSearchParams): string {
  const params = new URLSearchParams();

  for (const [key, value] of searchParams.entries()) {
    params.set(key, value);
  }

  const query = params.toString();
  return query ? `/stays?${query}` : "/stays";
}

type BookingSidebarProps = {
  stay: Stay;
  checkIn?: string;
  checkOut?: string;
  guests: number;
  estimatedTotal: { nights: number; total: number } | null;
  checkoutHref: string;
  className?: string;
};

function BookingSidebar({
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

        <Link href={checkoutHref}>
          <Button variant="primary" size="lg" fullWidth>
            Book now
          </Button>
        </Link>

        <p className="text-center text-xs text-muted">
          You won&apos;t be charged — demo checkout only
        </p>
      </div>
    </Card>
  );
}

function StayDetailLoading() {
  return (
    <div className="space-y-8" role="status" aria-label="Loading stay details">
      <LoadingSkeleton className="aspect-[16/10] w-full rounded-3xl sm:aspect-[2/1]" />
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <LoadingSkeleton className="h-10 w-2/3" />
          <LoadingSkeleton className="h-4 w-1/3" />
          <LoadingSkeleton className="h-24 w-full" />
          <LoadingSkeleton className="h-40 w-full rounded-3xl" />
        </div>
        <LoadingSkeleton className="h-72 w-full rounded-3xl" />
      </div>
    </div>
  );
}

function StayDetailContent() {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const stayId = params.id;

  const checkIn = searchParams.get("checkIn")?.trim() || undefined;
  const checkOut = searchParams.get("checkOut")?.trim() || undefined;
  const guests = parseGuests(searchParams.get("guests"));
  const budget = parseBudget(searchParams.get("budget"));
  const tripType = parseTripType(searchParams.get("tripType"));

  const [stay, setStay] = useState<Stay | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [errorMessage, setErrorMessage] = useState("");

  const loadStay = useCallback(async () => {
    setStatus("loading");

    try {
      const response = await fetch(`/api/stays/${stayId}`);

      if (!response.ok) {
        const body = (await response.json()) as ApiErrorBody;
        throw new Error(body.error ?? "Could not load stay");
      }

      const body = (await response.json()) as { data: Stay };
      setStay(body.data);
      setReviews(body.data.reviews);
      setStatus("success");
    } catch (error) {
      setStay(null);
      setReviews([]);
      setErrorMessage(
        error instanceof Error ? error.message : "Could not load stay",
      );
      setStatus("error");
    }
  }, [stayId]);

  useEffect(() => {
    void loadStay();
  }, [loadStay]);

  const smartMatch = useMemo(() => {
    if (!stay || (budget === undefined && !tripType)) {
      return null;
    }

    return calculateSmartMatch({
      stay,
      budgetPerNight: budget,
      tripType,
    });
  }, [stay, budget, tripType]);

  const estimatedTotal = useMemo(() => {
    if (!stay || !checkIn || !checkOut) {
      return null;
    }

    try {
      const nights = getNightCount(checkIn, checkOut);
      if (nights <= 0) {
        return null;
      }

      return {
        nights,
        total: calculateTotalPrice(stay.pricePerNight, nights, guests),
      };
    } catch {
      return null;
    }
  }, [stay, checkIn, checkOut, guests]);

  const checkoutHref = buildCheckoutHref(stayId, checkIn, checkOut, guests);
  const backHref = buildBackHref(searchParams);
  const hasSearchContext = Boolean(
    checkIn || checkOut || searchParams.get("destination"),
  );

  if (status === "loading") {
    return <StayDetailLoading />;
  }

  if (status === "error" || !stay) {
    return (
      <ErrorState
        title="Stay not found"
        message={errorMessage}
        onRetry={() => void loadStay()}
      />
    );
  }

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

          <section aria-labelledby="reviews-heading" className="space-y-6">
            <div>
              <h2
                id="reviews-heading"
                className="text-lg font-semibold tracking-tight text-foreground"
              >
                Guest reviews
              </h2>
              <p className="mt-1 text-sm text-muted">
                Read what others said or share your own experience.
              </p>
            </div>

            <ReviewList reviews={reviews} />
            <ReviewForm
              stayId={stay.id}
              onReviewAdded={(review) =>
                setReviews((current) => [review, ...current])
              }
            />
          </section>
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

export default function StayDetailPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-12 sm:px-8 sm:py-16">
      <Suspense fallback={<StayDetailLoading />}>
        <StayDetailContent />
      </Suspense>
    </div>
  );
}
