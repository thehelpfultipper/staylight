import { Suspense } from "react";
import { BookingConfirmationContent } from "@/components/checkout/BookingConfirmationContent";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";

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

export default function BookingConfirmedPage() {
  return (
    <div className="page-container py-12 sm:py-16">
      <Suspense fallback={<ConfirmationLoading />}>
        <BookingConfirmationContent />
      </Suspense>
    </div>
  );
}
