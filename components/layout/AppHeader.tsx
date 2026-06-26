import Link from "next/link";

export function AppHeader() {
  return (
    <header className="border-b border-border bg-surface/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6 sm:px-8">
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight text-foreground transition-opacity hover:opacity-70"
        >
          Staylight
        </Link>
        <nav aria-label="Main navigation">
          <ul className="flex items-center gap-6">
            <li>
              <Link
                href="/stays"
                className="text-sm text-muted transition-colors hover:text-foreground"
              >
                Browse stays
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
