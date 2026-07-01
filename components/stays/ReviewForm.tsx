"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { useReviewForm } from "@/lib/hooks/useReviewForm";
import { cn } from "@/lib/utils/cn";
import type { Review } from "@/types/review";

type ReviewFormProps = {
  stayId: string;
  onReviewAdded: (review: Review) => void;
};

const RATING_OPTIONS = [5, 4, 3, 2, 1].map((value) => ({
  value: String(value),
  label: `${value} star${value === 1 ? "" : "s"}`,
}));

export function ReviewForm({ stayId, onReviewAdded }: ReviewFormProps) {
  const {
    fields,
    setFields,
    fieldErrors,
    submitError,
    successMessage,
    isSubmitting,
    handleSubmit,
  } = useReviewForm({ stayId, onReviewAdded });

  return (
    <form
      onSubmit={(event) => void handleSubmit(event)}
      className="space-y-5 rounded-2xl border border-border bg-surface p-6"
      aria-busy={isSubmitting}
      aria-label="Write a review"
      noValidate
    >
      <div>
        <h3 className="text-base font-semibold tracking-tight text-foreground">
          Write a review
        </h3>
        <p className="mt-1 text-sm text-muted">
          Share your experience to help other travelers.
        </p>
      </div>

      <Input
        name="name"
        label="Your name"
        value={fields.name}
        onChange={(event) =>
          setFields((current) => ({ ...current, name: event.target.value }))
        }
        error={fieldErrors.name}
        required
        autoComplete="name"
        disabled={isSubmitting}
      />

      <Select
        name="rating"
        label="Rating"
        value={fields.rating}
        onChange={(event) =>
          setFields((current) => ({ ...current, rating: event.target.value }))
        }
        options={RATING_OPTIONS}
        placeholder="Select a rating"
        error={fieldErrors.rating}
        required
        disabled={isSubmitting}
      />

      <div className="space-y-2">
        <label
          htmlFor="review-comment"
          className="block text-sm font-medium text-foreground"
        >
          Comment
          <span className="ml-0.5 text-muted" aria-hidden>
            *
          </span>
        </label>
        <textarea
          id="review-comment"
          name="comment"
          rows={4}
          value={fields.comment}
          onChange={(event) =>
            setFields((current) => ({ ...current, comment: event.target.value }))
          }
          aria-invalid={fieldErrors.comment ? true : undefined}
          aria-describedby={
            fieldErrors.comment ? "review-comment-error" : undefined
          }
          required
          disabled={isSubmitting}
          className={cn(
            "w-full resize-y rounded-2xl border bg-background px-4 py-3 text-sm text-foreground",
            "placeholder:text-muted/70 transition-colors",
            "focus-visible:border-border-strong focus-visible:outline-none",
            fieldErrors.comment
              ? "border-red-500/60 focus-visible:border-red-500/60"
              : "border-border hover:border-border-strong",
          )}
          placeholder="What stood out about your stay?"
        />
        {fieldErrors.comment && (
          <p
            id="review-comment-error"
            role="alert"
            className="text-xs text-red-600"
          >
            {fieldErrors.comment}
          </p>
        )}
      </div>

      {submitError && (
        <p role="alert" className="text-sm text-red-600">
          {submitError}
        </p>
      )}

      {successMessage && (
        <p role="status" className="text-sm text-emerald-700">
          {successMessage}
        </p>
      )}

      <Button type="submit" variant="primary" disabled={isSubmitting}>
        {isSubmitting ? "Submitting…" : "Post review"}
      </Button>
    </form>
  );
}
