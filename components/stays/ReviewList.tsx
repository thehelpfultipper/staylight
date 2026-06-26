import { EmptyState } from "@/components/ui/EmptyState";
import { formatDisplayDate } from "@/lib/utils/dates";
import type { Review } from "@/types/review";

type ReviewListProps = {
  reviews: Review[];
};

function StarRating({ rating }: { rating: number }) {
  return (
    <span
      className="inline-flex items-center gap-1 text-sm font-medium text-foreground"
      aria-label={`${rating} out of 5 stars`}
    >
      <span aria-hidden className="text-amber-500">
        {"★".repeat(rating)}
        {"☆".repeat(5 - rating)}
      </span>
      <span className="tabular-nums text-muted">{rating}/5</span>
    </span>
  );
}

export function ReviewList({ reviews }: ReviewListProps) {
  if (reviews.length === 0) {
    return (
      <EmptyState
        title="No reviews yet"
        description="Be the first to share your experience at this stay."
        className="py-10"
      />
    );
  }

  return (
    <ol className="space-y-5" aria-label="Guest reviews">
      {reviews.map((review) => (
        <li
          key={review.id}
          className="rounded-2xl border border-border bg-background px-5 py-4"
        >
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <p className="font-medium text-foreground">{review.authorName}</p>
            <time
              dateTime={review.createdAt}
              className="text-sm text-muted"
            >
              {formatDisplayDate(review.createdAt)}
            </time>
          </div>
          <div className="mt-2">
            <StarRating rating={review.rating} />
          </div>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            {review.comment}
          </p>
        </li>
      ))}
    </ol>
  );
}
