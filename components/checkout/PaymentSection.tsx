import { Input } from "@/components/ui/Input";
import type { CheckoutFieldErrors, CheckoutFormFields } from "./checkoutFormValidation";

type PaymentSectionProps = {
  fields: CheckoutFormFields;
  fieldErrors: CheckoutFieldErrors;
  isSubmitting: boolean;
  onFieldChange: <K extends keyof CheckoutFormFields>(
    key: K,
    value: CheckoutFormFields[K],
  ) => void;
};

export function PaymentSection({
  fields,
  fieldErrors,
  isSubmitting,
  onFieldChange,
}: PaymentSectionProps) {
  return (
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
          onFieldChange("cardholderName", event.target.value)
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
        onChange={(event) => onFieldChange("cardNumber", event.target.value)}
        placeholder="4242 4242 4242 4242"
        hint="Demo only — any value or leave blank"
        autoComplete="cc-number"
        inputMode="numeric"
        disabled={isSubmitting}
      />
    </section>
  );
}
