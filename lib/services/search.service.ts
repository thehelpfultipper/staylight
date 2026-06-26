import { staysSeed } from "@/lib/data/stays.seed";
import { calculateSmartMatch } from "@/lib/smart-match/calculateSmartMatch";
import {
  getNightCount,
  isDateRangeValid,
  isStayAvailableForRange,
} from "@/lib/utils/dates";
import { calculateTotalPrice } from "@/lib/utils/money";
import type { SearchResultApiItem } from "@/types/api";
import type { TripType } from "@/types/search";
import { toStayCard } from "@/types/stay";

const TRIP_TYPES: TripType[] = [
  "leisure",
  "business",
  "family",
  "budget",
  "romantic",
];

export interface SearchParams {
  destination: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  budget?: number;
  tripType?: TripType;
}

export class SearchValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SearchValidationError";
  }
}

function parseOptionalNumber(value: string | null): number | undefined {
  if (value === null || value.trim() === "") {
    return undefined;
  }

  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    return undefined;
  }

  return parsed;
}

export function parseSearchParams(
  searchParams: URLSearchParams,
): SearchParams {
  const destination = searchParams.get("destination")?.trim() ?? "";
  const checkIn = searchParams.get("checkIn")?.trim() ?? "";
  const checkOut = searchParams.get("checkOut")?.trim() ?? "";
  const guestsRaw = searchParams.get("guests");
  const budgetRaw = searchParams.get("budget");
  const tripTypeRaw = searchParams.get("tripType")?.trim();

  if (!destination) {
    throw new SearchValidationError("destination is required");
  }

  if (!checkIn) {
    throw new SearchValidationError("checkIn is required (YYYY-MM-DD)");
  }

  if (!checkOut) {
    throw new SearchValidationError("checkOut is required (YYYY-MM-DD)");
  }

  if (!isDateRangeValid(checkIn, checkOut)) {
    throw new SearchValidationError(
      "Invalid date range: checkOut must be after checkIn and dates must be valid",
    );
  }

  const guestsParsed = guestsRaw === null ? 1 : Number(guestsRaw);
  if (!Number.isInteger(guestsParsed) || guestsParsed < 1) {
    throw new SearchValidationError("guests must be a positive integer");
  }

  const budget = parseOptionalNumber(budgetRaw);
  if (budgetRaw !== null && budgetRaw.trim() !== "" && budget === undefined) {
    throw new SearchValidationError("budget must be a valid number");
  }

  if (budget !== undefined && budget <= 0) {
    throw new SearchValidationError("budget must be greater than zero");
  }

  let tripType: TripType | undefined;
  if (tripTypeRaw) {
    if (!TRIP_TYPES.includes(tripTypeRaw as TripType)) {
      throw new SearchValidationError(
        `tripType must be one of: ${TRIP_TYPES.join(", ")}`,
      );
    }
    tripType = tripTypeRaw as TripType;
  }

  return {
    destination,
    checkIn,
    checkOut,
    guests: guestsParsed,
    budget,
    tripType,
  };
}

export function searchStays(params: SearchParams): {
  results: SearchResultApiItem[];
  nights: number;
  destination: string;
} {
  const normalizedDestination = params.destination.trim().toLowerCase();
  const nights = getNightCount(params.checkIn, params.checkOut);

  const candidates = staysSeed.filter((stay) => {
    if (stay.city.toLowerCase() !== normalizedDestination) {
      return false;
    }

    if (stay.maxGuests < params.guests) {
      return false;
    }

    return isStayAvailableForRange(
      stay.availability,
      params.checkIn,
      params.checkOut,
    );
  });

  const results = candidates
    .map((stay) => {
      const totalPrice = calculateTotalPrice(stay.pricePerNight, nights);
      const smartMatch = calculateSmartMatch({
        stay,
        budgetPerNight: params.budget,
        tripType: params.tripType,
      });

      return {
        stay: toStayCard(stay),
        totalPrice,
        nights,
        smartMatch,
      };
    })
    .sort((a, b) => b.smartMatch.score - a.smartMatch.score);

  return {
    results,
    nights,
    destination: params.destination.trim(),
  };
}
