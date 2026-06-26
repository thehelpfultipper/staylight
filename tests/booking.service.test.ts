import { describe, expect, it } from "vitest";
import {
  BookingValidationError,
  createBooking,
} from "@/lib/services/booking.service";
import { calculateTotalPrice } from "@/lib/utils/money";

const VALID_BOOKING = {
  stayId: "stay-ny-midtown-executive",
  checkIn: "2026-07-10",
  checkOut: "2026-07-13",
  guests: 2,
  guestName: "Alex Rivera",
  email: "alex@example.com",
};

describe("createBooking", () => {
  it("creates a confirmed booking", () => {
    const booking = createBooking(VALID_BOOKING);

    expect(booking.status).toBe("confirmed");
    expect(booking.paymentStatus).toBe("mock_paid");
    expect(booking.bookingId).toMatch(/^BK-\d{4}-\d+$/);
    expect(booking.stayName).toBe("Midtown Executive Tower");
    expect(booking.guestName).toBe("Alex Rivera");
    expect(booking.email).toBe("alex@example.com");
    expect(booking.guests).toBe(2);
  });

  it("calculates total price correctly", () => {
    const booking = createBooking(VALID_BOOKING);

    expect(booking.totalPrice).toBe(
      calculateTotalPrice(320, 3),
    );
    expect(booking.totalPrice).toBe(960);
  });

  it("rejects an invalid stay ID", () => {
    expect(() =>
      createBooking({
        ...VALID_BOOKING,
        stayId: "stay-does-not-exist",
      }),
    ).toThrow(BookingValidationError);

    expect(() =>
      createBooking({
        ...VALID_BOOKING,
        stayId: "stay-does-not-exist",
      }),
    ).toThrow("Stay not found");
  });

  it("rejects an invalid date range", () => {
    expect(() =>
      createBooking({
        ...VALID_BOOKING,
        checkIn: "2026-07-13",
        checkOut: "2026-07-10",
      }),
    ).toThrow(BookingValidationError);

    expect(() =>
      createBooking({
        ...VALID_BOOKING,
        checkIn: "2026-07-13",
        checkOut: "2026-07-10",
      }),
    ).toThrow("Invalid date range");
  });
});
