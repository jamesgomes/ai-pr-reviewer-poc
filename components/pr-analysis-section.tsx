"use client";

import { useState } from "react";
import { PublishStatusBanner } from "@/components/publish-status-banner";
import { PullRequestSuggestionItem } from "@/components/pr-suggestion-item";
import { reconcileReviewSuggestionsAfterReanalysis } from "@/lib/pr-analysis-reconciliation";
import {
  readPersistedPullRequestAnalysis,
  writePersistedPullRequestAnalysis,
} from "@/lib/storage/pr-analysis-storage";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import type {
  ApprovePullRequestErrorResponse,
  ApprovePullRequestResponse,
  PullRequestAnalysisCodeContextFile,
  PullRequestAnalysisErrorResponse,
  PullRequestAnalysisResponse,
  PublishPullRequestSuggestionsErrorResponse,
  PublishPullRequestSuggestionsResponse,
  PullRequestReviewApproval,
  PublishSuggestionInput,
  PublishSuggestionResult,
  PullRequestReviewSuggestion,
  PullRequestSuggestionFilter,
  PullRequestSuggestionStatus,
} from "@/types/pr-analysis";

type PullRequestAnalysisSectionProps = {
  githubUserKey: string;
  authenticatedGithubLogin: string;
  owner: string;
  repo: string;
  pullNumber: number;
  pullRequestState: "open" | "closed";
  pullRequestAuthorLogin: string;
};

type PublishSuccessState = {
  inlinePublishedCount: number;
  consolidatedPublishedCount: number;
  failedCount: number;
  publishedCommentUrl: string | null;
  hasConsolidatedCommentUrl: boolean;
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
    published: false,
    publishedAt: null,
    publishMode: null,
    publishedUrl: null,
    publishError: null,
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
    return "Data indisponível";
  }

  return parsedDate.toLocaleString("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

function formatApprovedAt(value: string): string {
  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Data indisponível";
  }

  return parsedDate.toLocaleString("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

function createDefaultReviewApproval(): PullRequestReviewApproval {
  return {
    approved: false,
    approvedAt: null,
    approvalUrl: null,
    approvalError: null,
  };
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

function toPublishSuggestionInput(
  suggestion: PullRequestReviewSuggestion
): PublishSuggestionInput {
  return {
    id: suggestion.id,
    title: suggestion.title,
    filePath: suggestion.filePath,
    line: suggestion.line,
    comment: suggestion.editedComment ?? suggestion.suggestedComment,
  };
}

function toSuggestionResultMap(results: PublishSuggestionResult[]): Map<string, PublishSuggestionResult> {
  return new Map(results.map((result) => [result.id, result]));
}

export function PullRequestAnalysisSection({
  githubUserKey,
  authenticatedGithubLogin,
  owner,
  repo,
  pullNumber,
  pullRequestState,
  pullRequestAuthorLogin,
}: PullRequestAnalysisSectionProps) {
  const [persistedAnalysisOnMount] = useState(() =>
    readPersistedPullRequestAnalysis({
      githubUserKey,
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
  const [isPublishing, setIsPublishing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(
    persistedAnalysisOnMount?.savedAt ?? null
  );
  const [publishSuccessState, setPublishSuccessState] = useState<PublishSuccessState | null>(null);
  const [publishErrorMessage, setPublishErrorMessage] = useState<string | null>(null);
  const [reviewApproval, setReviewApproval] = useState<PullRequestReviewApproval>(
    persistedAnalysisOnMount?.reviewApproval ?? createDefaultReviewApproval()
  );
  const [isApprovingPullRequest, setIsApprovingPullRequest] = useState(false);
  const [approveErrorMessage, setApproveErrorMessage] = useState<string | null>(null);

  function persistLocalAnalysis(
    nextAnalysisSummary: string | null,
    nextSuggestions: PullRequestReviewSuggestion[],
    nextCodeContextPatchesByFilePath: Record<string, string | null>,
    nextReviewApproval: PullRequestReviewApproval
  ) {
    const savedAt = new Date().toISOString();
    const didPersist = writePersistedPullRequestAnalysis(
      {
        githubUserKey,
        owner,
        repo,
        pullNumber,
      },
      {
        analysisSummary: nextAnalysisSummary,
        reviewSuggestions: nextSuggestions,
        codeContextFiles: toCodeContextFiles(nextCodeContextPatchesByFilePath),
        reviewApproval: nextReviewApproval,
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
    setPublishSuccessState(null);
    setPublishErrorMessage(null);
    setApproveErrorMessage(null);

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
          "error" in payload ? payload.error : "Não foi possível analisar o PR.";

        throw new Error(message);
      }

      if (!("analysis" in payload) || !("codeContextFiles" in payload)) {
        throw new Error("Resposta inválida da API de análise do PR.");
      }

      const nextAnalysisSummary = payload.analysis.summary;
      const incomingReviewSuggestions = toReviewSuggestions(payload.analysis.suggestions);
      const nextReviewSuggestions = reconcileReviewSuggestionsAfterReanalysis({
        currentSuggestions: reviewSuggestions,
        incomingSuggestions: incomingReviewSuggestions,
      });
      const nextCodeContextPatchesByFilePath = toPatchMap(payload.codeContextFiles);

      setAnalysisSummary(nextAnalysisSummary);
      setReviewSuggestions(nextReviewSuggestions);
      setCodeContextPatchesByFilePath(nextCodeContextPatchesByFilePath);
      setActiveFilter("all");
      persistLocalAnalysis(
        nextAnalysisSummary,
        nextReviewSuggestions,
        nextCodeContextPatchesByFilePath,
        reviewApproval
      );
    } catch (error: unknown) {
      setErrorMessage(`Não foi possível analisar o PR. ${toErrorMessage(error)}`);
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

      persistLocalAnalysis(
        analysisSummary,
        nextSuggestions,
        codeContextPatchesByFilePath,
        reviewApproval
      );

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

      persistLocalAnalysis(
        analysisSummary,
        nextSuggestions,
        codeContextPatchesByFilePath,
        reviewApproval
      );

      return nextSuggestions;
    });
  }

  const approvedSuggestionsToPublish = reviewSuggestions.filter(
    (suggestion) => suggestion.status === "approved" && !suggestion.published
  );

  async function handlePublishApprovedSuggestions() {
    if (!analysisSummary || approvedSuggestionsToPublish.length === 0) {
      return;
    }

    setIsPublishing(true);
    setPublishErrorMessage(null);
    setPublishSuccessState(null);

    try {
      const publishPayload = {
        summary: analysisSummary,
        suggestions: approvedSuggestionsToPublish.map(toPublishSuggestionInput),
      };

      const response = await fetch(
        `/api/pull-requests/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/${pullNumber}/publish`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(publishPayload),
        }
      );
      const payload = (await response.json()) as
        | PublishPullRequestSuggestionsResponse
        | PublishPullRequestSuggestionsErrorResponse;

      if (!response.ok) {
        const message =
          "error" in payload ? payload.error : "Não foi possível publicar as sugestões no GitHub.";

        throw new Error(message);
      }

      if (!("ok" in payload) || !payload.ok) {
        throw new Error("Resposta inválida da API de publicação.");
      }

      const publishedSuggestionResultsById = toSuggestionResultMap(payload.results);
      const attemptedSuggestionIds = new Set(
        approvedSuggestionsToPublish.map((suggestion) => suggestion.id)
      );

      setReviewSuggestions((currentSuggestions) => {
        const nextSuggestions = currentSuggestions.map((suggestion) => {
          if (!attemptedSuggestionIds.has(suggestion.id)) {
            return suggestion;
          }

          const suggestionResult = publishedSuggestionResultsById.get(suggestion.id);

          if (!suggestionResult) {
            return {
              ...suggestion,
              published: false,
              publishedAt: null,
              publishMode: null,
              publishedUrl: null,
              publishError: "Não foi possível confirmar a publicação desta sugestão.",
            };
          }

          return {
            ...suggestion,
            published: suggestionResult.published,
            publishedAt: suggestionResult.publishedAt,
            publishMode: suggestionResult.publishMode,
            publishedUrl: suggestionResult.publishedUrl,
            publishError: suggestionResult.publishError,
          };
        });

        persistLocalAnalysis(
          analysisSummary,
          nextSuggestions,
          codeContextPatchesByFilePath,
          reviewApproval
        );

        return nextSuggestions;
      });

      const firstPublishedCommentUrl =
        payload.results.find((result) => result.publishedUrl !== null)?.publishedUrl ?? null;

      setPublishSuccessState({
        inlinePublishedCount: payload.summary.inlinePublished,
        consolidatedPublishedCount: payload.summary.consolidatedPublished,
        failedCount: payload.summary.failed,
        publishedCommentUrl: payload.consolidatedCommentUrl ?? firstPublishedCommentUrl,
        hasConsolidatedCommentUrl: payload.consolidatedCommentUrl !== null,
      });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Erro desconhecido ao publicar no GitHub.";
      setPublishErrorMessage(message);
    } finally {
      setIsPublishing(false);
    }
  }

  async function handleApprovePullRequest() {
    if (pullRequestState !== "open" || reviewApproval.approved) {
      return;
    }

    setIsApprovingPullRequest(true);
    setApproveErrorMessage(null);

    try {
      const response = await fetch(
        `/api/pull-requests/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/${pullNumber}/approve`,
        {
          method: "POST",
        }
      );
      const payload = (await response.json()) as
        | ApprovePullRequestResponse
        | ApprovePullRequestErrorResponse;

      if (!response.ok) {
        const message =
          "error" in payload ? payload.error : "Não foi possível aprovar o Pull Request.";

        throw new Error(message);
      }

      if (!("ok" in payload) || !payload.ok) {
        throw new Error("Resposta inválida da API de aprovação.");
      }

      const nextReviewApproval: PullRequestReviewApproval = {
        approved: true,
        approvedAt: payload.approvedAt,
        approvalUrl: payload.approvalUrl,
        approvalError: null,
      };

      setReviewApproval(nextReviewApproval);
      persistLocalAnalysis(
        analysisSummary,
        reviewSuggestions,
        codeContextPatchesByFilePath,
        nextReviewApproval
      );
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Erro desconhecido ao aprovar o PR no GitHub.";
      const failedReviewApproval: PullRequestReviewApproval = {
        ...reviewApproval,
        approvalError: message,
      };

      setReviewApproval(failedReviewApproval);
      setApproveErrorMessage(message);
      persistLocalAnalysis(
        analysisSummary,
        reviewSuggestions,
        codeContextPatchesByFilePath,
        failedReviewApproval
      );
    } finally {
      setIsApprovingPullRequest(false);
    }
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
  const isOwnPullRequest =
    pullRequestAuthorLogin.trim().toLowerCase() ===
    authenticatedGithubLogin.trim().toLowerCase();
  const canApprovePullRequest =
    pullRequestState === "open" && !reviewApproval.approved && !isOwnPullRequest;

  return (
    <section className="mt-4 rounded-[11px] border border-[var(--app-divider)] bg-[var(--app-canvas)]">
      <header className="flex flex-wrap items-start justify-between gap-3 border-b border-[var(--app-divider)] px-4 py-4 sm:px-5">
        <div>
          <h2 className="text-lg font-semibold text-[var(--app-ink)]">
            Análise com IA
          </h2>
          <p className="mt-1 text-sm text-[var(--app-body-muted)]">
            Analise as alterações deste PR com IA.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="secondary"
            onClick={handleApprovePullRequest}
            disabled={!canApprovePullRequest || isApprovingPullRequest}
          >
            {isApprovingPullRequest
              ? "Aprovando..."
              : reviewApproval.approved
                ? "PR aprovado"
                : "Aprovar PR no GitHub"}
          </Button>
          <Button
            variant="primary"
            onClick={handleAnalyzePullRequest}
            disabled={isAnalyzing}
          >
            {isAnalyzing ? "Analisando..." : "Analisar com IA"}
          </Button>
        </div>
      </header>

      <div className="px-4 py-4 sm:px-5">
        {isAnalyzing && (
          <div className="mb-4 rounded-[11px] border border-[var(--app-divider)] bg-[var(--app-canvas-parchment)] p-3">
            <LoadingSpinner label="Analisando alterações do PR..." />
          </div>
        )}

        {errorMessage && (
          <p className="rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-800 dark:border-red-900/80 dark:bg-red-950/30 dark:text-red-300">
            {errorMessage}
          </p>
        )}

        {pullRequestState !== "open" && (
          <p className="mb-4 rounded-[11px] border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-300">
            Este Pull Request não está aberto. A aprovação foi desabilitada.
          </p>
        )}

        {pullRequestState === "open" && isOwnPullRequest && (
          <p className="mb-4 rounded-[11px] border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-300">
            Este Pull Request foi aberto por você. A aprovação está desabilitada neste fluxo.
          </p>
        )}

        {reviewApproval.approved && reviewApproval.approvedAt && (
          <div className="mb-4 rounded-[11px] border border-emerald-300 bg-emerald-50 p-3 text-sm text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-300">
            <p className="font-semibold">Pull Request aprovado no GitHub.</p>
            <p className="mt-1">Aprovação registrada em {formatApprovedAt(reviewApproval.approvedAt)}.</p>
            {reviewApproval.approvalUrl && (
              <a
                href={reviewApproval.approvalUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-flex text-sm underline underline-offset-2 hover:no-underline"
              >
                Ver aprovação no GitHub
              </a>
            )}
          </div>
        )}

        {(approveErrorMessage || reviewApproval.approvalError) && !reviewApproval.approved && (
          <p className="mb-4 rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-800 dark:border-red-900/80 dark:bg-red-950/30 dark:text-red-300">
            {approveErrorMessage ?? reviewApproval.approvalError}
          </p>
        )}

        {!analysisSummary && !isAnalyzing && !errorMessage && (
          <p className="rounded-[11px] border border-[var(--app-divider)] bg-[var(--app-canvas-parchment)] p-3 text-sm text-[var(--app-body-muted-strong)]">
            Nenhuma análise foi executada.
          </p>
        )}

        {analysisSummary && (
          <div className="space-y-4">
            <div className="rounded-[11px] border border-[var(--app-divider)] bg-[var(--app-canvas-parchment)] p-4">
              <h3 className="text-sm font-semibold text-[var(--app-ink)]">
                Resumo
              </h3>
              <p className="mt-2 text-sm leading-6 text-[var(--app-body-muted-strong)]">
                {analysisSummary}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-[var(--app-ink)]">
                Sugestões ({reviewSuggestions.length})
              </h3>
              <p className="mt-1 text-xs text-[var(--app-body-muted)]">
                Pendentes: {suggestionCounters.pending} · Aprovadas: {suggestionCounters.approved} ·
                Rejeitadas: {suggestionCounters.rejected}
              </p>
              {lastSavedAt && (
                <p className="mt-1 text-xs text-[var(--app-body-muted)]">
                  Última análise salva localmente: {formatSavedAt(lastSavedAt)}.
                </p>
              )}
              {approvedSuggestionsToPublish.length > 0 && (
                <div className="mt-3">
                  <Button
                    variant="primary"
                    onClick={handlePublishApprovedSuggestions}
                    disabled={isPublishing}
                  >
                    {isPublishing
                      ? "Publicando..."
                      : `Publicar no GitHub (${approvedSuggestionsToPublish.length})`}
                  </Button>
                </div>
              )}
              {publishSuccessState && (
                <PublishStatusBanner
                  inlinePublishedCount={publishSuccessState.inlinePublishedCount}
                  consolidatedPublishedCount={publishSuccessState.consolidatedPublishedCount}
                  failedCount={publishSuccessState.failedCount}
                  publishedCommentUrl={publishSuccessState.publishedCommentUrl}
                  hasConsolidatedCommentUrl={publishSuccessState.hasConsolidatedCommentUrl}
                />
              )}
              {publishErrorMessage && (
                <p className="mt-3 rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-800 dark:border-red-900/80 dark:bg-red-950/30 dark:text-red-300">
                  {publishErrorMessage}
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
                          ? "border-[var(--app-primary)] bg-[#eaf2ff] text-[var(--app-primary)] hover:bg-[#dbeaff] dark:bg-blue-950/40 dark:text-blue-300"
                          : undefined
                      }
                    >
                      {filterOption.label} ({filterCountByValue[filterOption.value]})
                    </Button>
                  );
                })}
              </div>

              {reviewSuggestions.length === 0 ? (
                <p className="mt-2 rounded-[11px] border border-[var(--app-divider)] bg-[var(--app-canvas-parchment)] p-3 text-sm text-[var(--app-body-muted-strong)]">
                  Nenhuma sugestão relevante foi identificada para este PR.
                </p>
              ) : filteredSuggestions.length === 0 ? (
                <p className="mt-3 rounded-[11px] border border-[var(--app-divider)] bg-[var(--app-canvas-parchment)] p-3 text-sm text-[var(--app-body-muted-strong)]">
                  Nenhuma sugestão neste filtro.
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
