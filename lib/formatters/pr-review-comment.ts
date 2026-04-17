import type { PublishSuggestionInput } from "@/types/pr-analysis";

type BuildPullRequestReviewCommentInput = {
  summary: string;
  suggestions: PublishSuggestionInput[];
};

function formatSuggestionLocation(suggestion: PublishSuggestionInput): string {
  if (suggestion.filePath && suggestion.line !== null) {
    return `${suggestion.filePath}:${suggestion.line}`;
  }

  if (suggestion.filePath) {
    return suggestion.filePath;
  }

  return "Nao informado";
}

export function buildPullRequestReviewCommentMarkdown({
  summary,
  suggestions,
}: BuildPullRequestReviewCommentInput): string {
  const sections = suggestions.map((suggestion, index) =>
    [
      `### ${index + 1}. ${suggestion.title}`,
      `Arquivo: ${formatSuggestionLocation(suggestion)}`,
      "",
      suggestion.comment,
      "",
      "---",
    ].join("\n")
  );

  return [
    "## 🤖 AI PR Review",
    "",
    "Resumo:",
    summary,
    "",
    "Sugestoes aprovadas para revisao:",
    "",
    ...sections,
    "",
    "Gerado por AI PR Reviewer",
  ].join("\n");
}
