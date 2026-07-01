import type { TripType } from "@/types/search";

export const TRIP_TYPE_OPTIONS = [
  { value: "leisure", label: "Leisure" },
  { value: "business", label: "Business" },
  { value: "family", label: "Family" },
  { value: "budget", label: "Budget" },
  { value: "romantic", label: "Romantic" },
] as const satisfies ReadonlyArray<{ value: TripType; label: string }>;

export const GUEST_OPTIONS = Array.from({ length: 10 }, (_, i) => ({
  value: String(i + 1),
  label: i + 1 === 1 ? "1 guest" : `${i + 1} guests`,
}));
