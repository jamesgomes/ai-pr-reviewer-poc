"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { PullRequestAuthor } from "@/components/pr-author";
import { ThemeToggle } from "@/components/theme-toggle";
import { buttonVariants } from "@/components/ui/button";
import type {
  ApiErrorResponse,
  PullRequestListItem,
  PullRequestListResponse,
} from "@/types/pull-request";

type DashboardState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "empty" }
  | { status: "loaded"; pullRequests: PullRequestListItem[] };

function toErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return "Nao foi possivel carregar os PRs.";
}

function formatUpdatedAt(value: string): string {
  return new Date(value).toLocaleString("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

function toPullRequestDetailsPath(pullRequest: PullRequestListItem): string {
  return `/pull-requests/${encodeURIComponent(pullRequest.repositoryOwner)}/${encodeURIComponent(pullRequest.repositoryName)}/${pullRequest.number}`;
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
              : { status: "loaded", pullRequests: payload.pullRequests }
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
      <header className="mb-5 flex items-start justify-between gap-4 border-b border-zinc-200 pb-4 dark:border-zinc-800">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
            Pull requests para revisao
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            PRs abertos onde voce foi solicitado como reviewer.
          </p>
        </div>
        <ThemeToggle />
      </header>

      {state.status === "loading" && (
        <p className="rounded-md border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
          Carregando PRs pendentes...
        </p>
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
        <ul className="divide-y divide-zinc-200 rounded-md border border-zinc-200 bg-white dark:divide-zinc-800 dark:border-zinc-800 dark:bg-zinc-950">
          {state.pullRequests.map((pullRequest) => (
            <li key={pullRequest.id} className="p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <Link
                    href={toPullRequestDetailsPath(pullRequest)}
                    className="rounded-sm text-base font-semibold text-zinc-900 hover:text-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 dark:text-zinc-100 dark:hover:text-blue-400"
                  >
                    {pullRequest.title}
                  </Link>
                  <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-zinc-600 dark:text-zinc-400">
                    <p>
                      Repositorio: {pullRequest.repositoryOwner}/{pullRequest.repositoryName}
                    </p>
                    <p>PR #{pullRequest.number}</p>
                    <p>Atualizado em: {formatUpdatedAt(pullRequest.updatedAt)}</p>
                    <PullRequestAuthor
                      login={pullRequest.authorLogin}
                      avatarUrl={pullRequest.authorAvatarUrl}
                    />
                  </div>
                </div>

                <Link
                  href={toPullRequestDetailsPath(pullRequest)}
                  className={buttonVariants("ghost")}
                >
                  Ver detalhes
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
