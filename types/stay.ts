import type { Review } from "./review";

export type StayType =
  | "boutique_hotel"
  | "business_hotel"
  | "budget_studio"
  | "family_apartment"
  | "romantic_suite"
  | "urban_loft";

export interface AvailabilityRange {
  startDate: string;
  endDate: string;
  roomsAvailable: number;
}

export interface Stay {
  id: string;
  name: string;
  city: string;
  country: string;
  stayType: StayType;
  description: string;
  pricePerNight: number;
  rating: number;
  reviewCount: number;
  distanceFromCenterKm: number;
  maxGuests: number;
  availableRooms: number;
  amenities: string[];
  freeCancellation: boolean;
  images: string[];
  availability: AvailabilityRange[];
  reviews: Review[];
}
