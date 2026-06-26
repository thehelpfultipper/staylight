"use client";

import Image from "next/image";
import Link from "next/link";
import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { PriceBreakdown } from "@/components/checkout/PriceBreakdown";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";
import { formatDisplayDate, getNightCount } from "@/lib/utils/dates";
import type { ApiErrorBody } from "@/types/api";
import type { Stay } from "@/types/stay";

function parseGuests(value: string | null): number {
  const parsed = Number(value ?? "1");
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
}

function CheckoutLoading() {
  return (
    <div className="space-y-8" role="status" aria-label="Loading checkout">
      <LoadingSkeleton className="h-10 w-1/3" />
      <div className="grid gap-8 lg:grid-cols-5">
        <div className="order-2 space-y-6 lg:order-1 lg:col-span-3">
          <LoadingSkeleton className="h-96 w-full rounded-3xl" />
        </div>
        <LoadingSkeleton className="order-1 h-80 w-full rounded-3xl lg:order-2 lg:col-span-2" />
      </div>
    </div>
  );
}

function CheckoutContent() {
  const params = useParams<{ stayId: string }>();
  const searchParams = useSearchParams();
  const stayId = params.stayId;

  const checkIn = searchParams.get("checkIn")?.trim() || undefined;
  const checkOut = searchParams.get("checkOut")?.trim() || undefined;
  const guests = parseGuests(searchParams.get("guests"));

  const [stay, setStay] = useState<Stay | null>(null);
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
      setStatus("success");
    } catch (error) {
      setStay(null);
      setErrorMessage(
        error instanceof Error ? error.message : "Could not load stay",
      );
      setStatus("error");
    }
  }, [stayId]);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      try {
        const response = await fetch(`/api/stays/${stayId}`);

        if (cancelled) {
          return;
        }

        if (!response.ok) {
          const body = (await response.json()) as ApiErrorBody;
          throw new Error(body.error ?? "Could not load stay");
        }

        const body = (await response.json()) as { data: Stay };
        setStay(body.data);
        setStatus("success");
      } catch (error) {
        if (cancelled) {
          return;
        }

        setStay(null);
        setErrorMessage(
          error instanceof Error ? error.message : "Could not load stay",
        );
        setStatus("error");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [stayId]);

  const nights = useMemo(() => {
    if (!checkIn || !checkOut) {
      return null;
    }

    try {
      const count = getNightCount(checkIn, checkOut);
      return count > 0 ? count : null;
    } catch {
      return null;
    }
  }, [checkIn, checkOut]);

  const hasValidDates = Boolean(checkIn && checkOut && nights);

  if (status === "loading") {
    return <CheckoutLoading />;
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

  if (!hasValidDates) {
    return (
      <EmptyState
        title="Select your dates first"
        description="Checkout needs check-in and check-out dates. Head back to the stay page or search to pick dates and try again."
        action={
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link href={`/stays/${stayId}`}>
              <Button variant="primary">Back to stay details</Button>
            </Link>
            <Link href="/stays">
              <Button variant="secondary">Browse stays</Button>
            </Link>
          </div>
        }
      />
    );
  }

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <Link
          href={`/stays/${stayId}?checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`}
          className="inline-flex text-sm font-medium text-muted transition-colors hover:text-foreground"
        >
          ← Back to stay
        </Link>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Checkout
        </h1>
        <p className="text-muted">
          Review your trip and complete your demo booking.
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-5 lg:items-start">
        <div className="order-2 lg:order-1 lg:col-span-3">
          <Card>
            <CheckoutForm
              stayId={stayId}
              checkIn={checkIn!}
              checkOut={checkOut!}
              guests={guests}
            />
          </Card>
        </div>

        <aside className="order-1 lg:order-2 lg:col-span-2">
          <Card className="sticky top-8 space-y-6">
            <div className="overflow-hidden rounded-2xl">
              <Image
                src={stay.images[0]}
                alt=""
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
                  {formatDisplayDate(checkIn!)} – {formatDisplayDate(checkOut!)}
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
              nights={nights!}
              serviceFee={0}
            />
          </Card>
        </aside>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-12 sm:px-8 sm:py-16">
      <Suspense fallback={<CheckoutLoading />}>
        <CheckoutContent />
      </Suspense>
    </div>
  );
}
