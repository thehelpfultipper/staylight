import { StayDetailView } from "@/components/stays/StayDetailView";
import { RefreshErrorState } from "@/components/ui/RefreshErrorState";
import { calculateSmartMatch } from "@/lib/smart-match/calculateSmartMatch";
import {
  buildBackHref,
  buildCheckoutHref,
  parseBudget,
  parseGuests,
  parseTripType,
} from "@/lib/stays/stay-detail-helpers";
import { toURLSearchParams } from "@/lib/stays/page-helpers";
import { findStayById } from "@/lib/services/stays.service";
import { getNightCount } from "@/lib/utils/dates";
import { calculateTotalPrice } from "@/lib/utils/money";

type StayDetailPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function StayDetailPage({
  params,
  searchParams,
}: StayDetailPageProps) {
  const { id } = await params;
  const resolvedSearchParams = await searchParams;
  const urlSearchParams = toURLSearchParams(resolvedSearchParams);
  const stay = findStayById(id);

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
  const budget = parseBudget(urlSearchParams.get("budget"));
  const tripType = parseTripType(urlSearchParams.get("tripType"));

  const smartMatch =
    budget === undefined && !tripType
      ? null
      : calculateSmartMatch({
          stay,
          budgetPerNight: budget,
          tripType,
        });

  let estimatedTotal: { nights: number; total: number } | null = null;
  if (checkIn && checkOut) {
    try {
      const nights = getNightCount(checkIn, checkOut);
      if (nights > 0) {
        estimatedTotal = {
          nights,
          total: calculateTotalPrice(stay.pricePerNight, nights, guests),
        };
      }
    } catch {
      estimatedTotal = null;
    }
  }

  const checkoutHref = buildCheckoutHref(id, checkIn, checkOut, guests);
  const backHref = buildBackHref(urlSearchParams);
  const hasSearchContext = Boolean(
    checkIn || checkOut || urlSearchParams.get("destination"),
  );

  return (
    <div className="page-container py-12 sm:py-16">
      <StayDetailView
        stay={stay}
        reviews={stay.reviews}
        checkIn={checkIn}
        checkOut={checkOut}
        guests={guests}
        estimatedTotal={estimatedTotal}
        smartMatch={smartMatch}
        checkoutHref={checkoutHref}
        backHref={backHref}
        hasSearchContext={hasSearchContext}
      />
    </div>
  );
}
