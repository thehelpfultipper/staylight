import { cn } from "@/lib/utils/cn";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
};

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-foreground text-background hover:opacity-90 active:opacity-80 disabled:opacity-40",
  secondary:
    "border border-border-strong bg-surface text-foreground hover:bg-background active:bg-background disabled:opacity-40",
  ghost:
    "text-foreground hover:bg-background active:bg-background disabled:opacity-40",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-base",
};

export function Button({
  variant = "primary",
  size = "md",
  fullWidth = false,
  className,
  type = "button",
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={cn(
        "inline-flex items-center justify-center rounded-2xl font-medium tracking-tight transition-opacity",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground",
        variantStyles[variant],
        sizeStyles[size],
        fullWidth && "w-full",
        disabled && "cursor-not-allowed",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
