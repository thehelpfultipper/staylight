import type { AvailabilityRange } from "@/types/stay";

const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export function parseDate(value: string): Date {
  if (!ISO_DATE_PATTERN.test(value)) {
    throw new Error(`Invalid date format: ${value}. Expected YYYY-MM-DD.`);
  }

  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));

  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    throw new Error(`Invalid date: ${value}`);
  }

  return date;
}

export function formatDisplayDate(isoDate: string): string {
  const date = parseDate(isoDate);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

export function getNightCount(checkIn: string, checkOut: string): number {
  const start = parseDate(checkIn);
  const end = parseDate(checkOut);
  const diffMs = end.getTime() - start.getTime();
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
}

export function isDateRangeValid(
  checkIn: string,
  checkOut: string,
  options?: { allowPast?: boolean },
): boolean {
  try {
    const start = parseDate(checkIn);
    const end = parseDate(checkOut);
    const nights = getNightCount(checkIn, checkOut);

    if (nights <= 0) {
      return false;
    }

    if (!options?.allowPast) {
      const today = new Date();
      const todayUtc = new Date(
        Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()),
      );
      if (start < todayUtc) {
        return false;
      }
    }

    return start < end;
  } catch {
    return false;
  }
}

function rangesOverlap(
  rangeStart: Date,
  rangeEnd: Date,
  stayStart: Date,
  stayEnd: Date,
): boolean {
  return rangeStart < stayEnd && rangeEnd > stayStart;
}

export function isStayAvailableForRange(
  availability: AvailabilityRange[],
  checkIn: string,
  checkOut: string,
  roomsNeeded = 1,
): boolean {
  if (!isDateRangeValid(checkIn, checkOut)) {
    return false;
  }

  const requestStart = parseDate(checkIn);
  const requestEnd = parseDate(checkOut);

  return availability.some((range) => {
    const rangeStart = parseDate(range.startDate);
    const rangeEnd = parseDate(range.endDate);

    return (
      rangesOverlap(requestStart, requestEnd, rangeStart, rangeEnd) &&
      range.roomsAvailable >= roomsNeeded
    );
  });
}
