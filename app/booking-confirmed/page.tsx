import { LinkButton } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";

export default function BookingConfirmedIndexPage() {
  return (
    <div className="page-container py-12 sm:py-16">
      <EmptyState
        title="No booking reference provided"
        description="Open a confirmation link from your completed checkout, or start a new search."
        action={
          <div className="flex flex-col gap-3 sm:flex-row">
            <LinkButton href="/" variant="primary">
              Back to home
            </LinkButton>
            <LinkButton href="/stays" variant="secondary">
              Browse stays
            </LinkButton>
          </div>
        }
      />
    </div>
  );
}
