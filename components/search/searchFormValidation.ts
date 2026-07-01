import { isDateRangeValid } from "@/lib/utils/dates";
import type { TripType } from "@/types/search";

export type SearchFields = {
  destination: string;
  checkIn: string;
  checkOut: string;
  guests: string;
  budget: string;
  tripType: TripType | "";
};

export type SearchFieldErrors = Partial<Record<keyof SearchFields, string>>;

export function todayIso(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function validateSearchFields(fields: SearchFields): SearchFieldErrors {
  const errors: SearchFieldErrors = {};

  if (!fields.destination.trim()) {
    errors.destination = "Enter a destination city.";
  }

  if (!fields.checkIn) {
    errors.checkIn = "Select a check-in date.";
  }

  if (!fields.checkOut) {
    errors.checkOut = "Select a check-out date.";
  }

  if (fields.checkIn && fields.checkOut) {
    if (!isDateRangeValid(fields.checkIn, fields.checkOut)) {
      errors.checkOut = "Check-out must be after check-in and not in the past.";
    }
  }

  const guestCount = Number(fields.guests);
  if (!fields.guests || guestCount < 1) {
    errors.guests = "Select at least one guest.";
  }

  if (fields.budget.trim()) {
    const budget = Number(fields.budget);
    if (Number.isNaN(budget) || budget <= 0) {
      errors.budget = "Enter a valid nightly budget.";
    }
  }

  if (!fields.tripType) {
    errors.tripType = "Choose a trip type.";
  }

  return errors;
}
