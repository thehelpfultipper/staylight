"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { isDateRangeValid } from "@/lib/utils/dates";
import type { TripType } from "@/types/search";

const TRIP_TYPE_OPTIONS = [
  { value: "leisure", label: "Leisure" },
  { value: "business", label: "Business" },
  { value: "family", label: "Family" },
  { value: "budget", label: "Budget" },
  { value: "romantic", label: "Romantic" },
] as const satisfies ReadonlyArray<{ value: TripType; label: string }>;

const GUEST_OPTIONS = Array.from({ length: 10 }, (_, i) => ({
  value: String(i + 1),
  label: i + 1 === 1 ? "1 guest" : `${i + 1} guests`,
}));

type SearchFields = {
  destination: string;
  checkIn: string;
  checkOut: string;
  guests: string;
  budget: string;
  tripType: TripType | "";
};

type FieldErrors = Partial<Record<keyof SearchFields, string>>;

function todayIso(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function validate(fields: SearchFields): FieldErrors {
  const errors: FieldErrors = {};

  if (!fields.destination.trim()) {
    errors.destination = "Enter a destination city.";
  }

  if (!fields.checkIn) {
    errors.checkIn = "Select a check-in date.";
  }

  if (!fields.checkOut) {
    errors.checkOut = "Select a check-out date.";
  }

  if (fields.checkIn && fields.checkOut) {
    if (!isDateRangeValid(fields.checkIn, fields.checkOut)) {
      errors.checkOut = "Check-out must be after check-in and not in the past.";
    }
  }

  const guestCount = Number(fields.guests);
  if (!fields.guests || guestCount < 1) {
    errors.guests = "Select at least one guest.";
  }

  if (fields.budget.trim()) {
    const budget = Number(fields.budget);
    if (Number.isNaN(budget) || budget <= 0) {
      errors.budget = "Enter a valid nightly budget.";
    }
  }

  if (!fields.tripType) {
    errors.tripType = "Choose a trip type.";
  }

  return errors;
}

export function SearchForm() {
  const router = useRouter();
  const [fields, setFields] = useState<SearchFields>({
    destination: "",
    checkIn: "",
    checkOut: "",
    guests: "2",
    budget: "",
    tripType: "leisure",
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);

  function updateField<K extends keyof SearchFields>(
    key: K,
    value: SearchFields[K],
  ) {
    setFields((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
    setFormError(null);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validate(fields);
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setFormError("Please fix the highlighted fields.");
      return;
    }

    const params = new URLSearchParams({
      destination: fields.destination.trim(),
      checkIn: fields.checkIn,
      checkOut: fields.checkOut,
      guests: fields.guests,
      tripType: fields.tripType,
    });

    if (fields.budget.trim()) {
      params.set("budget", fields.budget.trim());
    }

    router.push(`/stays?${params.toString()}`);
  }

  const minCheckIn = todayIso();

  return (
    <Card padding="lg" className="shadow-soft-lg">
      <form onSubmit={handleSubmit} noValidate aria-label="Search stays">
        {formError && (
          <p role="alert" className="mb-6 text-sm text-red-600">
            {formError}
          </p>
        )}

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          <div className="sm:col-span-2 lg:col-span-3">
            <Input
              name="destination"
              label="Destination"
              placeholder="City or neighborhood"
              value={fields.destination}
              onChange={(e) => updateField("destination", e.target.value)}
              error={errors.destination}
              required
              autoComplete="address-level2"
            />
          </div>

          <Input
            name="checkIn"
            type="date"
            label="Check-in"
            value={fields.checkIn}
            min={minCheckIn}
            onChange={(e) => updateField("checkIn", e.target.value)}
            error={errors.checkIn}
            required
          />

          <Input
            name="checkOut"
            type="date"
            label="Check-out"
            value={fields.checkOut}
            min={fields.checkIn || minCheckIn}
            onChange={(e) => updateField("checkOut", e.target.value)}
            error={errors.checkOut}
            required
          />

          <Select
            name="guests"
            label="Guests"
            options={GUEST_OPTIONS}
            value={fields.guests}
            onChange={(e) => updateField("guests", e.target.value)}
            error={errors.guests}
            required
          />

          <Input
            name="budget"
            type="number"
            label="Budget per night"
            placeholder="Optional — e.g. 200"
            min={1}
            inputMode="numeric"
            value={fields.budget}
            onChange={(e) => updateField("budget", e.target.value)}
            error={errors.budget}
            hint="USD per night, before taxes"
          />

          <Select
            name="tripType"
            label="Trip type"
            options={[...TRIP_TYPE_OPTIONS]}
            value={fields.tripType}
            onChange={(e) =>
              updateField("tripType", e.target.value as TripType | "")
            }
            error={errors.tripType}
            required
          />
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted">
            Smart Match will rank results for your trip.
          </p>
          <Button type="submit" size="lg" className="sm:min-w-[160px]">
            Search stays
          </Button>
        </div>
      </form>
    </Card>
  );
}
