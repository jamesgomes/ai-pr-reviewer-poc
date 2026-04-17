type LoadingSpinnerProps = {
  label?: string;
  size?: "sm" | "md" | "lg";
};

const spinnerSizeClass = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-8 w-8",
};

export function LoadingSpinner({
  label = "Carregando...",
  size = "md",
}: LoadingSpinnerProps) {
  return (
    <div
      className="inline-flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400"
      role="status"
      aria-live="polite"
    >
      <svg
        viewBox="0 0 24 24"
        aria-hidden
        className={`${spinnerSizeClass[size]} animate-spin text-zinc-500 dark:text-zinc-400`}
      >
        <circle
          cx="12"
          cy="12"
          r="9"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          opacity="0.2"
        />
        <path
          d="M12 3a9 9 0 0 1 9 9"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="2"
        />
      </svg>
      <span>{label}</span>
    </div>
  );
}
