export type CheckoutFormFields = {
  guestName: string;
  email: string;
  specialRequest: string;
  cardholderName: string;
  cardNumber: string;
};

export type CheckoutFieldErrors = Partial<
  Record<keyof CheckoutFormFields, string>
>;

export function validateCheckoutFields(
  fields: CheckoutFormFields,
): CheckoutFieldErrors {
  const errors: CheckoutFieldErrors = {};
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
