import packageJson from "@/package.json";

export function AppFooter() {
  const serviceVersion = `v${packageJson.version}`;

  return (
    <footer className="border-t border-[var(--app-divider)] bg-[var(--app-canvas-parchment)] py-5">
      <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-2 px-4 sm:px-6">
        <p className="text-xs text-[var(--app-body-muted)]">
          Built by James Gomes · Service {serviceVersion}
        </p>
        <nav
          aria-label="Professional links"
          className="flex items-center gap-3 text-xs leading-7"
        >
          <a
            href="https://github.com/jamesgomes"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--app-body-muted-strong)] underline-offset-2 hover:text-[var(--app-primary)] hover:underline"
          >
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/jamesgomesbr/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--app-body-muted-strong)] underline-offset-2 hover:text-[var(--app-primary)] hover:underline"
          >
            LinkedIn
          </a>
        </nav>
      </div>
    </footer>
  );
}
