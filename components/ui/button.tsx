import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

function joinClasses(...values: Array<string | undefined>): string {
  return values.filter(Boolean).join(" ");
}

const baseButtonClasses =
  "inline-flex h-9 items-center justify-center rounded-md border px-3 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 disabled:cursor-not-allowed disabled:opacity-60";

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "border-blue-700 bg-blue-700 text-white hover:bg-blue-600 dark:border-blue-500 dark:bg-blue-500 dark:text-zinc-950 dark:hover:bg-blue-400",
  secondary:
    "border-zinc-300 bg-white text-zinc-900 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800",
  ghost:
    "border-transparent bg-transparent text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-900",
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
