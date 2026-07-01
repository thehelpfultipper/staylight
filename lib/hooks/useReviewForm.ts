"use client";

import { useState, type FormEvent } from "react";
import {
  validateReviewFields,
  type ReviewFieldErrors,
  type ReviewFormFields,
} from "@/components/stays/reviewFormValidation";
import type { ApiErrorBody } from "@/types/api";
import type { Review } from "@/types/review";

type UseReviewFormOptions = {
  stayId: string;
  onReviewAdded: (review: Review) => void;
};

export function useReviewForm({ stayId, onReviewAdded }: UseReviewFormOptions) {
  const [fields, setFields] = useState<ReviewFormFields>({
    name: "",
    rating: "",
    comment: "",
  });
  const [fieldErrors, setFieldErrors] = useState<ReviewFieldErrors>({});
  const [submitError, setSubmitError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitError("");
    setSuccessMessage("");

    const errors = validateReviewFields(fields);
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

  return {
    fields,
    setFields,
    fieldErrors,
    submitError,
    successMessage,
    isSubmitting,
    handleSubmit,
  };
}
