"use client";

import { useEffect, useState } from "react";
import { PullRequestListItemRow } from "@/components/pull-request-list-item";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
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
    };

function toErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return "Nao foi possivel carregar os PRs.";
}

export default function HomePage() {
  const [state, setState] = useState<DashboardState>({ status: "loading" });

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
              : "Falha ao buscar os PRs pendentes de revisao.";

          if (!cancelled) {
            setState({ status: "error", message });
          }

          return;
        }

        if (!("pullRequests" in payload)) {
          throw new Error("Resposta invalida da API de pull requests.");
        }

        if (!cancelled) {
          setState(
            payload.pullRequests.length === 0
              ? { status: "empty" }
              : {
                  status: "loaded",
                  pullRequests: payload.pullRequests,
                }
          );
        }
      } catch (error: unknown) {
        if (!cancelled) {
          setState({
            status: "error",
            message: `Erro ao carregar PRs. ${toErrorMessage(error)}`,
          });
        }
      }
    }

    void loadPullRequests();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6">
      <header className="mb-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
            Pull requests para revisao
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            PRs abertos onde voce foi solicitado como reviewer.
          </p>
        </div>
      </header>

      {state.status === "loading" && (
        <div className="rounded-md border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <LoadingSpinner label="Atualizando fila de PRs..." />
        </div>
      )}

      {state.status === "error" && (
        <p className="rounded-md border border-red-300 bg-red-50 p-4 text-sm text-red-800 dark:border-red-900/80 dark:bg-red-950/30 dark:text-red-300">
          {state.message}
        </p>
      )}

      {state.status === "empty" && (
        <p className="rounded-md border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
          Nenhum PR pendente de revisao no momento.
        </p>
      )}

      {state.status === "loaded" && (
        <ul className="overflow-hidden rounded-md border border-zinc-200 bg-white divide-y divide-zinc-200 dark:border-zinc-800 dark:bg-zinc-950 dark:divide-zinc-800">
          {state.pullRequests.map((pullRequest) => (
            <PullRequestListItemRow key={pullRequest.id} pullRequest={pullRequest} />
          ))}
        </ul>
      )}
    </main>
  );
}
