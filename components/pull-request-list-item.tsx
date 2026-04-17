import Link from "next/link";
import { PullRequestAuthor } from "@/components/pr-author";
import { PullRequestStatus } from "@/components/pull-request-status";
import type { PullRequestListItem } from "@/types/pull-request";

type PullRequestListItemRowProps = {
  pullRequest: PullRequestListItem;
};

function formatUpdatedAt(value: string): string {
  return new Date(value).toLocaleDateString("pt-BR", {
    dateStyle: "medium",
  });
}

function toPullRequestDetailsPath(pullRequest: PullRequestListItem): string {
  return `/pull-requests/${encodeURIComponent(pullRequest.repositoryOwner)}/${encodeURIComponent(pullRequest.repositoryName)}/${pullRequest.number}`;
}

export function PullRequestListItemRow({
  pullRequest,
}: PullRequestListItemRowProps) {
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
