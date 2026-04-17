import Image from "next/image";

type PullRequestAuthorProps = {
  login: string;
  avatarUrl: string | null;
  size?: "sm" | "md";
};

const avatarSizeClasses = {
  sm: "h-6 w-6 text-xs",
  md: "h-8 w-8 text-sm",
};

const avatarPixelSize = {
  sm: 24,
  md: 32,
};

export function PullRequestAuthor({
  login,
  avatarUrl,
  size = "sm",
}: PullRequestAuthorProps) {
  const fallbackLetter = login.trim().charAt(0).toUpperCase() || "?";
  const avatarSizeClass = avatarSizeClasses[size];

  return (
    <div className="inline-flex items-center gap-2">
      {avatarUrl ? (
        <Image
          src={avatarUrl}
          alt={`Avatar de ${login}`}
          width={avatarPixelSize[size]}
          height={avatarPixelSize[size]}
          className={`${avatarSizeClass} rounded-full border border-zinc-200 object-cover dark:border-zinc-700`}
          unoptimized
        />
      ) : (
        <span
          className={`${avatarSizeClass} inline-flex items-center justify-center rounded-full border border-zinc-200 bg-zinc-100 font-semibold text-zinc-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300`}
          aria-hidden
        >
          {fallbackLetter}
        </span>
      )}
      <span className="text-zinc-700 dark:text-zinc-300">@{login}</span>
    </div>
  );
}
