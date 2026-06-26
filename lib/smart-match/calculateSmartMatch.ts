import type { Stay } from "@/types/stay";
import type { SmartMatch, TripType } from "@/types/search";

const TRIP_TYPE_AMENITIES: Record<TripType, string[]> = {
  business: ["wifi", "workspace", "breakfast"],
  family: ["kitchen", "laundry", "family-friendly", "parking"],
  budget: ["breakfast", "kitchen", "free-cancellation"],
  romantic: ["city-view", "breakfast", "pool"],
  leisure: ["pool", "breakfast", "city-view"],
};

export interface SmartMatchInput {
  stay: Stay;
  budgetPerNight?: number;
  tripType?: TripType;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function scoreBudgetFit(
  pricePerNight: number,
  budgetPerNight?: number,
): { score: number; reason?: string; tradeoff?: string } {
  if (budgetPerNight === undefined || budgetPerNight <= 0) {
    return { score: 20 };
  }

  const ratio = pricePerNight / budgetPerNight;

  if (ratio <= 1) {
    return { score: 30, reason: "Within your budget" };
  }

  if (ratio <= 1.1) {
    return {
      score: 24,
      tradeoff: "Slightly above your budget",
    };
  }

  if (ratio <= 1.25) {
    return {
      score: 15,
      tradeoff: "Above your budget",
    };
  }

  return {
    score: 5,
    tradeoff: "Well above your budget",
  };
}

function scoreLocationFit(
  distanceFromCenterKm: number,
): { score: number; reason?: string; tradeoff?: string } {
  if (distanceFromCenterKm <= 1.5) {
    return { score: 20, reason: "Close to the city center" };
  }

  if (distanceFromCenterKm <= 3) {
    return { score: 15, reason: "Convenient central location" };
  }

  if (distanceFromCenterKm <= 6) {
    return { score: 10 };
  }

  return { score: 4, tradeoff: "Farther from the city center" };
}

function scoreRatingFit(
  rating: number,
): { score: number; reason?: string; tradeoff?: string } {
  if (rating >= 4.7) {
    return { score: 20, reason: "Highly rated by guests" };
  }

  if (rating >= 4.3) {
    return { score: 16, reason: "Well rated by guests" };
  }

  if (rating >= 3.8) {
    return { score: 10 };
  }

  return { score: 5, tradeoff: "Lower guest ratings" };
}

function normalizeAmenity(amenity: string): string {
  return amenity.toLowerCase().trim();
}

function getStayAmenities(stay: Stay): Set<string> {
  const amenities = stay.amenities.map(normalizeAmenity);
  if (stay.freeCancellation) {
    amenities.push("free-cancellation");
  }
  return new Set(amenities);
}

function scoreAmenityFit(
  stay: Stay,
  tripType?: TripType,
): { score: number; reason?: string; tradeoff?: string } {
  if (!tripType) {
    return { score: 12 };
  }

  const desired = TRIP_TYPE_AMENITIES[tripType];
  const available = getStayAmenities(stay);
  const matched = desired.filter((amenity) => available.has(amenity));
  const matchRatio = matched.length / desired.length;
  const score = Math.round(matchRatio * 20);

  const tripLabels: Record<TripType, string> = {
    business: "business-friendly amenities",
    family: "family-friendly amenities",
    budget: "budget-friendly amenities",
    romantic: "romantic amenities",
    leisure: "leisure amenities",
  };

  if (matchRatio >= 0.75) {
    return {
      score,
      reason: `Has ${tripLabels[tripType]}`,
    };
  }

  if (matchRatio >= 0.4) {
    return { score };
  }

  return {
    score,
    tradeoff: `Missing some ${tripLabels[tripType]}`,
  };
}

function scoreCancellationFit(
  freeCancellation: boolean,
): { score: number; reason?: string; tradeoff?: string } {
  if (freeCancellation) {
    return { score: 10, reason: "Includes free cancellation" };
  }

  return { score: 0, tradeoff: "No free cancellation" };
}

function getLabel(score: number): SmartMatch["label"] {
  if (score >= 85) {
    return "Excellent match";
  }

  if (score >= 70) {
    return "Good match";
  }

  return "Fair match";
}

export function calculateSmartMatch(input: SmartMatchInput): SmartMatch {
  const { stay, budgetPerNight, tripType } = input;

  const budget = scoreBudgetFit(stay.pricePerNight, budgetPerNight);
  const location = scoreLocationFit(stay.distanceFromCenterKm);
  const rating = scoreRatingFit(stay.rating);
  const amenities = scoreAmenityFit(stay, tripType);
  const cancellation = scoreCancellationFit(stay.freeCancellation);

  const score = clamp(
    budget.score +
      location.score +
      rating.score +
      amenities.score +
      cancellation.score,
    0,
    100,
  );

  const reasons = [
    budget.reason,
    location.reason,
    rating.reason,
    amenities.reason,
    cancellation.reason,
  ].filter((value): value is string => Boolean(value));

  const tradeoffs = [
    budget.tradeoff,
    location.tradeoff,
    rating.tradeoff,
    amenities.tradeoff,
    cancellation.tradeoff,
  ].filter((value): value is string => Boolean(value));

  return {
    score,
    label: getLabel(score),
    reasons,
    tradeoffs,
  };
}

export { TRIP_TYPE_AMENITIES };
