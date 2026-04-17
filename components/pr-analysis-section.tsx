"use client";

import { useState } from "react";
import { PullRequestSuggestionItem } from "@/components/pr-suggestion-item";
import {
  readPersistedPullRequestAnalysis,
  writePersistedPullRequestAnalysis,
} from "@/lib/storage/pr-analysis-storage";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import type {
  PullRequestAnalysisCodeContextFile,
  PullRequestAnalysisErrorResponse,
  PullRequestAnalysisResponse,
  PullRequestReviewSuggestion,
  PullRequestSuggestionFilter,
  PullRequestSuggestionStatus,
} from "@/types/pr-analysis";

type PullRequestAnalysisSectionProps = {
  owner: string;
  repo: string;
  pullNumber: number;
};

function toErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return "Erro desconhecido ao analisar o PR.";
}

function toReviewSuggestions(
  payload: PullRequestAnalysisResponse["analysis"]["suggestions"]
): PullRequestReviewSuggestion[] {
  return payload.map((suggestion) => ({
    ...suggestion,
    status: "pending",
    editedComment: null,
  }));
}

function toPatchMap(
  codeContextFiles: PullRequestAnalysisResponse["codeContextFiles"]
): Record<string, string | null> {
  return codeContextFiles.reduce<Record<string, string | null>>((accumulator, file) => {
    accumulator[file.filePath] = file.patch;
    return accumulator;
  }, {});
}

function toCodeContextFiles(
  codeContextPatchesByFilePath: Record<string, string | null>
): PullRequestAnalysisCodeContextFile[] {
  return Object.entries(codeContextPatchesByFilePath).map(([filePath, patch]) => ({
    filePath,
    patch,
  }));
}

function formatSavedAt(value: string): string {
  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return "data invalida";
  }

  return parsedDate.toLocaleString("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

type SuggestionCounters = {
  pending: number;
  approved: number;
  rejected: number;
};

const suggestionFilterOptions: Array<{
  value: PullRequestSuggestionFilter;
  label: string;
}> = [
  { value: "all", label: "Todas" },
  { value: "pending", label: "Pendentes" },
  { value: "approved", label: "Aprovadas" },
  { value: "rejected", label: "Rejeitadas" },
];

function calculateSuggestionCounters(
  suggestions: PullRequestReviewSuggestion[]
): SuggestionCounters {
  return suggestions.reduce<SuggestionCounters>(
    (counters, suggestion) => {
      counters[suggestion.status] += 1;
      return counters;
    },
    {
      pending: 0,
      approved: 0,
      rejected: 0,
    }
  );
}

export function PullRequestAnalysisSection({
  owner,
  repo,
  pullNumber,
}: PullRequestAnalysisSectionProps) {
  const [persistedAnalysisOnMount] = useState(() =>
    readPersistedPullRequestAnalysis({
      owner,
      repo,
      pullNumber,
    })
  );
  const [analysisSummary, setAnalysisSummary] = useState<string | null>(
    persistedAnalysisOnMount?.analysisSummary ?? null
  );
  const [reviewSuggestions, setReviewSuggestions] = useState<PullRequestReviewSuggestion[]>(
    persistedAnalysisOnMount?.reviewSuggestions ?? []
  );
  const [codeContextPatchesByFilePath, setCodeContextPatchesByFilePath] = useState<
    Record<string, string | null>
  >(persistedAnalysisOnMount ? toPatchMap(persistedAnalysisOnMount.codeContextFiles) : {});
  const [activeFilter, setActiveFilter] = useState<PullRequestSuggestionFilter>("all");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(
    persistedAnalysisOnMount?.savedAt ?? null
  );

  function persistLocalAnalysis(
    nextAnalysisSummary: string,
    nextSuggestions: PullRequestReviewSuggestion[],
    nextCodeContextPatchesByFilePath: Record<string, string | null>
  ) {
    const savedAt = new Date().toISOString();
    const didPersist = writePersistedPullRequestAnalysis(
      {
        owner,
        repo,
        pullNumber,
      },
      {
        analysisSummary: nextAnalysisSummary,
        reviewSuggestions: nextSuggestions,
        codeContextFiles: toCodeContextFiles(nextCodeContextPatchesByFilePath),
        savedAt,
      }
    );

    if (didPersist) {
      setLastSavedAt(savedAt);
    }
  }

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

      if (!("analysis" in payload) || !("codeContextFiles" in payload)) {
        throw new Error("Resposta invalida da API de analise.");
      }

      const nextAnalysisSummary = payload.analysis.summary;
      const nextReviewSuggestions = toReviewSuggestions(payload.analysis.suggestions);
      const nextCodeContextPatchesByFilePath = toPatchMap(payload.codeContextFiles);

      setAnalysisSummary(nextAnalysisSummary);
      setReviewSuggestions(nextReviewSuggestions);
      setCodeContextPatchesByFilePath(nextCodeContextPatchesByFilePath);
      setActiveFilter("all");
      persistLocalAnalysis(
        nextAnalysisSummary,
        nextReviewSuggestions,
        nextCodeContextPatchesByFilePath
      );
    } catch (error: unknown) {
      setErrorMessage(`Nao foi possivel executar a analise. ${toErrorMessage(error)}`);
    } finally {
      setIsAnalyzing(false);
    }
  }

  function updateSuggestionStatus(id: string, status: PullRequestSuggestionStatus) {
    setReviewSuggestions((currentSuggestions) => {
        const nextSuggestions = currentSuggestions.map((suggestion) =>
          suggestion.id === id
            ? {
                ...suggestion,
                status,
              }
            : suggestion
        );

        if (analysisSummary) {
          persistLocalAnalysis(analysisSummary, nextSuggestions, codeContextPatchesByFilePath);
        }

        return nextSuggestions;
      });
  }

  function saveEditedComment(id: string, editedComment: string) {
    setReviewSuggestions((currentSuggestions) => {
        const nextSuggestions = currentSuggestions.map((suggestion) =>
          suggestion.id === id
            ? {
                ...suggestion,
                editedComment,
              }
            : suggestion
        );

        if (analysisSummary) {
          persistLocalAnalysis(analysisSummary, nextSuggestions, codeContextPatchesByFilePath);
        }

        return nextSuggestions;
      });
  }

  const suggestionCounters = calculateSuggestionCounters(reviewSuggestions);
  const filteredSuggestions =
    activeFilter === "all"
      ? reviewSuggestions
      : reviewSuggestions.filter((suggestion) => suggestion.status === activeFilter);
  const filterCountByValue: Record<PullRequestSuggestionFilter, number> = {
    all: reviewSuggestions.length,
    pending: suggestionCounters.pending,
    approved: suggestionCounters.approved,
    rejected: suggestionCounters.rejected,
  };

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

        {!analysisSummary && !isAnalyzing && !errorMessage && (
          <p className="rounded-md border border-zinc-200 bg-zinc-50 p-3 text-sm text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
            Nenhuma analise executada ainda.
          </p>
        )}

        {analysisSummary && (
          <div className="space-y-4">
            <div className="rounded-md border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Resumo
              </h3>
              <p className="mt-2 text-sm leading-6 text-zinc-700 dark:text-zinc-300">
                {analysisSummary}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Sugestoes ({reviewSuggestions.length})
              </h3>
              <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
                Pendentes: {suggestionCounters.pending} · Aprovadas: {suggestionCounters.approved} ·
                Rejeitadas: {suggestionCounters.rejected}
              </p>
              {lastSavedAt && (
                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                  Ultima analise salva localmente em {formatSavedAt(lastSavedAt)}.
                </p>
              )}
              <div className="mt-3 flex flex-wrap gap-2">
                {suggestionFilterOptions.map((filterOption) => {
                  const isActive = activeFilter === filterOption.value;

                  return (
                    <Button
                      key={filterOption.value}
                      variant="secondary"
                      onClick={() => {
                        setActiveFilter(filterOption.value);
                      }}
                      className={
                        isActive
                          ? "border-blue-300 bg-blue-50 text-blue-700 hover:bg-blue-100 dark:border-blue-900 dark:bg-blue-950/30 dark:text-blue-300 dark:hover:bg-blue-950/50"
                          : undefined
                      }
                    >
                      {filterOption.label} ({filterCountByValue[filterOption.value]})
                    </Button>
                  );
                })}
              </div>

              {reviewSuggestions.length === 0 ? (
                <p className="mt-2 rounded-md border border-zinc-200 bg-zinc-50 p-3 text-sm text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
                  Nenhuma sugestao relevante foi identificada para este PR.
                </p>
              ) : filteredSuggestions.length === 0 ? (
                <p className="mt-3 rounded-md border border-zinc-200 bg-zinc-50 p-3 text-sm text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
                  Nenhuma sugestao encontrada para o filtro selecionado.
                </p>
              ) : (
                <ul className="mt-3 space-y-3">
                  {filteredSuggestions.map((suggestion) => (
                    <PullRequestSuggestionItem
                      key={suggestion.id}
                      suggestion={suggestion}
                      codePatch={
                        suggestion.filePath !== null
                          ? (codeContextPatchesByFilePath[suggestion.filePath] ?? null)
                          : null
                      }
                      onChangeStatus={updateSuggestionStatus}
                      onSaveEditedComment={saveEditedComment}
                    />
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
