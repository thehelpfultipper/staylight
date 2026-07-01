import { SearchSummary } from "@/components/search/SearchSummary";
import { StayCard } from "@/components/stays/StayCard";
import { StayPreviewCard } from "@/components/stays/StayPreviewCard";
import { LinkButton } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { buildStayDetailHref } from "@/lib/stays/page-helpers";
import type { SearchResultApiItem } from "@/types/api";
import type { StayCard as StayCardModel } from "@/types/stay";

type StaysSearchResultsProps = {
  results: SearchResultApiItem[];
  destination: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  nights: number;
  searchParams: URLSearchParams;
};

export function StaysSearchResults({
  results,
  destination,
  checkIn,
  checkOut,
  guests,
  nights,
  searchParams,
}: StaysSearchResultsProps) {
  return (
    <div className="space-y-8">
      <SearchSummary
        destination={destination}
        checkIn={checkIn}
        checkOut={checkOut}
        guests={guests}
        count={results.length}
        nights={nights}
      />

      {results.length === 0 ? (
        <EmptyState
          title="No stays match your search"
          description="Try different dates, a higher budget, or another destination like Paris, New York, Barcelona, or Tokyo."
          action={
            <LinkButton href="/" variant="secondary">
              Modify search
            </LinkButton>
          }
        />
      ) : (
        <ol className="space-y-6" aria-label="Search results">
          {results.map((result) => (
            <li key={result.stay.id}>
              <StayCard
                result={result}
                detailHref={buildStayDetailHref(result.stay.id, searchParams)}
              />
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

type StaysBrowseResultsProps = {
  stays: StayCardModel[];
};

export function StaysBrowseResults({ stays }: StaysBrowseResultsProps) {
  if (stays.length === 0) {
    return (
      <EmptyState
        title="No stays available"
        description="Check back later or search from the homepage when new properties are added."
        action={
          <LinkButton href="/" variant="primary">
            Back to search
          </LinkButton>
        }
      />
    );
  }

  return (
    <div className="space-y-8">
      <p className="text-sm text-muted">
        {stays.length} propert{stays.length === 1 ? "y" : "ies"} available
      </p>

      <ul
        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        aria-label="All stays"
      >
        {stays.map((stay) => (
          <li key={stay.id} className="h-full">
            <StayPreviewCard stay={stay} searchHref={`/stays/${stay.id}`} />
          </li>
        ))}
      </ul>
    </div>
  );
}
