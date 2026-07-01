import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils/cn";
import type { CheckoutFieldErrors, CheckoutFormFields } from "./checkoutFormValidation";

type GuestDetailsSectionProps = {
  fields: CheckoutFormFields;
  fieldErrors: CheckoutFieldErrors;
  isSubmitting: boolean;
  onFieldChange: <K extends keyof CheckoutFormFields>(
    key: K,
    value: CheckoutFormFields[K],
  ) => void;
};

export function GuestDetailsSection({
  fields,
  fieldErrors,
  isSubmitting,
  onFieldChange,
}: GuestDetailsSectionProps) {
  return (
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
        onChange={(event) => onFieldChange("guestName", event.target.value)}
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
        onChange={(event) => onFieldChange("email", event.target.value)}
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
          <span className="ml-1 text-xs font-normal text-muted">(optional)</span>
        </label>
        <textarea
          id="special-request"
          name="specialRequest"
          rows={3}
          value={fields.specialRequest}
          onChange={(event) =>
            onFieldChange("specialRequest", event.target.value)
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
  );
}
