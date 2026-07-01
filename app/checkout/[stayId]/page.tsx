import { CheckoutView } from "@/components/checkout/CheckoutView";
import { LinkButton } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { RefreshErrorState } from "@/components/ui/RefreshErrorState";
import { findStayById } from "@/lib/services/stays.service";
import { toURLSearchParams } from "@/lib/stays/page-helpers";
import { parseGuests } from "@/lib/stays/stay-detail-helpers";
import { getNightCount } from "@/lib/utils/dates";

type CheckoutPageProps = {
  params: Promise<{ stayId: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function CheckoutPage({
  params,
  searchParams,
}: CheckoutPageProps) {
  const { stayId } = await params;
  const resolvedSearchParams = await searchParams;
  const urlSearchParams = toURLSearchParams(resolvedSearchParams);
  const stay = findStayById(stayId);

  if (!stay) {
    return (
      <div className="page-container py-12 sm:py-16">
        <RefreshErrorState
          title="Stay not found"
          message="This stay could not be found. It may have been removed or the link is incorrect."
        />
      </div>
    );
  }

  const checkIn = urlSearchParams.get("checkIn")?.trim() || undefined;
  const checkOut = urlSearchParams.get("checkOut")?.trim() || undefined;
  const guests = parseGuests(urlSearchParams.get("guests"));

  let nights: number | null = null;
  if (checkIn && checkOut) {
    try {
      const count = getNightCount(checkIn, checkOut);
      nights = count > 0 ? count : null;
    } catch {
      nights = null;
    }
  }

  if (!checkIn || !checkOut || !nights) {
    return (
      <div className="page-container py-12 sm:py-16">
        <EmptyState
          title="Select your dates first"
          description="Checkout needs check-in and check-out dates. Head back to the stay page or search to pick dates and try again."
          action={
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center">
              <LinkButton href={`/stays/${stayId}`} variant="primary">
                Back to stay details
              </LinkButton>
              <LinkButton href="/stays" variant="secondary">
                Browse stays
              </LinkButton>
            </div>
          }
        />
      </div>
    );
  }

  return (
    <div className="page-container py-12 sm:py-16">
      <CheckoutView
        stay={stay}
        stayId={stayId}
        checkIn={checkIn}
        checkOut={checkOut}
        guests={guests}
        nights={nights}
      />
    </div>
  );
}
