import Link from "next/link";

export function AppBrand() {
  return (
    <Link
      href="/"
      className="inline-flex items-center gap-2 rounded-md px-1.5 py-1 text-zinc-900 hover:bg-zinc-200/70 dark:text-zinc-100 dark:hover:bg-zinc-800/70"
    >
      <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-zinc-900 text-[10px] font-bold tracking-wide text-white dark:bg-zinc-100 dark:text-zinc-900">
        PR
      </span>
      <span className="hidden text-sm font-semibold sm:inline">AI PR Reviewer</span>
    </Link>
  );
}
