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
    <header
      className={`border-b backdrop-blur-sm ${
        "border-zinc-200 bg-zinc-100/90 dark:border-zinc-800 dark:bg-zinc-950/90"
      }`}
    >
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-2 sm:px-6">
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
