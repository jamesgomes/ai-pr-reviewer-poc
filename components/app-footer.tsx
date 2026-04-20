export function AppFooter() {
  return (
    <footer className="border-t border-zinc-200/80 py-4 dark:border-zinc-800/80">
      <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-2 px-4 sm:px-6">
        <p className="text-xs text-zinc-600 dark:text-zinc-400">Built by James Gomes</p>
        <nav
          aria-label="Professional links"
          className="flex items-center gap-3 text-xs"
        >
          <a
            href="https://github.com/jamesgomes"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-600 underline-offset-2 hover:text-zinc-900 hover:underline dark:text-zinc-400 dark:hover:text-zinc-200"
          >
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/jamesgomesbr/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-600 underline-offset-2 hover:text-zinc-900 hover:underline dark:text-zinc-400 dark:hover:text-zinc-200"
          >
            LinkedIn
          </a>
        </nav>
      </div>
    </footer>
  );
}
