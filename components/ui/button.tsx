import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "positive" | "danger" | "apple";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

function joinClasses(...values: Array<string | undefined>): string {
  return values.filter(Boolean).join(" ");
}

const baseButtonClasses =
  "inline-flex h-10 items-center justify-center rounded-full border px-4 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--app-primary-focus)] disabled:cursor-not-allowed disabled:opacity-60";

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "border-[var(--app-primary)] bg-[var(--app-primary)] text-[var(--app-on-primary)] hover:bg-[var(--app-primary-focus)] hover:border-[var(--app-primary-focus)]",
  secondary:
    "border-[var(--app-divider)] bg-[var(--app-canvas)] text-[var(--app-ink)] hover:bg-[var(--app-canvas-parchment)]",
  ghost:
    "border-transparent bg-transparent text-[var(--app-body-muted-strong)] hover:bg-[var(--app-canvas-parchment)]",
  positive:
    "border-emerald-600 bg-emerald-600 text-white hover:border-emerald-500 hover:bg-emerald-500",
  danger:
    "border-red-600 bg-red-600 text-white hover:border-red-500 hover:bg-red-500",
  apple:
    "h-11 border-[var(--app-primary)] bg-[var(--app-primary)] px-6 text-[var(--app-on-primary)] hover:bg-[var(--app-primary-focus)] hover:border-[var(--app-primary-focus)]",
};

export function buttonVariants(variant: ButtonVariant = "secondary"): string {
  return joinClasses(baseButtonClasses, variantClasses[variant]);
}

export function Button({
  variant = "secondary",
  className,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={joinClasses(buttonVariants(variant), className)}
      {...props}
    />
  );
}
