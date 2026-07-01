import type { TripType } from "@/types/search";

export const TRIP_TYPES: TripType[] = [
  "leisure",
  "business",
  "family",
  "budget",
  "romantic",
];

export const AMENITY_LABELS: Record<string, string> = {
  wifi: "WiFi",
  breakfast: "Breakfast",
  "city-view": "City view",
  concierge: "Concierge",
  "air-conditioning": "A/C",
  workspace: "Workspace",
  kitchen: "Kitchen",
  laundry: "Laundry",
  "family-friendly": "Family friendly",
  parking: "Parking",
  pool: "Pool",
  gym: "Gym",
  spa: "Spa",
};

export function formatAmenity(slug: string): string {
  return AMENITY_LABELS[slug] ?? slug.replace(/-/g, " ");
}

export function parseTripType(value: string | null): TripType | undefined {
  if (value && TRIP_TYPES.includes(value as TripType)) {
    return value as TripType;
  }
  return undefined;
}

export function parseBudget(value: string | null): number | undefined {
  if (!value) {
    return undefined;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
}

export function parseGuests(value: string | null): number {
  const parsed = Number(value ?? "1");
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
}

export function buildCheckoutHref(
  stayId: string,
  checkIn?: string,
  checkOut?: string,
  guests?: number,
): string {
  const params = new URLSearchParams();

  if (checkIn) {
    params.set("checkIn", checkIn);
  }
  if (checkOut) {
    params.set("checkOut", checkOut);
  }
  if (guests !== undefined) {
    params.set("guests", String(guests));
  }

  const query = params.toString();
  return query ? `/checkout/${stayId}?${query}` : `/checkout/${stayId}`;
}

export function buildBackHref(searchParams: URLSearchParams): string {
  const params = new URLSearchParams();

  for (const [key, value] of searchParams.entries()) {
    params.set(key, value);
  }

  const query = params.toString();
  return query ? `/stays?${query}` : "/stays";
}
