export type BookingStatus = "confirmed" | "cancelled";

export interface Booking {
  id: string;
  referenceNumber: string;
  stayId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  guestName: string;
  guestEmail: string;
  totalPrice: number;
  currency: string;
  status: BookingStatus;
  createdAt: string;
}

export interface CreateBookingInput {
  stayId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  guestName: string;
  guestEmail: string;
}
