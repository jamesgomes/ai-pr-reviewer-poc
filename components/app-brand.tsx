import Link from "next/link";

export function AppBrand() {
  return (
    <Link
      href="/"
      className="inline-flex items-center gap-2 rounded-md px-1.5 py-1 text-[var(--app-on-dark)] hover:bg-white/10"
    >
      <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-[var(--app-on-dark)] text-[10px] font-bold tracking-wide text-[var(--app-surface-dark)]">
        PR
      </span>
      <span className="hidden text-sm font-semibold tracking-tight sm:inline">
        AI Reviewer
      </span>
    </Link>
  );
}
