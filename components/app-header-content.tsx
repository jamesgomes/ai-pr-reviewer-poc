"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AppBrand } from "@/components/app-brand";
import { AuthenticatedUserSummary } from "@/components/authenticated-user-summary";
import { LogoutButton } from "@/components/logout-button";
import { ThemeToggle } from "@/components/theme-toggle";
import { buttonVariants } from "@/components/ui/button";
import type { AuthenticatedGitHubUser } from "@/types/github-user";

type AppHeaderContentProps = {
  authenticatedUser: AuthenticatedGitHubUser | null;
};

export function AppHeaderContent({ authenticatedUser }: AppHeaderContentProps) {
  const pathname = usePathname();
  const isLoginRoute = pathname === "/login";

  if (isLoginRoute) {
    return null;
  }

  return (
    <header className="border-b border-zinc-800 bg-[var(--app-surface-dark)] text-[var(--app-on-dark)]">
      <div className="mx-auto flex h-11 w-full max-w-5xl items-center justify-between px-4 sm:px-6">
        <AppBrand />
        <div className="flex items-center gap-2">
          <ThemeToggle />

          {authenticatedUser ? (
            <>
              <AuthenticatedUserSummary user={authenticatedUser} />
              <LogoutButton />
            </>
          ) : (
            <Link href="/login" className={buttonVariants("secondary")}>
              Entrar
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
