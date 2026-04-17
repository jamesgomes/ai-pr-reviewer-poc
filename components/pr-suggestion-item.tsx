"use client";

import { useState } from "react";
import { PullRequestSuggestionDiffSnippet } from "@/components/pr-suggestion-diff-snippet";
import { PullRequestSuggestionActions } from "@/components/pr-suggestion-actions";
import type {
  PullRequestAnalysisSeverity,
  PullRequestReviewSuggestion,
  PullRequestSuggestionStatus,
} from "@/types/pr-analysis";

type PullRequestSuggestionItemProps = {
  suggestion: PullRequestReviewSuggestion;
  codePatch: string | null;
  onChangeStatus: (id: string, status: PullRequestSuggestionStatus) => void;
  onSaveEditedComment: (id: string, editedComment: string) => void;
};

const severityBadgeClassName: Record<PullRequestAnalysisSeverity, string> = {
  low: "border-zinc-300 bg-zinc-100 text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300",
  medium:
    "border-amber-300 bg-amber-50 text-amber-800 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-300",
  high: "border-red-300 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300",
};

const suggestionCardClassName: Record<PullRequestSuggestionStatus, string> = {
  pending: "border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950",
  approved:
    "border-emerald-300 bg-emerald-50/40 shadow-[inset_0_0_0_1px_rgba(16,185,129,0.08)] dark:border-emerald-900 dark:bg-emerald-950/20",
  rejected: "border-zinc-300 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900/60",
};

const suggestionStatusBadgeClassName: Record<PullRequestSuggestionStatus, string> = {
  pending: "border-zinc-300 bg-zinc-100 text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300",
  approved:
    "border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-300",
  rejected: "border-zinc-300 bg-zinc-100 text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300",
};

const suggestionStatusLabel: Record<PullRequestSuggestionStatus, string> = {
  pending: "Pendente",
  approved: "Aprovada",
  rejected: "Rejeitada",
};

function getDisplayedComment(suggestion: PullRequestReviewSuggestion): string {
  return suggestion.editedComment ?? suggestion.suggestedComment;
}

export function PullRequestSuggestionItem({
  suggestion,
  codePatch,
  onChangeStatus,
  onSaveEditedComment,
}: PullRequestSuggestionItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draftComment, setDraftComment] = useState("");

  function handleStartEdit() {
    setDraftComment(getDisplayedComment(suggestion));
    setIsEditing(true);
  }

  function handleCancelEdit() {
    setDraftComment("");
    setIsEditing(false);
  }

  function handleSaveEdit() {
    const nextComment = draftComment.trim();

    if (nextComment.length === 0) {
      return;
    }

    onSaveEditedComment(suggestion.id, nextComment);
    setDraftComment("");
    setIsEditing(false);
  }

  return (
    <li className={`rounded-md border p-4 ${suggestionCardClassName[suggestion.status]}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-semibold ${suggestionStatusBadgeClassName[suggestion.status]}`}
            >
              {suggestionStatusLabel[suggestion.status]}
            </span>
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

          <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
            {suggestion.filePath !== null ? suggestion.filePath : "Arquivo nao informado"}
            {suggestion.line !== null ? `:${suggestion.line}` : ""}
          </p>
        </div>

        <PullRequestSuggestionActions
          status={suggestion.status}
          isEditing={isEditing}
          isSaveDisabled={draftComment.trim().length === 0}
          onApprove={() => {
            onChangeStatus(suggestion.id, "approved");
            setIsEditing(false);
            setDraftComment("");
          }}
          onReject={() => {
            onChangeStatus(suggestion.id, "rejected");
            setIsEditing(false);
            setDraftComment("");
          }}
          onResetToPending={() => {
            onChangeStatus(suggestion.id, "pending");
            setIsEditing(false);
            setDraftComment("");
          }}
          onStartEdit={handleStartEdit}
          onSaveEdit={handleSaveEdit}
          onCancelEdit={handleCancelEdit}
        />
      </div>

      <p className="mt-3 text-sm leading-6 text-zinc-700 dark:text-zinc-300">
        {suggestion.description}
      </p>

      {suggestion.filePath !== null && suggestion.line !== null && (
        <PullRequestSuggestionDiffSnippet
          filePath={suggestion.filePath}
          line={suggestion.line}
          patch={codePatch}
        />
      )}

      <div className="mt-3 rounded-md border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            Comentario para publicar no review
          </p>
          {suggestion.editedComment !== null && !isEditing && (
            <span className="inline-flex rounded-full border border-blue-300 bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-blue-700 dark:border-blue-900 dark:bg-blue-950/30 dark:text-blue-300">
              Editado manualmente
            </span>
          )}
        </div>

        {isEditing ? (
          <div className="mt-2">
            <textarea
              value={draftComment}
              onChange={(event) => {
                setDraftComment(event.target.value);
              }}
              rows={5}
              className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm leading-6 text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus-visible:border-blue-400 dark:focus-visible:ring-blue-400/20"
            />
          </div>
        ) : (
          <pre className="mt-2 whitespace-pre-wrap rounded-md border border-zinc-200 bg-white p-3 text-sm leading-6 text-zinc-800 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-200">
            {getDisplayedComment(suggestion)}
          </pre>
        )}
      </div>
    </li>
  );
}
