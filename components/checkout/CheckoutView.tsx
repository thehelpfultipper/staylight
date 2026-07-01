import Link from "next/link";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { CheckoutSummary } from "@/components/checkout/CheckoutSummary";
import { Card } from "@/components/ui/Card";
import type { Stay } from "@/types/stay";

type CheckoutViewProps = {
  stay: Stay;
  stayId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  nights: number;
};

export function CheckoutView({
  stay,
  stayId,
  checkIn,
  checkOut,
  guests,
  nights,
}: CheckoutViewProps) {
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
              checkIn={checkIn}
              checkOut={checkOut}
              guests={guests}
            />
          </Card>
        </div>

        <aside className="order-1 lg:order-2 lg:col-span-2">
          <CheckoutSummary
            stay={stay}
            checkIn={checkIn}
            checkOut={checkOut}
            guests={guests}
            nights={nights}
          />
        </aside>
      </div>
    </div>
  );
}
