"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils/cn";
import { storeBookingConfirmation } from "@/lib/utils/booking-storage";
import type { ApiErrorBody, BookingConfirmation } from "@/types/api";

type CheckoutFormProps = {
  stayId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
};

type FormFields = {
  guestName: string;
  email: string;
  specialRequest: string;
  cardholderName: string;
  cardNumber: string;
};

type FieldErrors = Partial<Record<keyof FormFields, string>>;

function validateFields(fields: FormFields): FieldErrors {
  const errors: FieldErrors = {};
  const guestName = fields.guestName.trim();
  const email = fields.email.trim();
  const cardholderName = fields.cardholderName.trim();

  if (guestName.length < 2) {
    errors.guestName = "Full name must be at least 2 characters";
  }

  if (!email.includes("@") || email.length < 5) {
    errors.email = "Enter a valid email address";
  }

  if (cardholderName.length < 2) {
    errors.cardholderName = "Cardholder name is required";
  }

  return errors;
}

export function CheckoutForm({
  stayId,
  checkIn,
  checkOut,
  guests,
}: CheckoutFormProps) {
  const router = useRouter();
  const [fields, setFields] = useState<FormFields>({
    guestName: "",
    email: "",
    specialRequest: "",
    cardholderName: "",
    cardNumber: "",
  });
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitError("");

    const errors = validateFields(fields);
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

  return (
    <form
      onSubmit={(event) => void handleSubmit(event)}
      className="space-y-8"
      aria-busy={isSubmitting}
      noValidate
    >
      <section aria-labelledby="guest-details-heading" className="space-y-5">
        <div>
          <h2
            id="guest-details-heading"
            className="text-lg font-semibold tracking-tight text-foreground"
          >
            Guest details
          </h2>
          <p className="mt-1 text-sm text-muted">
            Who is checking in? We&apos;ll send confirmation to this email.
          </p>
        </div>

        <Input
          name="guestName"
          label="Full name"
          value={fields.guestName}
          onChange={(event) =>
            setFields((current) => ({
              ...current,
              guestName: event.target.value,
            }))
          }
          error={fieldErrors.guestName}
          required
          autoComplete="name"
          disabled={isSubmitting}
        />

        <Input
          name="email"
          type="email"
          label="Email"
          value={fields.email}
          onChange={(event) =>
            setFields((current) => ({ ...current, email: event.target.value }))
          }
          error={fieldErrors.email}
          required
          autoComplete="email"
          disabled={isSubmitting}
        />

        <div className="space-y-2">
          <label
            htmlFor="special-request"
            className="block text-sm font-medium text-foreground"
          >
            Special request
            <span className="ml-1 text-xs font-normal text-muted">
              (optional)
            </span>
          </label>
          <textarea
            id="special-request"
            name="specialRequest"
            rows={3}
            value={fields.specialRequest}
            onChange={(event) =>
              setFields((current) => ({
                ...current,
                specialRequest: event.target.value,
              }))
            }
            disabled={isSubmitting}
            className={cn(
              "w-full resize-y rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground",
              "placeholder:text-muted/70 transition-colors",
              "hover:border-border-strong focus-visible:border-border-strong focus-visible:outline-none",
            )}
            placeholder="Late check-in, accessibility needs, etc."
          />
        </div>
      </section>

      <section
        aria-labelledby="payment-details-heading"
        className="space-y-5 rounded-2xl border border-border bg-background p-6"
      >
        <div>
          <h2
            id="payment-details-heading"
            className="text-lg font-semibold tracking-tight text-foreground"
          >
            Payment
          </h2>
          <p className="mt-2 rounded-xl border border-amber-200/60 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            Payment is mocked for this demo. No real card is required.
          </p>
        </div>

        <Input
          name="cardholderName"
          label="Cardholder name"
          value={fields.cardholderName}
          onChange={(event) =>
            setFields((current) => ({
              ...current,
              cardholderName: event.target.value,
            }))
          }
          error={fieldErrors.cardholderName}
          required
          autoComplete="cc-name"
          disabled={isSubmitting}
        />

        <Input
          name="cardNumber"
          label="Card number"
          value={fields.cardNumber}
          onChange={(event) =>
            setFields((current) => ({
              ...current,
              cardNumber: event.target.value,
            }))
          }
          placeholder="4242 4242 4242 4242"
          hint="Demo only — any value or leave blank"
          autoComplete="cc-number"
          inputMode="numeric"
          disabled={isSubmitting}
        />
      </section>

      {submitError && (
        <p role="alert" className="text-sm text-red-600">
          {submitError}
        </p>
      )}

      <Button
        type="submit"
        variant="primary"
        size="lg"
        fullWidth
        disabled={isSubmitting}
      >
        {isSubmitting ? "Completing booking…" : "Complete booking (demo)"}
      </Button>
    </form>
  );
}
