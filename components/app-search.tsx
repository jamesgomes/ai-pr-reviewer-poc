export function AppSearch() {
  return (
    <div className="flex h-9 items-center gap-2 rounded-md border border-zinc-300 bg-white px-2.5 dark:border-zinc-700 dark:bg-zinc-900">
      <svg
        viewBox="0 0 16 16"
        aria-hidden
        className="h-4 w-4 text-zinc-500 dark:text-zinc-400"
        fill="currentColor"
      >
        <path d="M6.5 1.75a4.75 4.75 0 1 1 2.98 8.45l3.41 3.4a.75.75 0 1 1-1.06 1.06l-3.4-3.41A4.75 4.75 0 0 1 6.5 1.75Zm0 1.5a3.25 3.25 0 1 0 0 6.5 3.25 3.25 0 0 0 0-6.5Z" />
      </svg>
      <label htmlFor="app-search" className="sr-only">
        Buscar
      </label>
      <input
        id="app-search"
        type="search"
        placeholder="Buscar..."
        className="w-full bg-transparent text-sm text-zinc-800 outline-none placeholder:text-zinc-500 dark:text-zinc-100 dark:placeholder:text-zinc-400"
      />
      <kbd className="hidden rounded border border-zinc-300 bg-zinc-100 px-1 text-[10px] text-zinc-500 md:inline-block dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400">
        /
      </kbd>
    </div>
  );
}
