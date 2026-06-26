"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { SearchSummary } from "@/components/search/SearchSummary";
import { StayCard } from "@/components/stays/StayCard";
import { StayPreviewCard } from "@/components/stays/StayPreviewCard";
import { LinkButton } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";
import type {
  ApiErrorBody,
  SearchMeta,
  SearchResultApiItem,
  StaysListMeta,
} from "@/types/api";
import type { Stay } from "@/types/stay";
import { toStayCard } from "@/types/stay";

const SEARCH_PARAM_KEYS = [
  "destination",
  "checkIn",
  "checkOut",
  "guests",
  "budget",
  "tripType",
] as const;

type FetchStatus = "loading" | "success" | "error";

function hasRequiredSearchParams(params: URLSearchParams): boolean {
  return (
    Boolean(params.get("destination")?.trim()) &&
    Boolean(params.get("checkIn")?.trim()) &&
    Boolean(params.get("checkOut")?.trim())
  );
}

function buildStayDetailHref(
  stayId: string,
  searchParams: URLSearchParams,
): string {
  const params = new URLSearchParams();

  for (const key of SEARCH_PARAM_KEYS) {
    const value = searchParams.get(key);
    if (value) {
      params.set(key, value);
    }
  }

  const query = params.toString();
  return query ? `/stays/${stayId}?${query}` : `/stays/${stayId}`;
}

function SearchResultsLoading() {
  return (
    <div className="space-y-6" role="status" aria-live="polite" aria-busy="true">
      <span className="sr-only">Loading search results</span>
      <LoadingSkeleton decorative className="h-24 w-full rounded-3xl" />
      {Array.from({ length: 3 }, (_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-3xl border border-border bg-surface shadow-soft"
        >
          <LoadingSkeleton decorative className="aspect-[16/10] rounded-none lg:h-56 lg:w-72" />
          <div className="space-y-3 p-6">
            <LoadingSkeleton decorative className="h-6 w-2/3" />
            <LoadingSkeleton decorative className="h-4 w-1/2" />
            <LoadingSkeleton decorative className="h-20 w-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

function BrowseResultsLoading() {
  return (
    <div
      className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <span className="sr-only">Loading stays</span>
      {Array.from({ length: 6 }, (_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-3xl border border-border bg-surface shadow-soft"
        >
          <LoadingSkeleton decorative className="aspect-[4/3] rounded-none" />
          <div className="space-y-3 p-6">
            <LoadingSkeleton decorative className="h-5 w-2/3" />
            <LoadingSkeleton decorative className="h-4 w-1/2" />
            <LoadingSkeleton decorative className="h-16 w-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

type StaysSearchResultsContentProps = {
  queryString: string;
  searchParams: URLSearchParams;
};

function StaysSearchResultsContent({
  queryString,
  searchParams,
}: StaysSearchResultsContentProps) {
  const [status, setStatus] = useState<FetchStatus>("loading");
  const [results, setResults] = useState<SearchResultApiItem[]>([]);
  const [meta, setMeta] = useState<SearchMeta | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadSearchResults() {
      try {
        const response = await fetch(`/api/search?${queryString}`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          const body = (await response.json()) as ApiErrorBody;
          throw new Error(body.error ?? "Search failed");
        }

        const body = (await response.json()) as {
          data: SearchResultApiItem[];
          meta: SearchMeta;
        };

        if (controller.signal.aborted) {
          return;
        }

        setResults(body.data);
        setMeta(body.meta);
        setStatus("success");
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        setResults([]);
        setMeta(null);
        setErrorMessage(
          error instanceof Error ? error.message : "Search failed",
        );
        setStatus("error");
      }
    }

    void loadSearchResults();

    return () => {
      controller.abort();
    };
  }, [queryString]);

  const handleRetry = useCallback(() => {
    setStatus("loading");

    void (async () => {
      try {
        const response = await fetch(`/api/search?${queryString}`);

        if (!response.ok) {
          const body = (await response.json()) as ApiErrorBody;
          throw new Error(body.error ?? "Search failed");
        }

        const body = (await response.json()) as {
          data: SearchResultApiItem[];
          meta: SearchMeta;
        };

        setResults(body.data);
        setMeta(body.meta);
        setStatus("success");
      } catch (error) {
        setResults([]);
        setMeta(null);
        setErrorMessage(
          error instanceof Error ? error.message : "Search failed",
        );
        setStatus("error");
      }
    })();
  }, [queryString]);

  const guests = Number(searchParams.get("guests") ?? "1");
  const checkIn = searchParams.get("checkIn") ?? "";
  const checkOut = searchParams.get("checkOut") ?? "";
  const destination =
    meta?.destination ?? searchParams.get("destination")?.trim() ?? "";

  if (status === "loading") {
    return <SearchResultsLoading />;
  }

  if (status === "error") {
    return (
      <ErrorState
        title="Could not load results"
        message={errorMessage}
        onRetry={handleRetry}
      />
    );
  }

  return (
    <div className="space-y-8">
      <SearchSummary
        destination={destination}
        checkIn={checkIn}
        checkOut={checkOut}
        guests={Number.isFinite(guests) && guests > 0 ? guests : 1}
        count={meta?.count ?? results.length}
        nights={meta?.nights}
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

function StaysBrowseResultsContent() {
  const [status, setStatus] = useState<FetchStatus>("loading");
  const [stays, setStays] = useState<ReturnType<typeof toStayCard>[]>([]);
  const [meta, setMeta] = useState<StaysListMeta | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadStays() {
      try {
        const response = await fetch("/api/stays", {
          signal: controller.signal,
        });

        if (!response.ok) {
          const body = (await response.json()) as ApiErrorBody;
          throw new Error(body.error ?? "Could not load stays");
        }

        const body = (await response.json()) as {
          data: Stay[];
          meta: StaysListMeta;
        };

        if (controller.signal.aborted) {
          return;
        }

        setStays(body.data.map(toStayCard));
        setMeta(body.meta);
        setStatus("success");
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        setStays([]);
        setMeta(null);
        setErrorMessage(
          error instanceof Error ? error.message : "Could not load stays",
        );
        setStatus("error");
      }
    }

    void loadStays();

    return () => {
      controller.abort();
    };
  }, []);

  const handleRetry = useCallback(() => {
    setStatus("loading");

    void (async () => {
      try {
        const response = await fetch("/api/stays");

        if (!response.ok) {
          const body = (await response.json()) as ApiErrorBody;
          throw new Error(body.error ?? "Could not load stays");
        }

        const body = (await response.json()) as {
          data: Stay[];
          meta: StaysListMeta;
        };

        setStays(body.data.map(toStayCard));
        setMeta(body.meta);
        setStatus("success");
      } catch (error) {
        setStays([]);
        setMeta(null);
        setErrorMessage(
          error instanceof Error ? error.message : "Could not load stays",
        );
        setStatus("error");
      }
    })();
  }, []);

  if (status === "loading") {
    return <BrowseResultsLoading />;
  }

  if (status === "error") {
    return (
      <ErrorState
        title="Could not load stays"
        message={errorMessage}
        onRetry={handleRetry}
      />
    );
  }

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
        {meta?.count ?? stays.length} propert
        {(meta?.count ?? stays.length) === 1 ? "y" : "ies"} available
      </p>

      <ul
        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        aria-label="All stays"
      >
        {stays.map((stay) => (
          <li key={stay.id}>
            <StayPreviewCard
              stay={stay}
              searchHref={`/stays/${stay.id}`}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

function StaysPageContent() {
  const searchParams = useSearchParams();
  const isSearchMode = hasRequiredSearchParams(searchParams);
  const queryString = searchParams.toString();

  return (
    <div className="page-container">
      <header className="mb-10">
        {isSearchMode ? (
          <>
            <p className="text-sm font-medium uppercase tracking-widest text-muted">
              Smart Match results
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
              Stays for your trip
            </h1>
            <p className="mt-3 max-w-2xl text-lg leading-relaxed text-muted">
              Ranked by how well each stay fits your dates, guests, budget, and
              trip type.
            </p>
          </>
        ) : (
          <>
            <p className="text-sm font-medium uppercase tracking-widest text-muted">
              Browse
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
              All stays
            </h1>
            <p className="mt-3 max-w-2xl text-lg leading-relaxed text-muted">
              Explore every property in our collection. Search from the homepage
              to see Smart Match scores for your trip.
            </p>
          </>
        )}
      </header>

      {isSearchMode ? (
        <StaysSearchResultsContent
          key={queryString}
          queryString={queryString}
          searchParams={searchParams}
        />
      ) : (
        <StaysBrowseResultsContent />
      )}
    </div>
  );
}

export default function StaysPage() {
  return (
    <Suspense fallback={<BrowseResultsLoading />}>
      <StaysPageContent />
    </Suspense>
  );
}
