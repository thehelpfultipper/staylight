type StaysPageHeaderProps = {
  isSearchMode: boolean;
};

export function StaysPageHeader({ isSearchMode }: StaysPageHeaderProps) {
  return (
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
  );
}
