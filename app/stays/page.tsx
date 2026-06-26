"use client";

import Link from "next/link";
import { Suspense, useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { SearchSummary } from "@/components/search/SearchSummary";
import { StayCard } from "@/components/stays/StayCard";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";
import type { ApiErrorBody, SearchMeta, SearchResultApiItem } from "@/types/api";

const SEARCH_PARAM_KEYS = [
  "destination",
  "checkIn",
  "checkOut",
  "guests",
  "budget",
  "tripType",
] as const;

type FetchStatus = "loading" | "success" | "error" | "missing";

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

function ResultsLoading() {
  return (
    <div className="space-y-6" role="status" aria-label="Loading search results">
      <LoadingSkeleton className="h-24 w-full rounded-3xl" />
      {Array.from({ length: 3 }, (_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-3xl border border-border bg-surface shadow-soft"
        >
          <LoadingSkeleton className="aspect-[16/10] rounded-none lg:h-56 lg:w-72" />
          <div className="space-y-3 p-6">
            <LoadingSkeleton className="h-6 w-2/3" />
            <LoadingSkeleton className="h-4 w-1/2" />
            <LoadingSkeleton className="h-20 w-full" />
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
  const isValid = hasRequiredSearchParams(searchParams);
  const [status, setStatus] = useState<FetchStatus>(
    isValid ? "loading" : "missing",
  );
  const [results, setResults] = useState<SearchResultApiItem[]>([]);
  const [meta, setMeta] = useState<SearchMeta | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!isValid) {
      return;
    }

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
  }, [isValid, queryString]);

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
    return <ResultsLoading />;
  }

  if (status === "missing") {
    return (
      <EmptyState
        title="Start with a search"
        description="Choose a destination, dates, and guests to see stays ranked by Smart Match."
        action={
          <Link href="/">
            <Button variant="primary">Back to search</Button>
          </Link>
        }
      />
    );
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
            <Link href="/">
              <Button variant="secondary">Modify search</Button>
            </Link>
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

function StaysSearchResults() {
  const searchParams = useSearchParams();
  const queryString = searchParams.toString();

  return (
    <StaysSearchResultsContent
      key={queryString}
      queryString={queryString}
      searchParams={searchParams}
    />
  );
}

export default function StaysPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-12 sm:px-8 sm:py-16">
      <header className="mb-10">
        <p className="text-sm font-medium uppercase tracking-widest text-muted">
          Smart Match results
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
          Stays for your trip
        </h1>
        <p className="mt-3 max-w-2xl text-lg leading-relaxed text-muted">
          Ranked by how well each stay fits your dates, guests, budget, and trip
          type.
        </p>
      </header>

      <Suspense fallback={<ResultsLoading />}>
        <StaysSearchResults />
      </Suspense>
    </div>
  );
}
