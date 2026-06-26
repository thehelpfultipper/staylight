"use client";

import Link from "next/link";
import { Suspense, useMemo, useSyncExternalStore } from "react";
import { useParams } from "next/navigation";
import {
  getBookingConfirmationSnapshot,
  parseBookingConfirmation,
  subscribeToBookingStorage,
} from "@/lib/utils/booking-storage";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";
import { formatDisplayDate } from "@/lib/utils/dates";
import { formatCurrency } from "@/lib/utils/money";

function ConfirmationLoading() {
  return (
    <div className="mx-auto max-w-xl space-y-6" role="status" aria-label="Loading confirmation">
      <LoadingSkeleton className="mx-auto h-16 w-16 rounded-full" />
      <LoadingSkeleton className="h-10 w-2/3 mx-auto" />
      <LoadingSkeleton className="h-64 w-full rounded-3xl" />
    </div>
  );
}

function ConfirmationContent() {
  const params = useParams<{ bookingId: string }>();
  const bookingId = params.bookingId;
  const confirmationRaw = useSyncExternalStore(
    subscribeToBookingStorage,
    () => getBookingConfirmationSnapshot(bookingId),
    () => null,
  );
  const confirmation = useMemo(
    () => parseBookingConfirmation(confirmationRaw),
    [confirmationRaw],
  );

  const hasSessionDetails = confirmation !== null;

  return (
    <div className="mx-auto max-w-xl space-y-8 text-center">
      <div className="space-y-4">
        <div
          className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-700"
          aria-hidden
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Booking confirmed
          </h1>
          <p className="text-muted">
            {hasSessionDetails
              ? "Your demo reservation is complete. A confirmation would normally be emailed to you."
              : "Your booking reference is below. Session details are unavailable — this can happen after a refresh or in a new tab."}
          </p>
        </div>
      </div>

      <Card className="text-left">
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm text-muted">Booking reference</p>
              <p className="text-lg font-semibold tracking-tight text-foreground">
                {hasSessionDetails ? confirmation.bookingId : bookingId}
              </p>
            </div>
            <Badge variant="success">Mock paid</Badge>
          </div>

          {hasSessionDetails ? (
            <dl className="space-y-4 text-sm">
              <div className="flex justify-between gap-4 border-b border-border pb-4">
                <dt className="text-muted">Stay</dt>
                <dd className="text-right font-medium text-foreground">
                  {confirmation.stayName}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Guest</dt>
                <dd className="text-right font-medium text-foreground">
                  {confirmation.guestName}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Email</dt>
                <dd className="text-right font-medium text-foreground">
                  {confirmation.email}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Dates</dt>
                <dd className="text-right font-medium text-foreground">
                  {formatDisplayDate(confirmation.checkIn)} –{" "}
                  {formatDisplayDate(confirmation.checkOut)}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Guests</dt>
                <dd className="font-medium text-foreground">
                  {confirmation.guests} guest
                  {confirmation.guests === 1 ? "" : "s"}
                </dd>
              </div>
              <div className="flex justify-between gap-4 border-t border-border pt-4">
                <dt className="text-base font-semibold text-foreground">
                  Total
                </dt>
                <dd className="text-lg font-semibold tabular-nums text-foreground">
                  {formatCurrency(confirmation.totalPrice)}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Payment status</dt>
                <dd className="font-medium capitalize text-foreground">
                  {confirmation.paymentStatus.replace("_", " ")}
                </dd>
              </div>
            </dl>
          ) : (
            <p className="text-sm text-muted">
              Reference <span className="font-medium text-foreground">{bookingId}</span>{" "}
              was recorded, but trip details could not be loaded from this browser
              session.
            </p>
          )}
        </div>
      </Card>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link href="/">
          <Button variant="secondary" fullWidth className="sm:w-auto">
            Back to home
          </Button>
        </Link>
        <Link href="/stays">
          <Button variant="primary" fullWidth className="sm:w-auto">
            Browse more stays
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default function BookingConfirmedPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-12 sm:px-8 sm:py-16">
      <Suspense fallback={<ConfirmationLoading />}>
        <ConfirmationContent />
      </Suspense>
    </div>
  );
}
