"use client";

import { useEffect, useMemo, useState } from "react";
import { PullRequestListItemRow } from "@/components/pull-request-list-item";
import {
  PullRequestTabs,
  type PullRequestTab,
} from "@/components/pull-request-tabs";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import {
  readPullRequestLocalReviewState,
  type PullRequestLocalReviewState,
} from "@/lib/storage/pr-analysis-storage";
import type {
  ApiErrorResponse,
  PullRequestListItem,
  PullRequestListResponse,
} from "@/types/pull-request";

type DashboardState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "empty" }
  | {
      status: "loaded";
      pullRequests: PullRequestListItem[];
      githubUserStorageKey: string;
    };

function toErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return "Não foi possível carregar os Pull Requests.";
}

type PullRequestWithLocalReviewState = {
  pullRequest: PullRequestListItem;
  reviewState: PullRequestLocalReviewState;
};

export default function HomePage() {
  const [state, setState] = useState<DashboardState>({ status: "loading" });
  const [activeTab, setActiveTab] = useState<PullRequestTab>("pending");

  useEffect(() => {
    let cancelled = false;

    async function loadPullRequests() {
      try {
        const response = await fetch("/api/pull-requests", { cache: "no-store" });
        const payload = (await response.json()) as PullRequestListResponse | ApiErrorResponse;

        if (!response.ok) {
          const message =
            "error" in payload
              ? payload.error
              : "Não foi possível buscar os Pull Requests pendentes.";

          if (!cancelled) {
            setState({ status: "error", message });
          }

          return;
        }

        if (!("pullRequests" in payload)) {
          throw new Error("Resposta inválida da API de Pull Requests.");
        }

        if (!cancelled) {
          const githubUserStorageKey = payload.authenticatedUser.storageKey;

          setState(
            payload.pullRequests.length === 0
              ? { status: "empty" }
              : {
                  status: "loaded",
                  pullRequests: payload.pullRequests,
                  githubUserStorageKey,
                }
          );
        }
      } catch (error: unknown) {
        if (!cancelled) {
          setState({
            status: "error",
            message: `Não foi possível carregar os Pull Requests. ${toErrorMessage(error)}`,
          });
        }
      }
    }

    void loadPullRequests();

    return () => {
      cancelled = true;
    };
  }, []);

  const pullRequestsWithLocalReviewState = useMemo<PullRequestWithLocalReviewState[]>(() => {
    if (state.status !== "loaded") {
      return [];
    }

    return state.pullRequests.map((pullRequest) => ({
      pullRequest,
      reviewState: readPullRequestLocalReviewState({
        githubUserKey: state.githubUserStorageKey,
        owner: pullRequest.repositoryOwner,
        repo: pullRequest.repositoryName,
        pullNumber: pullRequest.number,
      }),
    }));
  }, [state]);

  const pendingPullRequests = pullRequestsWithLocalReviewState.filter(
    (entry) => !entry.reviewState.isReviewed
  );
  const reviewedPullRequests = pullRequestsWithLocalReviewState.filter(
    (entry) => entry.reviewState.isReviewed
  );
  const visiblePullRequests =
    activeTab === "pending" ? pendingPullRequests : reviewedPullRequests;

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6">
      <header className="mb-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
            Pull Requests para revisão
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            PRs abertos em que você foi solicitado como revisor.
          </p>
        </div>
      </header>

      {state.status === "loading" && (
        <div className="rounded-md border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <LoadingSpinner label="Atualizando lista de PRs..." />
        </div>
      )}

      {state.status === "error" && (
        <p className="rounded-md border border-red-300 bg-red-50 p-4 text-sm text-red-800 dark:border-red-900/80 dark:bg-red-950/30 dark:text-red-300">
          {state.message}
        </p>
      )}

      {state.status === "empty" && (
        <p className="rounded-md border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
          Nenhum PR pendente no momento.
        </p>
      )}

      {state.status === "loaded" && (
        <div>
          <PullRequestTabs
            activeTab={activeTab}
            pendingCount={pendingPullRequests.length}
            reviewedCount={reviewedPullRequests.length}
            onChangeTab={setActiveTab}
          />

          {visiblePullRequests.length === 0 ? (
            <p className="rounded-md border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
              {activeTab === "pending"
                ? "Nenhum PR pendente nesta aba."
                : "Nenhum PR revisado localmente ainda."}
            </p>
          ) : (
            <ul className="overflow-hidden rounded-md border border-zinc-200 bg-white divide-y divide-zinc-200 dark:border-zinc-800 dark:bg-zinc-950 dark:divide-zinc-800">
              {visiblePullRequests.map(({ pullRequest, reviewState }) => (
                <PullRequestListItemRow
                  key={pullRequest.id}
                  pullRequest={pullRequest}
                  reviewState={reviewState}
                />
              ))}
            </ul>
          )}
        </div>
      )}
    </main>
  );
}
