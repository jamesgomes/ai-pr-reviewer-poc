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
          className="h-6 w-6 rounded-full border border-white/30"
          unoptimized
        />
      ) : (
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-white/30 bg-white/10 text-xs font-semibold text-white">
          {fallbackLetter}
        </span>
      )}
      <span className="truncate text-sm font-medium text-white">
        {displayName}
      </span>
    </>
  );

  if (!user.profileUrl) {
    return (
      <div
        className={joinClasses(
          "inline-flex max-w-[220px] items-center gap-2 rounded-full border border-white/30 bg-white/5 px-2.5 py-1",
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
        "inline-flex max-w-[220px] items-center gap-2 rounded-full border border-white/30 bg-white/5 px-2.5 py-1 hover:bg-white/15",
        className
      )}
    >
      {content}
    </a>
  );
}
