import type { BookingConfirmation } from "@/types/api";

const BOOKING_STORAGE_PREFIX = "staylight-booking-";

export function storeBookingConfirmation(
  confirmation: BookingConfirmation,
): void {
  sessionStorage.setItem(
    `${BOOKING_STORAGE_PREFIX}${confirmation.bookingId}`,
    JSON.stringify(confirmation),
  );
}

export function getBookingConfirmationSnapshot(bookingId: string): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  return sessionStorage.getItem(`${BOOKING_STORAGE_PREFIX}${bookingId}`);
}

export function parseBookingConfirmation(
  raw: string | null,
): BookingConfirmation | null {
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as BookingConfirmation;
  } catch {
    return null;
  }
}

export function subscribeToBookingStorage(): () => void {
  return () => {};
}
