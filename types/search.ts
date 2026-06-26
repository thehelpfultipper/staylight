import type { Stay } from "./stay";

export type TripType =
  | "leisure"
  | "business"
  | "family"
  | "budget"
  | "romantic";

export interface SmartMatch {
  score: number;
  label: "Excellent match" | "Good match" | "Fair match";
  reasons: string[];
  tradeoffs: string[];
}

export interface SearchRequest {
  city?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  budgetPerNight?: number;
  tripType?: TripType;
}

export interface SearchResultItem {
  stay: Stay;
  smartMatch: SmartMatch;
  nights: number;
  totalPrice: number;
}

export interface SearchResponse {
  results: SearchResultItem[];
  total: number;
}
