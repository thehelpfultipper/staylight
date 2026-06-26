import { cn } from "@/lib/utils/cn";

export type SelectOption = {
  value: string;
  label: string;
};

export type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  options: SelectOption[];
  error?: string;
  placeholder?: string;
};

export function Select({
  label,
  options,
  error,
  placeholder,
  id,
  className,
  required,
  ...props
}: SelectProps) {
  const selectId = id ?? props.name;

  return (
    <div className="space-y-2">
      <label
        htmlFor={selectId}
        className="block text-sm font-medium text-foreground"
      >
        {label}
        {required && (
          <span className="ml-0.5 text-muted" aria-hidden>
            *
          </span>
        )}
      </label>
      <div className="relative">
        <select
          id={selectId}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${selectId}-error` : undefined}
          className={cn(
            "h-12 w-full appearance-none rounded-2xl border bg-background px-4 pr-10 text-sm text-foreground",
            "transition-colors focus-visible:border-border-strong focus-visible:outline-none",
            error
              ? "border-red-500/60 focus-visible:border-red-500/60"
              : "border-border hover:border-border-strong",
            className,
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <span
          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted"
          aria-hidden
        >
          ▾
        </span>
      </div>
      {error && (
        <p
          id={`${selectId}-error`}
          role="alert"
          className="text-xs text-red-600"
        >
          {error}
        </p>
      )}
    </div>
  );
}
