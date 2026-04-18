import {
  persistedPullRequestAnalysisSchema,
  type PersistedPullRequestAnalysis,
} from "@/types/pr-analysis";

const PULL_REQUEST_ANALYSIS_STORAGE_PREFIX = "pr-review-assistant:analysis";

type PullRequestAnalysisStorageKeyInput = {
  githubUserKey: string;
  owner: string;
  repo: string;
  pullNumber: number;
};

export type PullRequestLocalReviewState = {
  isReviewed: boolean;
  lastPublishedAt: string | null;
};

function canUseLocalStorage(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function buildPullRequestAnalysisStorageKey({
  githubUserKey,
  owner,
  repo,
  pullNumber,
}: PullRequestAnalysisStorageKeyInput): string {
  return `${PULL_REQUEST_ANALYSIS_STORAGE_PREFIX}:${githubUserKey}:${owner}:${repo}:${pullNumber}`;
}

export function readPersistedPullRequestAnalysis({
  githubUserKey,
  owner,
  repo,
  pullNumber,
}: PullRequestAnalysisStorageKeyInput): PersistedPullRequestAnalysis | null {
  if (!canUseLocalStorage()) {
    return null;
  }

  const storageKey = buildPullRequestAnalysisStorageKey({
    githubUserKey,
    owner,
    repo,
    pullNumber,
  });

  let rawValue: string | null = null;

  try {
    rawValue = window.localStorage.getItem(storageKey);
  } catch {
    return null;
  }

  if (!rawValue) {
    return null;
  }

  let parsedValue: unknown;

  try {
    parsedValue = JSON.parse(rawValue) as unknown;
  } catch {
    try {
      window.localStorage.removeItem(storageKey);
    } catch {
      // ignore storage cleanup failure
    }

    return null;
  }

  const parsedResult = persistedPullRequestAnalysisSchema.safeParse(parsedValue);

  if (!parsedResult.success) {
    try {
      window.localStorage.removeItem(storageKey);
    } catch {
      // ignore storage cleanup failure
    }

    return null;
  }

  return parsedResult.data;
}

export function writePersistedPullRequestAnalysis(
  keyInput: PullRequestAnalysisStorageKeyInput,
  data: PersistedPullRequestAnalysis
): boolean {
  if (!canUseLocalStorage()) {
    return false;
  }

  const parsedResult = persistedPullRequestAnalysisSchema.safeParse(data);

  if (!parsedResult.success) {
    return false;
  }

  const storageKey = buildPullRequestAnalysisStorageKey(keyInput);

  try {
    window.localStorage.setItem(storageKey, JSON.stringify(parsedResult.data));
    return true;
  } catch {
    return false;
  }
}

function toLastPublishedAt(data: PersistedPullRequestAnalysis): string | null {
  let latestPublishedAt: string | null = null;
  let latestTimestamp = Number.NEGATIVE_INFINITY;

  for (const suggestion of data.reviewSuggestions) {
    if (!suggestion.published || !suggestion.publishedAt) {
      continue;
    }

    const publishedTimestamp = new Date(suggestion.publishedAt).getTime();

    if (Number.isNaN(publishedTimestamp)) {
      continue;
    }

    if (publishedTimestamp > latestTimestamp) {
      latestTimestamp = publishedTimestamp;
      latestPublishedAt = suggestion.publishedAt;
    }
  }

  return latestPublishedAt;
}

export function readPullRequestLocalReviewState(
  keyInput: PullRequestAnalysisStorageKeyInput
): PullRequestLocalReviewState {
  const persistedAnalysis = readPersistedPullRequestAnalysis(keyInput);

  if (!persistedAnalysis) {
    return {
      isReviewed: false,
      lastPublishedAt: null,
    };
  }

  const hasPublishedSuggestion = persistedAnalysis.reviewSuggestions.some(
    (suggestion) => suggestion.published
  );

  if (!hasPublishedSuggestion) {
    return {
      isReviewed: false,
      lastPublishedAt: null,
    };
  }

  return {
    isReviewed: true,
    lastPublishedAt: toLastPublishedAt(persistedAnalysis),
  };
}
