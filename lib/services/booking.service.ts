import { findStayById } from "@/lib/services/stays.service";
import {
  getNightCount,
  isDateRangeValid,
  isStayAvailableForRange,
} from "@/lib/utils/dates";
import { calculateTotalPrice } from "@/lib/utils/money";
import type { BookingConfirmation } from "@/types/api";

export interface CreateBookingRequest {
  stayId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  guestName: string;
  email: string;
  specialRequest?: string;
}

export class BookingValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "BookingValidationError";
  }
}

let bookingSequence = 1048;

function generateBookingId(): string {
  const year = new Date().getFullYear();
  const id = bookingSequence;
  bookingSequence += 1;
  return `BK-${year}-${id}`;
}

export function createBooking(
  input: CreateBookingRequest,
): BookingConfirmation {
  const stayId = input.stayId?.trim();
  if (!stayId) {
    throw new BookingValidationError("stayId is required");
  }

  const stay = findStayById(stayId);
  if (!stay) {
    throw new BookingValidationError("Stay not found");
  }

  const checkIn = input.checkIn?.trim() ?? "";
  const checkOut = input.checkOut?.trim() ?? "";

  if (!checkIn || !checkOut) {
    throw new BookingValidationError("checkIn and checkOut are required");
  }

  if (!isDateRangeValid(checkIn, checkOut)) {
    throw new BookingValidationError(
      "Invalid date range: checkOut must be after checkIn and dates must be valid",
    );
  }

  if (
    !Number.isInteger(input.guests) ||
    input.guests < 1 ||
    input.guests > stay.maxGuests
  ) {
    throw new BookingValidationError(
      `guests must be between 1 and ${stay.maxGuests}`,
    );
  }

  if (
    !isStayAvailableForRange(stay.availability, checkIn, checkOut)
  ) {
    throw new BookingValidationError(
      "Stay is not available for the selected dates",
    );
  }

  const guestName = input.guestName?.trim() ?? "";
  if (guestName.length < 2) {
    throw new BookingValidationError(
      "guestName must be at least 2 characters",
    );
  }

  const email = input.email?.trim() ?? "";
  if (!email.includes("@") || email.length < 5) {
    throw new BookingValidationError("A valid email is required");
  }

  const nights = getNightCount(checkIn, checkOut);
  const totalPrice = calculateTotalPrice(stay.pricePerNight, nights);

  return {
    bookingId: generateBookingId(),
    status: "confirmed",
    paymentStatus: "mock_paid",
    totalPrice,
    stayName: stay.name,
    checkIn,
    checkOut,
    guests: input.guests,
    guestName,
    email,
  };
}
