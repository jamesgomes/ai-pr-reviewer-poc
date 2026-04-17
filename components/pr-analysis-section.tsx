"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import type {
  PullRequestAnalysisErrorResponse,
  PullRequestAnalysisResponse,
  PullRequestAnalysisResult,
  PullRequestAnalysisSeverity,
  PullRequestAnalysisSuggestion,
} from "@/types/pr-analysis";

type PullRequestAnalysisSectionProps = {
  owner: string;
  repo: string;
  pullNumber: number;
};

const severityBadgeClassName: Record<PullRequestAnalysisSeverity, string> = {
  low: "border-zinc-300 bg-zinc-100 text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300",
  medium:
    "border-amber-300 bg-amber-50 text-amber-800 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-300",
  high: "border-red-300 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300",
};

function toErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return "Erro desconhecido ao analisar o PR.";
}

function SuggestionCard({
  suggestion,
}: {
  suggestion: PullRequestAnalysisSuggestion;
}) {
  return (
    <li className="rounded-md border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex flex-wrap items-center gap-2">
        <span
          className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-medium ${severityBadgeClassName[suggestion.severity]}`}
        >
          {suggestion.severity}
        </span>
        <span className="inline-flex rounded-full border border-zinc-300 bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
          {suggestion.category}
        </span>
      </div>

      <h4 className="mt-2 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
        {suggestion.title}
      </h4>

      {(suggestion.filePath !== null || suggestion.line !== null) && (
        <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
          {suggestion.filePath !== null ? suggestion.filePath : "Arquivo nao informado"}
          {suggestion.line !== null ? `:${suggestion.line}` : ""}
        </p>
      )}

      <p className="mt-3 text-sm leading-6 text-zinc-700 dark:text-zinc-300">
        {suggestion.description}
      </p>

      <div className="mt-3 rounded-md border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900">
        <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
          Comentario sugerido
        </p>
        <p className="mt-2 text-sm leading-6 text-zinc-800 dark:text-zinc-200">
          {suggestion.suggestedComment}
        </p>
      </div>
    </li>
  );
}

export function PullRequestAnalysisSection({
  owner,
  repo,
  pullNumber,
}: PullRequestAnalysisSectionProps) {
  const [analysis, setAnalysis] = useState<PullRequestAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleAnalyzePullRequest() {
    setIsAnalyzing(true);
    setErrorMessage(null);

    try {
      const response = await fetch(
        `/api/pull-requests/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/${pullNumber}/analyze`,
        {
          method: "POST",
        }
      );
      const payload = (await response.json()) as
        | PullRequestAnalysisResponse
        | PullRequestAnalysisErrorResponse;

      if (!response.ok) {
        const message =
          "error" in payload ? payload.error : "Falha ao executar analise do PR.";

        throw new Error(message);
      }

      if (!("analysis" in payload)) {
        throw new Error("Resposta invalida da API de analise.");
      }

      setAnalysis(payload.analysis);
    } catch (error: unknown) {
      setErrorMessage(`Nao foi possivel executar a analise. ${toErrorMessage(error)}`);
    } finally {
      setIsAnalyzing(false);
    }
  }

  return (
    <section className="mt-4 rounded-md border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <header className="flex flex-wrap items-start justify-between gap-3 border-b border-zinc-200 px-4 py-4 dark:border-zinc-800 sm:px-5">
        <div>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Analise com IA
          </h2>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Execute a revisao automatizada do diff deste PR.
          </p>
        </div>
        <Button
          variant="primary"
          onClick={handleAnalyzePullRequest}
          disabled={isAnalyzing}
        >
          {isAnalyzing ? "Analisando..." : "Analisar com IA"}
        </Button>
      </header>

      <div className="px-4 py-4 sm:px-5">
        {isAnalyzing && (
          <div className="mb-4 rounded-md border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900">
            <LoadingSpinner label="Analisando alteracoes do PR..." />
          </div>
        )}

        {errorMessage && (
          <p className="rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-800 dark:border-red-900/80 dark:bg-red-950/30 dark:text-red-300">
            {errorMessage}
          </p>
        )}

        {!analysis && !isAnalyzing && !errorMessage && (
          <p className="rounded-md border border-zinc-200 bg-zinc-50 p-3 text-sm text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
            Nenhuma analise executada ainda.
          </p>
        )}

        {analysis && (
          <div className="space-y-4">
            <div className="rounded-md border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Resumo
              </h3>
              <p className="mt-2 text-sm leading-6 text-zinc-700 dark:text-zinc-300">
                {analysis.summary}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Sugestoes ({analysis.suggestions.length})
              </h3>

              {analysis.suggestions.length === 0 ? (
                <p className="mt-2 rounded-md border border-zinc-200 bg-zinc-50 p-3 text-sm text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
                  Nenhuma sugestao relevante foi identificada para este PR.
                </p>
              ) : (
                <ul className="mt-3 space-y-3">
                  {analysis.suggestions.map((suggestion) => (
                    <SuggestionCard key={suggestion.id} suggestion={suggestion} />
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
