"use client";

import { GuestDetailsSection } from "@/components/checkout/GuestDetailsSection";
import { PaymentSection } from "@/components/checkout/PaymentSection";
import { Button } from "@/components/ui/Button";
import { useCheckoutForm } from "@/lib/hooks/useCheckoutForm";

type CheckoutFormProps = {
  stayId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
};

export function CheckoutForm({
  stayId,
  checkIn,
  checkOut,
  guests,
}: CheckoutFormProps) {
  const {
    fields,
    setFields,
    fieldErrors,
    submitError,
    isSubmitting,
    handleSubmit,
  } = useCheckoutForm({ stayId, checkIn, checkOut, guests });

  function updateField<K extends keyof typeof fields>(
    key: K,
    value: (typeof fields)[K],
  ) {
    setFields((current) => ({ ...current, [key]: value }));
  }

  return (
    <form
      onSubmit={(event) => void handleSubmit(event)}
      className="space-y-8"
      aria-busy={isSubmitting}
      aria-label="Complete booking"
      noValidate
    >
      <GuestDetailsSection
        fields={fields}
        fieldErrors={fieldErrors}
        isSubmitting={isSubmitting}
        onFieldChange={updateField}
      />

      <PaymentSection
        fields={fields}
        fieldErrors={fieldErrors}
        isSubmitting={isSubmitting}
        onFieldChange={updateField}
      />

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
