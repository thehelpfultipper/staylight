export function AppFooter() {
  return (
    <footer className="mt-auto border-t border-border bg-surface/60">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-10 sm:px-8">
        <p className="text-sm font-medium text-foreground">Staylight</p>
        <p className="max-w-md text-sm text-muted">
          A premium travel booking demo. Payments and bookings are mocked for
          demonstration only.
        </p>
        <p className="text-xs text-muted">
          &copy; {new Date().getFullYear()} Staylight. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
