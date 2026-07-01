"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { BookingConfirmationDetails } from "@/components/checkout/BookingConfirmationDetails";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";
import {
  getBookingConfirmationSnapshot,
  parseBookingConfirmation,
} from "@/lib/utils/booking-storage";
import type { BookingConfirmation } from "@/types/api";

function ConfirmationLoading() {
  return (
    <div
      className="mx-auto max-w-xl space-y-6"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <span className="sr-only">Loading confirmation</span>
      <LoadingSkeleton decorative className="mx-auto h-16 w-16 rounded-full" />
      <LoadingSkeleton decorative className="mx-auto h-10 w-2/3" />
      <LoadingSkeleton decorative className="h-64 w-full rounded-3xl" />
    </div>
  );
}

export function BookingConfirmationContent() {
  const params = useParams<{ bookingId: string }>();
  const bookingId = params.bookingId;
  const [confirmation] = useState<BookingConfirmation | null>(() =>
    parseBookingConfirmation(getBookingConfirmationSnapshot(bookingId)),
  );
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;

    queueMicrotask(() => {
      if (active) {
        setReady(true);
      }
    });

    return () => {
      active = false;
    };
  }, []);

  if (!ready) {
    return <ConfirmationLoading />;
  }

  return (
    <BookingConfirmationDetails
      bookingId={bookingId}
      confirmation={confirmation}
    />
  );
}
