export type ReviewFormFields = {
  name: string;
  rating: string;
  comment: string;
};

export type ReviewFieldErrors = Partial<Record<keyof ReviewFormFields, string>>;

export function validateReviewFields(fields: ReviewFormFields): ReviewFieldErrors {
  const errors: ReviewFieldErrors = {};
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
