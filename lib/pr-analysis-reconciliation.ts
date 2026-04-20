import type {
  PullRequestAnalysisSuggestion,
  PullRequestReviewSuggestion,
} from "@/types/pr-analysis";

type SuggestionEquivalenceInput = {
  filePath: string | null;
  line: number | null;
  category: PullRequestAnalysisSuggestion["category"];
  severity: PullRequestAnalysisSuggestion["severity"];
  title: string;
  description: string;
};

type ReconcileReviewSuggestionsInput = {
  currentSuggestions: PullRequestReviewSuggestion[];
  incomingSuggestions: PullRequestReviewSuggestion[];
};

type SuggestionComparableSnapshot = {
  exactKey: string;
  filePath: string;
  category: PullRequestAnalysisSuggestion["category"];
  line: number | null;
  normalizedTitle: string;
  normalizedDescription: string;
  normalizedCombinedText: string;
};

const LINE_TOLERANCE = 3;

function normalizeText(value: string): string {
  const trimmed = value.trim().toLowerCase();

  if (!trimmed) {
    return "";
  }

  const withoutAccents = trimmed.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const withoutPunctuation = withoutAccents.replace(/[^a-z0-9\s]/g, " ");

  return withoutPunctuation.replace(/\s+/g, " ").trim();
}

function normalizeFilePath(value: string | null): string {
  if (!value) {
    return "no-file";
  }

  return value.trim().replace(/\\/g, "/").replace(/^\.\/+/, "").toLowerCase();
}

function toComparableTokens(value: string): Set<string> {
  return new Set(value.split(" ").filter((token) => token.length >= 3));
}

function hasSufficientTextSimilarity(left: string, right: string): boolean {
  if (!left || !right) {
    return false;
  }

  if (left === right) {
    return true;
  }

  const shortestLength = Math.min(left.length, right.length);

  if (shortestLength >= 16 && (left.includes(right) || right.includes(left))) {
    return true;
  }

  const leftTokens = toComparableTokens(left);
  const rightTokens = toComparableTokens(right);

  if (leftTokens.size === 0 || rightTokens.size === 0) {
    return false;
  }

  let sharedTokens = 0;

  for (const token of leftTokens) {
    if (rightTokens.has(token)) {
      sharedTokens += 1;
    }
  }

  if (sharedTokens === 0) {
    return false;
  }

  const smallerSetSize = Math.min(leftTokens.size, rightTokens.size);
  const overlapWithSmallerSet = sharedTokens / smallerSetSize;

  return sharedTokens >= 2 && overlapWithSmallerSet >= 0.5;
}

function areLinesEquivalent(left: number | null, right: number | null): boolean {
  if (left === null || right === null) {
    return left === right;
  }

  return Math.abs(left - right) <= LINE_TOLERANCE;
}

export function buildSuggestionEquivalenceKey({
  filePath,
  line,
  category,
  severity,
  title,
  description,
}: SuggestionEquivalenceInput): string {
  const linePart = line === null ? "no-line" : String(line);

  return [
    normalizeFilePath(filePath),
    linePart,
    category,
    severity,
    normalizeText(title),
    normalizeText(description),
  ].join("::");
}

function toSuggestionComparableSnapshot(
  suggestion: PullRequestReviewSuggestion
): SuggestionComparableSnapshot {
  const normalizedTitle = normalizeText(suggestion.title);
  const normalizedDescription = normalizeText(suggestion.description);
  const normalizedCombinedText = [normalizedTitle, normalizedDescription]
    .filter((value) => value.length > 0)
    .join(" ");

  return {
    exactKey: buildSuggestionEquivalenceKey({
      filePath: suggestion.filePath,
      line: suggestion.line,
      category: suggestion.category,
      severity: suggestion.severity,
      title: suggestion.title,
      description: suggestion.description,
    }),
    filePath: normalizeFilePath(suggestion.filePath),
    category: suggestion.category,
    line: suggestion.line,
    normalizedTitle,
    normalizedDescription,
    normalizedCombinedText,
  };
}

function isFlexiblyEquivalent(
  left: SuggestionComparableSnapshot,
  right: SuggestionComparableSnapshot
): boolean {
  if (left.filePath !== right.filePath) {
    return false;
  }

  if (left.category !== right.category) {
    return false;
  }

  if (!areLinesEquivalent(left.line, right.line)) {
    return false;
  }

  return (
    hasSufficientTextSimilarity(left.normalizedTitle, right.normalizedTitle) ||
    hasSufficientTextSimilarity(
      left.normalizedDescription,
      right.normalizedDescription
    ) ||
    hasSufficientTextSimilarity(left.normalizedCombinedText, right.normalizedCombinedText)
  );
}

function getPublishedSuggestionKeys(
  suggestions: PullRequestReviewSuggestion[]
): Set<string> {
  return new Set(
    suggestions
      .filter((suggestion) => suggestion.published)
      .map((suggestion) =>
        buildSuggestionEquivalenceKey({
          filePath: suggestion.filePath,
          line: suggestion.line,
          category: suggestion.category,
          severity: suggestion.severity,
          title: suggestion.title,
          description: suggestion.description,
        })
      )
  );
}

export function reconcileReviewSuggestionsAfterReanalysis({
  currentSuggestions,
  incomingSuggestions,
}: ReconcileReviewSuggestionsInput): PullRequestReviewSuggestion[] {
  const persistedPublishedSuggestions = currentSuggestions.filter(
    (suggestion) => suggestion.published
  );
  const publishedSuggestionKeys = getPublishedSuggestionKeys(currentSuggestions);
  const publishedComparableSuggestions = persistedPublishedSuggestions.map(
    toSuggestionComparableSnapshot
  );
  const acceptedIncomingExactKeys = new Set<string>();
  const acceptedIncomingComparableSuggestions: SuggestionComparableSnapshot[] = [];

  const deduplicatedIncomingSuggestions = incomingSuggestions.filter((suggestion) => {
    const incomingComparableSuggestion = toSuggestionComparableSnapshot(suggestion);
    const equivalenceKey = incomingComparableSuggestion.exactKey;

    if (publishedSuggestionKeys.has(equivalenceKey)) {
      return false;
    }

    if (
      publishedComparableSuggestions.some((publishedSuggestion) =>
        isFlexiblyEquivalent(incomingComparableSuggestion, publishedSuggestion)
      )
    ) {
      return false;
    }

    if (acceptedIncomingExactKeys.has(equivalenceKey)) {
      return false;
    }

    if (
      acceptedIncomingComparableSuggestions.some((acceptedSuggestion) =>
        isFlexiblyEquivalent(incomingComparableSuggestion, acceptedSuggestion)
      )
    ) {
      return false;
    }

    acceptedIncomingExactKeys.add(equivalenceKey);
    acceptedIncomingComparableSuggestions.push(incomingComparableSuggestion);
    return true;
  });

  return [...persistedPublishedSuggestions, ...deduplicatedIncomingSuggestions];
}
