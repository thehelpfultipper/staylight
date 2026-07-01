import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { GUEST_OPTIONS, TRIP_TYPE_OPTIONS } from "@/components/search/searchFormConstants";
import type { SearchFieldErrors, SearchFields } from "@/components/search/searchFormValidation";
import type { TripType } from "@/types/search";

type SearchFormFieldsProps = {
  fields: SearchFields;
  errors: SearchFieldErrors;
  minCheckIn: string;
  onFieldChange: <K extends keyof SearchFields>(
    key: K,
    value: SearchFields[K],
  ) => void;
};

export function SearchFormFields({
  fields,
  errors,
  minCheckIn,
  onFieldChange,
}: SearchFormFieldsProps) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
      <div className="sm:col-span-2 lg:col-span-3">
        <Input
          name="destination"
          label="Destination"
          placeholder="City or neighborhood"
          value={fields.destination}
          onChange={(e) => onFieldChange("destination", e.target.value)}
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
        onChange={(e) => onFieldChange("checkIn", e.target.value)}
        error={errors.checkIn}
        required
      />

      <Input
        name="checkOut"
        type="date"
        label="Check-out"
        value={fields.checkOut}
        min={fields.checkIn || minCheckIn}
        onChange={(e) => onFieldChange("checkOut", e.target.value)}
        error={errors.checkOut}
        required
      />

      <Select
        name="guests"
        label="Guests"
        options={GUEST_OPTIONS}
        value={fields.guests}
        onChange={(e) => onFieldChange("guests", e.target.value)}
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
        onChange={(e) => onFieldChange("budget", e.target.value)}
        error={errors.budget}
        hint="USD per night, before taxes"
      />

      <Select
        name="tripType"
        label="Trip type"
        options={[...TRIP_TYPE_OPTIONS]}
        value={fields.tripType}
        onChange={(e) =>
          onFieldChange("tripType", e.target.value as TripType | "")
        }
        error={errors.tripType}
        required
      />
    </div>
  );
}
