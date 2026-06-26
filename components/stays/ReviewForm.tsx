"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { cn } from "@/lib/utils/cn";
import type { ApiErrorBody } from "@/types/api";
import type { Review } from "@/types/review";

type ReviewFormProps = {
  stayId: string;
  onReviewAdded: (review: Review) => void;
};

type FormFields = {
  name: string;
  rating: string;
  comment: string;
};

type FieldErrors = Partial<Record<keyof FormFields, string>>;

const RATING_OPTIONS = [5, 4, 3, 2, 1].map((value) => ({
  value: String(value),
  label: `${value} star${value === 1 ? "" : "s"}`,
}));

function validateFields(fields: FormFields): FieldErrors {
  const errors: FieldErrors = {};
  const name = fields.name.trim();
  const comment = fields.comment.trim();
  const rating = Number(fields.rating);

  if (name.length < 2) {
    errors.name = "Name must be at least 2 characters";
  }

  if (!fields.rating) {
    errors.rating = "Please select a rating";
  } else if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    errors.rating = "Rating must be between 1 and 5";
  }

  if (comment.length < 10) {
    errors.comment = "Comment must be at least 10 characters";
  }

  return errors;
}

export function ReviewForm({ stayId, onReviewAdded }: ReviewFormProps) {
  const [fields, setFields] = useState<FormFields>({
    name: "",
    rating: "",
    comment: "",
  });
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [submitError, setSubmitError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitError("");
    setSuccessMessage("");

    const errors = validateFields(fields);
    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stayId,
          name: fields.name.trim(),
          rating: Number(fields.rating),
          comment: fields.comment.trim(),
        }),
      });

      if (!response.ok) {
        const body = (await response.json()) as ApiErrorBody;
        throw new Error(body.error ?? "Could not submit review");
      }

      const body = (await response.json()) as { data: Review };
      onReviewAdded(body.data);
      setFields({ name: "", rating: "", comment: "" });
      setFieldErrors({});
      setSuccessMessage("Thank you — your review has been posted.");
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Could not submit review",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={(event) => void handleSubmit(event)}
      className="space-y-5 rounded-2xl border border-border bg-surface p-5 sm:p-6"
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
