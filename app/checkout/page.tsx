import { LinkButton } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";

export default function CheckoutIndexPage() {
  return (
    <div className="page-container py-12 sm:py-16">
      <EmptyState
        title="Select a stay to checkout"
        description="Checkout opens from a stay detail page after you choose dates and guests."
        action={
          <LinkButton href="/stays" variant="primary">
            Browse stays
          </LinkButton>
        }
      />
    </div>
  );
}
