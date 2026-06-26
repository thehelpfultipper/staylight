import { NextResponse } from "next/server";
import {
  BookingValidationError,
  createBooking,
  type CreateBookingRequest,
} from "@/lib/services/booking.service";
import { logger } from "@/lib/utils/logger";

export async function POST(request: Request) {
  let body: CreateBookingRequest;

  try {
    body = (await request.json()) as CreateBookingRequest;
  } catch {
    logger.warn("POST /api/bookings invalid JSON");
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  try {
    const booking = createBooking(body);

    logger.info("POST /api/bookings created", {
      bookingId: booking.bookingId,
      stayName: booking.stayName,
      checkIn: booking.checkIn,
      checkOut: booking.checkOut,
      guests: booking.guests,
      totalPrice: booking.totalPrice,
    });

    return NextResponse.json({ data: booking }, { status: 201 });
  } catch (error) {
    if (error instanceof BookingValidationError) {
      logger.warn("POST /api/bookings validation error", {
        message: error.message,
      });

      const status = error.message === "Stay not found" ? 404 : 400;
      return NextResponse.json({ error: error.message }, { status });
    }

    logger.error("POST /api/bookings failed", {
      message: error instanceof Error ? error.message : "Unknown error",
    });
    return NextResponse.json(
      { error: "Booking failed" },
      { status: 500 },
    );
  }
}
