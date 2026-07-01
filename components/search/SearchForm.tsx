"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { SearchFormFields } from "@/components/search/SearchFormFields";
import {
  todayIso,
  validateSearchFields,
  type SearchFieldErrors,
  type SearchFields,
} from "@/components/search/searchFormValidation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

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
  const [errors, setErrors] = useState<SearchFieldErrors>({});
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

    const nextErrors = validateSearchFields(fields);
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

  return (
    <Card padding="lg" className="shadow-soft-lg">
      <form onSubmit={handleSubmit} noValidate aria-label="Search stays">
        {formError && (
          <p role="alert" className="mb-6 text-sm text-red-600">
            {formError}
          </p>
        )}

        <SearchFormFields
          fields={fields}
          errors={errors}
          minCheckIn={todayIso()}
          onFieldChange={updateField}
        />

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
