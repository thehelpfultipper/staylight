import type { SmartMatch } from "./search";
import type { StayCard } from "./stay";

export interface ApiErrorBody {
  error: string;
}

export interface StaysListMeta {
  count: number;
}

export interface SearchResultApiItem {
  stay: StayCard;
  totalPrice: number;
  nights: number;
  smartMatch: SmartMatch;
}

export interface SearchMeta {
  count: number;
  nights: number;
  destination: string;
  durationMs: number;
}

export interface BookingConfirmation {
  bookingId: string;
  status: "confirmed";
  paymentStatus: "mock_paid";
  totalPrice: number;
  stayName: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  guestName: string;
  email: string;
}
