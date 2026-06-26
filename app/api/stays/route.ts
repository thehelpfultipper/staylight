import { NextResponse } from "next/server";
import {
  getAllStays,
  getFeaturedStays,
} from "@/lib/services/stays.service";
import { logger } from "@/lib/utils/logger";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const featured = searchParams.get("featured") === "true";
  const data = featured ? getFeaturedStays() : getAllStays();

  logger.info("GET /api/stays", {
    featured,
    count: data.length,
  });

  return NextResponse.json({
    data,
    meta: { count: data.length },
  });
}
