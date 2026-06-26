import { NextResponse } from "next/server";
import { findStayById } from "@/lib/services/stays.service";
import { logger } from "@/lib/utils/logger";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const stay = findStayById(id);

  if (!stay) {
    logger.warn("GET /api/stays/[id] not found", { id });
    return NextResponse.json({ error: "Stay not found" }, { status: 404 });
  }

  logger.info("GET /api/stays/[id]", { id });

  return NextResponse.json({ data: stay });
}
