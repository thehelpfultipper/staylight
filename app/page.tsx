export default function Home() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16 sm:px-8 sm:py-24">
      {/* Hero */}
      <section className="mb-20 text-center sm:text-left">
        <p className="mb-4 text-sm font-medium uppercase tracking-widest text-muted">
          Premium travel, thoughtfully matched
        </p>
        <h1 className="max-w-2xl text-4xl font-semibold leading-tight tracking-tight text-foreground sm:text-5xl sm:leading-tight">
          Find stays that fit the way you travel.
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
          Search boutique hotels, apartments, and retreats — ranked by Smart
          Match so you know why each stay fits before you book.
        </p>
      </section>

      {/* Search placeholder */}
      <section aria-labelledby="search-heading" className="mb-20">
        <h2 id="search-heading" className="sr-only">
          Search stays
        </h2>
        <div className="rounded-3xl border border-border bg-surface p-8 shadow-soft sm:p-10">
          <p className="mb-6 text-sm font-medium text-muted">
            Search form coming soon
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <div className="flex-1 space-y-2">
              <div className="h-4 w-24 rounded bg-border" aria-hidden />
              <div className="h-12 w-full rounded-2xl border border-border bg-background" />
            </div>
            <div className="flex-1 space-y-2">
              <div className="h-4 w-20 rounded bg-border" aria-hidden />
              <div className="h-12 w-full rounded-2xl border border-border bg-background" />
            </div>
            <div className="h-12 w-full rounded-2xl bg-foreground sm:w-36" aria-hidden />
          </div>
        </div>
      </section>

      {/* Featured stays placeholder */}
      <section aria-labelledby="featured-heading" className="mb-20">
        <div className="mb-8 flex items-end justify-between">
          <h2
            id="featured-heading"
            className="text-2xl font-semibold tracking-tight text-foreground"
          >
            Featured stays
          </h2>
          <span className="text-sm text-muted">Coming soon</span>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <article
              key={i}
              className="overflow-hidden rounded-3xl border border-border bg-surface shadow-soft"
            >
              <div className="aspect-[4/3] bg-border" aria-hidden />
              <div className="space-y-3 p-6">
                <div className="h-5 w-3/4 rounded bg-border" aria-hidden />
                <div className="h-4 w-1/2 rounded bg-border" aria-hidden />
                <div className="h-4 w-1/3 rounded bg-border" aria-hidden />
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Smart Match teaser */}
      <section aria-labelledby="smart-match-heading">
        <div className="rounded-3xl border border-border bg-surface p-8 shadow-soft sm:p-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="max-w-xl">
              <p className="mb-2 text-sm font-medium uppercase tracking-widest text-muted">
                Smart Match
              </p>
              <h2
                id="smart-match-heading"
                className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl"
              >
                Every result includes a clear fit score and reason.
              </h2>
              <p className="mt-3 text-muted leading-relaxed">
                Smart Match evaluates price, capacity, amenities, and location
                against your search — so you spend less time guessing and more
                time choosing the right stay.
              </p>
            </div>
            <div
              className="flex shrink-0 flex-col items-center justify-center rounded-2xl border border-border bg-background px-8 py-6"
              aria-hidden
            >
              <span className="text-3xl font-semibold tabular-nums text-foreground">
                92
              </span>
              <span className="mt-1 text-xs font-medium uppercase tracking-wider text-muted">
                Fit score
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
