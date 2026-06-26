import Link from "next/link";
import { SearchForm } from "@/components/search/SearchForm";
import { StayPreviewCard } from "@/components/stays/StayPreviewCard";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { getFeaturedStays } from "@/lib/services/stays.service";
import { toStayCard } from "@/types/stay";

const FEATURED_COUNT = 4;

export default function Home() {
  const featuredStays = getFeaturedStays()
    .slice(0, FEATURED_COUNT)
    .map(toStayCard);

  return (
    <div className="page-container sm:py-16 lg:py-24">
      {/* Hero */}
      <section className="mb-12 text-center sm:mb-16 sm:text-left lg:mb-20">
        <Badge variant="muted" className="mb-4 uppercase tracking-widest sm:mb-5">
          Premium travel, thoughtfully matched
        </Badge>
        <h1 className="mx-auto max-w-2xl text-3xl font-semibold leading-tight tracking-tight text-foreground sm:mx-0 sm:text-4xl lg:text-5xl lg:leading-tight">
          Find stays that fit the way you travel.
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted sm:mx-0 sm:mt-6 sm:text-lg">
          Search boutique hotels, apartments, and retreats — ranked by Smart
          Match so you know why each stay fits before you book.
        </p>
      </section>

      {/* Search */}
      <section aria-labelledby="search-heading" className="mb-16 lg:mb-20">
        <h2 id="search-heading" className="sr-only">
          Search stays
        </h2>
        <SearchForm />
      </section>

      {/* Featured stays */}
      <section aria-labelledby="featured-heading" className="mb-20">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2
              id="featured-heading"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              Featured stays
            </h2>
            <p className="mt-2 text-sm text-muted">
              Hand-picked properties with top guest ratings.
            </p>
          </div>
          <Link
            href="/stays"
            className="text-sm font-medium text-foreground transition-opacity hover:opacity-70"
          >
            View all stays →
          </Link>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
          {featuredStays.map((stay) => (
            <StayPreviewCard key={stay.id} stay={stay} />
          ))}
        </div>
      </section>

      {/* Smart Match */}
      <section aria-labelledby="smart-match-heading">
        <Card padding="lg">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="mb-2 text-sm font-medium uppercase tracking-widest text-muted">
                Smart Match
              </p>
              <h2
                id="smart-match-heading"
                className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl"
              >
                Every result includes a clear fit score and reason.
              </h2>
              <p className="mt-4 leading-relaxed text-muted">
                Smart Match ranks stays using your budget, trip type, location,
                rating, amenities, and cancellation preferences.
              </p>
            </div>

            <div
              className="flex shrink-0 flex-col items-center justify-center rounded-2xl border border-border bg-background px-10 py-8"
              aria-hidden
            >
              <span className="text-4xl font-semibold tabular-nums text-foreground">
                92
              </span>
              <span className="mt-1 text-xs font-medium uppercase tracking-wider text-muted">
                Example fit score
              </span>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}
