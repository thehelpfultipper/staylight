import { findStayById } from "@/lib/services/stays.service";
import type { Review } from "@/types/review";

export interface CreateReviewRequest {
  stayId: string;
  name: string;
  rating: number;
  comment: string;
}

export class ReviewValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ReviewValidationError";
  }
}

const sessionReviews: Review[] = [];
let reviewSequence = 1;

function generateReviewId(): string {
  const id = reviewSequence;
  reviewSequence += 1;
  return `rev-session-${id}`;
}

export function getSessionReviews(): Review[] {
  return [...sessionReviews];
}

export function createReview(input: CreateReviewRequest): Review {
  const stayId = input.stayId?.trim();
  if (!stayId) {
    throw new ReviewValidationError("stayId is required");
  }

  const stay = findStayById(stayId);
  if (!stay) {
    throw new ReviewValidationError("Stay not found");
  }

  const name = input.name?.trim() ?? "";
  if (name.length < 2) {
    throw new ReviewValidationError("name must be at least 2 characters");
  }

  const comment = input.comment?.trim() ?? "";
  if (comment.length < 10) {
    throw new ReviewValidationError(
      "comment must be at least 10 characters",
    );
  }

  if (
    !Number.isInteger(input.rating) ||
    input.rating < 1 ||
    input.rating > 5
  ) {
    throw new ReviewValidationError("rating must be an integer from 1 to 5");
  }

  const review: Review = {
    id: generateReviewId(),
    stayId,
    authorName: name,
    rating: input.rating,
    comment,
    createdAt: new Date().toISOString().slice(0, 10),
  };

  sessionReviews.push(review);
  return review;
}
