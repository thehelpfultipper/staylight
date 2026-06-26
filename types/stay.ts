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

/** Fields commonly shown on stay listing cards. */
export interface StayCard {
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
  amenities: string[];
  freeCancellation: boolean;
  imageUrl: string;
}

export function toStayCard(stay: Stay): StayCard {
  return {
    id: stay.id,
    name: stay.name,
    city: stay.city,
    country: stay.country,
    stayType: stay.stayType,
    description: stay.description,
    pricePerNight: stay.pricePerNight,
    rating: stay.rating,
    reviewCount: stay.reviewCount,
    distanceFromCenterKm: stay.distanceFromCenterKm,
    maxGuests: stay.maxGuests,
    amenities: stay.amenities,
    freeCancellation: stay.freeCancellation,
    imageUrl: stay.images[0] ?? "",
  };
}
