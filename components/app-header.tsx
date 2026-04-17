import { AppBrand } from "@/components/app-brand";
import { AuthenticatedUserSummary } from "@/components/authenticated-user-summary";
import { ThemeToggle } from "@/components/theme-toggle";
import { getAuthenticatedGitHubUser } from "@/lib/github";
import type { AuthenticatedGitHubUser } from "@/types/github-user";

async function loadAuthenticatedUser(): Promise<AuthenticatedGitHubUser | null> {
  try {
    return await getAuthenticatedGitHubUser();
  } catch {
    return null;
  }
}

export async function AppHeader() {
  const authenticatedUser = await loadAuthenticatedUser();

  return (
    <header className="border-b border-zinc-200 bg-zinc-100/90 dark:border-zinc-800 dark:bg-zinc-950/90">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-2 sm:px-6">
        <AppBrand />
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {authenticatedUser ? (
            <AuthenticatedUserSummary user={authenticatedUser} />
          ) : null}
        </div>
      </div>
    </header>
  );
}
