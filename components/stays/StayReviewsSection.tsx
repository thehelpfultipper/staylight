"use client";

import { useState } from "react";
import { ReviewForm } from "@/components/stays/ReviewForm";
import { ReviewList } from "@/components/stays/ReviewList";
import type { Review } from "@/types/review";

type StayReviewsSectionProps = {
  stayId: string;
  initialReviews: Review[];
};

export function StayReviewsSection({
  stayId,
  initialReviews,
}: StayReviewsSectionProps) {
  const [reviews, setReviews] = useState(initialReviews);

  return (
    <section aria-labelledby="reviews-heading" className="space-y-6">
      <div>
        <h2
          id="reviews-heading"
          className="text-lg font-semibold tracking-tight text-foreground"
        >
          Guest reviews
        </h2>
        <p className="mt-1 text-sm text-muted">
          Read what others said or share your own experience.
        </p>
      </div>

      <ReviewList reviews={reviews} />
      <ReviewForm
        stayId={stayId}
        onReviewAdded={(review) =>
          setReviews((current) => [review, ...current])
        }
      />
    </section>
  );
}
