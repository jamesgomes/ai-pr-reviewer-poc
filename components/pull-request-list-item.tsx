import Link from "next/link";
import { PullRequestAuthor } from "@/components/pr-author";
import { PullRequestStatus } from "@/components/pull-request-status";
import type { PullRequestLocalReviewState } from "@/lib/storage/pr-analysis-storage";
import type { PullRequestListItem } from "@/types/pull-request";

type PullRequestListItemRowProps = {
  pullRequest: PullRequestListItem;
  reviewState?: PullRequestLocalReviewState;
  isMine?: boolean;
  mineBadgeLabel?: string;
};

function formatUpdatedAt(value: string): string {
  return new Date(value).toLocaleDateString("pt-BR", {
    dateStyle: "medium",
  });
}

function toPullRequestDetailsPath(pullRequest: PullRequestListItem): string {
  return `/pull-requests/${encodeURIComponent(pullRequest.repositoryOwner)}/${encodeURIComponent(pullRequest.repositoryName)}/${pullRequest.number}`;
}

function formatPublishedAt(value: string): string {
  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return value;
  }

  return parsedDate.toLocaleString("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

export function PullRequestListItemRow({
  pullRequest,
  reviewState,
  isMine = false,
  mineBadgeLabel = "Meu PR",
}: PullRequestListItemRowProps) {
  const isReviewed = reviewState?.isReviewed ?? false;

  return (
    <li>
      <Link
        href={toPullRequestDetailsPath(pullRequest)}
        className="grid grid-cols-[1fr_auto] gap-3 px-4 py-3 hover:bg-zinc-50 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-blue-500 dark:hover:bg-zinc-900"
      >
        <div className="min-w-0">
          <div className="flex items-start gap-2">
            <PullRequestStatus state={pullRequest.state} />
            <h2 className="truncate text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              {pullRequest.title}
            </h2>
            {isMine && (
              <span className="inline-flex shrink-0 rounded-full border border-zinc-300 bg-zinc-100 px-2 py-0.5 text-[11px] font-semibold text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
                {mineBadgeLabel}
              </span>
            )}
            {!isMine && isReviewed && (
              <span className="inline-flex shrink-0 rounded-full border border-blue-300 bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-blue-700 dark:border-blue-900 dark:bg-blue-950/30 dark:text-blue-300">
                Revisado
              </span>
            )}
          </div>

          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-zinc-600 dark:text-zinc-400">
            <span>
              {pullRequest.repositoryOwner}/{pullRequest.repositoryName}
            </span>
            <span>#{pullRequest.number}</span>
            <PullRequestAuthor
              login={pullRequest.authorLogin}
              avatarUrl={pullRequest.authorAvatarUrl}
            />
            <span>Atualizado em {formatUpdatedAt(pullRequest.updatedAt)}</span>
            {isReviewed && reviewState?.lastPublishedAt && (
              <span>Última publicação: {formatPublishedAt(reviewState.lastPublishedAt)}</span>
            )}
          </div>
        </div>

        <div className="flex min-w-[52px] items-center justify-end">
          <span className="inline-flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400">
            <svg
              viewBox="0 0 16 16"
              aria-hidden
              className="h-3.5 w-3.5"
              fill="currentColor"
            >
              <path d="M2.5 2A1.5 1.5 0 0 0 1 3.5v6A1.5 1.5 0 0 0 2.5 11H4v2.2c0 .7.8 1.1 1.4.7L8.2 11h5.3A1.5 1.5 0 0 0 15 9.5v-6A1.5 1.5 0 0 0 13.5 2h-11Z" />
            </svg>
            <span>{pullRequest.commentCount}</span>
          </span>
        </div>
      </Link>
    </li>
  );
}
