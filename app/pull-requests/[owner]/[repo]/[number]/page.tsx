import Link from "next/link";
import { PullRequestAuthor } from "@/components/pr-author";
import { PullRequestAnalysisSectionClient } from "@/components/pr-analysis-section-client";
import { PullRequestMarkdownPreview } from "@/components/pr-markdown-preview";
import { buttonVariants } from "@/components/ui/button";
import { getPullRequestDetails } from "@/lib/pull-requests";
import type { PullRequestDetail } from "@/types/pull-request";

type PullRequestDetailsPageProps = {
  params: Promise<{
    owner: string;
    repo: string;
    number: string;
  }>;
};

function formatUpdatedAt(value: string): string {
  return new Date(value).toLocaleString("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

function toErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return "Erro desconhecido ao carregar detalhes do PR.";
}

type PullRequestDetailsResult =
  | { ok: true; pullRequest: PullRequestDetail }
  | { ok: false; errorMessage: string };

async function loadPullRequestDetails(
  owner: string,
  repo: string,
  pullNumber: number
): Promise<PullRequestDetailsResult> {
  try {
    const pullRequest = await getPullRequestDetails(owner, repo, pullNumber);
    return { ok: true, pullRequest };
  } catch (error: unknown) {
    return {
      ok: false,
      errorMessage: `Nao foi possivel carregar os detalhes do PR. ${toErrorMessage(error)}`,
    };
  }
}

export default async function PullRequestDetailsPage({
  params,
}: PullRequestDetailsPageProps) {
  const { owner, repo, number } = await params;
  const pullNumber = Number.parseInt(number, 10);

  if (Number.isNaN(pullNumber)) {
    return (
      <main className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6">
        <p className="rounded-md border border-red-300 bg-red-50 p-4 text-sm text-red-800 dark:border-red-900/80 dark:bg-red-950/30 dark:text-red-300">
          Numero de PR invalido.
        </p>
      </main>
    );
  }

  const result = await loadPullRequestDetails(owner, repo, pullNumber);

  if (!result.ok) {
    return (
      <main className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6">
        <div className="mb-4">
          <Link
            href="/"
            className={buttonVariants("ghost")}
          >
            Voltar para lista
          </Link>
        </div>
        <p className="rounded-md border border-red-300 bg-red-50 p-4 text-sm text-red-800 dark:border-red-900/80 dark:bg-red-950/30 dark:text-red-300">
          {result.errorMessage}
        </p>
      </main>
    );
  }

  const { pullRequest } = result;

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Link href="/" className={buttonVariants("secondary")}>
          Voltar para lista
        </Link>
        <a
          href={pullRequest.url}
          target="_blank"
          rel="noreferrer"
          className={buttonVariants("primary")}
        >
          Abrir no GitHub
        </a>
      </div>

      <section className="rounded-md border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
        <header className="border-b border-zinc-200 px-4 py-4 dark:border-zinc-800 sm:px-5">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
            {pullRequest.title}
          </h1>

          <div className="mt-4 grid gap-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-zinc-500 dark:text-zinc-400">Autor</span>
              <PullRequestAuthor
                login={pullRequest.authorLogin}
                avatarUrl={pullRequest.authorAvatarUrl}
                size="md"
              />
            </div>

            <div className="flex flex-wrap gap-x-4 gap-y-1 text-zinc-600 dark:text-zinc-400">
              <p>
                Repositorio:{" "}
                <span className="text-zinc-800 dark:text-zinc-200">
                  {pullRequest.repositoryOwner}/{pullRequest.repositoryName}
                </span>
              </p>
              <p>
                PR: <span className="text-zinc-800 dark:text-zinc-200">#{pullRequest.number}</span>
              </p>
              <p>
                Status:{" "}
                <span className="text-zinc-800 dark:text-zinc-200">{pullRequest.state}</span>
              </p>
              <p>Atualizado em: {formatUpdatedAt(pullRequest.updatedAt)}</p>
            </div>
          </div>
        </header>

        <div className="px-4 py-4 sm:px-5">
          <h2 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Descricao
          </h2>
          {pullRequest.body?.trim() ? (
            <PullRequestMarkdownPreview content={pullRequest.body} />
          ) : (
            <p className="text-sm leading-6 text-zinc-700 dark:text-zinc-300">Sem descricao.</p>
          )}
        </div>
      </section>

      <PullRequestAnalysisSectionClient
        key={`${pullRequest.repositoryOwner}/${pullRequest.repositoryName}/${pullRequest.number}`}
        owner={pullRequest.repositoryOwner}
        repo={pullRequest.repositoryName}
        pullNumber={pullRequest.number}
      />
    </main>
  );
}
