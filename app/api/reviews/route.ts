import { NextResponse } from "next/server";
import {
  ReviewValidationError,
  createReview,
  type CreateReviewRequest,
} from "@/lib/services/review.service";
import { logger } from "@/lib/utils/logger";

export async function POST(request: Request) {
  let body: CreateReviewRequest;

  try {
    body = (await request.json()) as CreateReviewRequest;
  } catch {
    logger.warn("POST /api/reviews invalid JSON");
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  try {
    const review = createReview(body);

    logger.info("POST /api/reviews submitted", {
      reviewId: review.id,
      stayId: review.stayId,
      rating: review.rating,
    });

    return NextResponse.json({ data: review }, { status: 201 });
  } catch (error) {
    if (error instanceof ReviewValidationError) {
      logger.warn("POST /api/reviews validation error", {
        message: error.message,
      });

      const status = error.message === "Stay not found" ? 404 : 400;
      return NextResponse.json({ error: error.message }, { status });
    }

    logger.error("POST /api/reviews failed", {
      message: error instanceof Error ? error.message : "Unknown error",
    });
    return NextResponse.json(
      { error: "Review submission failed" },
      { status: 500 },
    );
  }
}
