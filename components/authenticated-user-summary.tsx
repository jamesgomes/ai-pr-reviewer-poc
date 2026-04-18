import Image from "next/image";
import type { AuthenticatedGitHubUser } from "@/types/github-user";

type AuthenticatedUserSummaryProps = {
  user: AuthenticatedGitHubUser;
  className?: string;
};

function joinClasses(...values: Array<string | undefined>): string {
  return values.filter(Boolean).join(" ");
}

export function AuthenticatedUserSummary({
  user,
  className,
}: AuthenticatedUserSummaryProps) {
  const displayName = user.name?.trim() || user.login;
  const fallbackLetter = user.login.trim().charAt(0).toUpperCase() || "?";
  const content = (
    <>
      {user.avatarUrl ? (
        <Image
          src={user.avatarUrl}
          alt={`Avatar de ${user.login}`}
          width={24}
          height={24}
          className="h-6 w-6 rounded-full border border-zinc-200 dark:border-zinc-700"
          unoptimized
        />
      ) : (
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-zinc-200 bg-zinc-100 text-xs font-semibold text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
          {fallbackLetter}
        </span>
      )}
      <span className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">
        {displayName}
      </span>
    </>
  );

  if (!user.profileUrl) {
    return (
      <div
        className={joinClasses(
          "inline-flex max-w-[220px] items-center gap-2 rounded-md border border-zinc-300 bg-white px-2 py-1.5 dark:border-zinc-700 dark:bg-zinc-900",
          className
        )}
      >
        {content}
      </div>
    );
  }

  return (
    <a
      href={user.profileUrl}
      target="_blank"
      rel="noreferrer"
      className={joinClasses(
        "inline-flex max-w-[220px] items-center gap-2 rounded-md border border-zinc-300 bg-white px-2 py-1.5 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:bg-zinc-800",
        className
      )}
    >
      {content}
    </a>
  );
}
