import { NextResponse } from "next/server";
import {
  SearchValidationError,
  parseSearchParams,
  searchStays,
} from "@/lib/services/search.service";
import { logger } from "@/lib/utils/logger";

export async function GET(request: Request) {
  const startedAt = Date.now();
  const { searchParams } = new URL(request.url);

  try {
    const params = parseSearchParams(searchParams);
    const { results, nights, destination } = searchStays(params);
    const durationMs = Date.now() - startedAt;

    if (results.length === 0) {
      logger.info("GET /api/search no results", {
        destination,
        checkIn: params.checkIn,
        checkOut: params.checkOut,
        guests: params.guests,
        durationMs,
      });
    } else {
      logger.info("GET /api/search", {
        destination,
        count: results.length,
        nights,
        durationMs,
      });
    }

    return NextResponse.json({
      data: results,
      meta: {
        count: results.length,
        nights,
        destination,
        durationMs,
      },
    });
  } catch (error) {
    if (error instanceof SearchValidationError) {
      logger.warn("GET /api/search validation error", {
        message: error.message,
      });
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    logger.error("GET /api/search failed", {
      message: error instanceof Error ? error.message : "Unknown error",
    });
    return NextResponse.json(
      { error: "Search failed" },
      { status: 500 },
    );
  }
}
