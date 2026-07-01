import { StaysBrowseResults, StaysSearchResults } from "@/components/stays/StaysResults";
import { StaysPageHeader } from "@/components/stays/StaysPageHeader";
import { RefreshErrorState } from "@/components/ui/RefreshErrorState";
import {
  hasRequiredSearchParams,
  toURLSearchParams,
} from "@/lib/stays/page-helpers";
import {
  SearchValidationError,
  parseSearchParams,
  searchStays,
} from "@/lib/services/search.service";
import { getAllStays } from "@/lib/services/stays.service";
import { parseGuests } from "@/lib/stays/stay-detail-helpers";
import { toStayCard } from "@/types/stay";

type StaysPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function StaysPage({ searchParams }: StaysPageProps) {
  const resolvedSearchParams = await searchParams;
  const urlSearchParams = toURLSearchParams(resolvedSearchParams);
  const isSearchMode = hasRequiredSearchParams(urlSearchParams);

  return (
    <div className="page-container py-12 sm:py-16">
      <StaysPageHeader isSearchMode={isSearchMode} />

      {isSearchMode ? (
        <StaysSearchContent searchParams={urlSearchParams} />
      ) : (
        <StaysBrowseResults
          stays={getAllStays().map(toStayCard)}
        />
      )}
    </div>
  );
}

type StaysSearchContentProps = {
  searchParams: URLSearchParams;
};

function loadStaysSearchContent(searchParams: URLSearchParams) {
  try {
    const params = parseSearchParams(searchParams);
    const { results, nights, destination } = searchStays(params);

    return {
      ok: true as const,
      params,
      results,
      nights,
      destination,
      guests: parseGuests(searchParams.get("guests")),
    };
  } catch (error) {
    return {
      ok: false as const,
      message:
        error instanceof SearchValidationError
          ? error.message
          : "Search failed",
    };
  }
}

function StaysSearchContent({ searchParams }: StaysSearchContentProps) {
  const result = loadStaysSearchContent(searchParams);

  if (!result.ok) {
    return (
      <RefreshErrorState
        title="Could not load results"
        message={result.message}
      />
    );
  }

  return (
    <StaysSearchResults
      results={result.results}
      destination={result.destination}
      checkIn={result.params.checkIn}
      checkOut={result.params.checkOut}
      guests={result.guests}
      nights={result.nights}
      searchParams={searchParams}
    />
  );
}
