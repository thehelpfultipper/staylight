import { Badge } from "@/components/ui/Badge";
import { LinkButton } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { formatDisplayDate } from "@/lib/utils/dates";
import { formatCurrency } from "@/lib/utils/money";
import type { BookingConfirmation } from "@/types/api";

type BookingConfirmationDetailsProps = {
  bookingId: string;
  confirmation: BookingConfirmation | null;
};

export function BookingConfirmationDetails({
  bookingId,
  confirmation,
}: BookingConfirmationDetailsProps) {
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
              Reference{" "}
              <span className="font-medium text-foreground">{bookingId}</span>{" "}
              was recorded, but trip details could not be loaded from this
              browser session.
            </p>
          )}
        </div>
      </Card>

      <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <LinkButton href="/" variant="secondary">
          Back to home
        </LinkButton>
        <LinkButton href="/stays" variant="primary">
          Browse more stays
        </LinkButton>
      </div>
    </div>
  );
}
