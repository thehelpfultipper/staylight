"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import {
  validateCheckoutFields,
  type CheckoutFieldErrors,
  type CheckoutFormFields,
} from "@/components/checkout/checkoutFormValidation";
import { storeBookingConfirmation } from "@/lib/utils/booking-storage";
import type { ApiErrorBody, BookingConfirmation } from "@/types/api";

type UseCheckoutFormOptions = {
  stayId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
};

export function useCheckoutForm({
  stayId,
  checkIn,
  checkOut,
  guests,
}: UseCheckoutFormOptions) {
  const router = useRouter();
  const [fields, setFields] = useState<CheckoutFormFields>({
    guestName: "",
    email: "",
    specialRequest: "",
    cardholderName: "",
    cardNumber: "",
  });
  const [fieldErrors, setFieldErrors] = useState<CheckoutFieldErrors>({});
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitError("");

    const errors = validateCheckoutFields(fields);
    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    let navigated = false;

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stayId,
          checkIn,
          checkOut,
          guests,
          guestName: fields.guestName.trim(),
          email: fields.email.trim(),
          specialRequest: fields.specialRequest.trim() || undefined,
        }),
      });

      if (!response.ok) {
        const body = (await response.json()) as ApiErrorBody;
        throw new Error(body.error ?? "Could not complete booking");
      }

      const body = (await response.json()) as { data: BookingConfirmation };
      storeBookingConfirmation(body.data);
      navigated = true;
      router.push(`/booking-confirmed/${body.data.bookingId}`);
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Could not complete booking",
      );
    } finally {
      if (!navigated) {
        setIsSubmitting(false);
      }
    }
  }

  return {
    fields,
    setFields,
    fieldErrors,
    submitError,
    isSubmitting,
    handleSubmit,
  };
}
