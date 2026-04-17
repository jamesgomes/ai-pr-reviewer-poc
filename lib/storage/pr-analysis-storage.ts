import {
  persistedPullRequestAnalysisSchema,
  type PersistedPullRequestAnalysis,
} from "@/types/pr-analysis";

const PULL_REQUEST_ANALYSIS_STORAGE_PREFIX = "pr-review-assistant:analysis";

type PullRequestAnalysisStorageKeyInput = {
  owner: string;
  repo: string;
  pullNumber: number;
};

function canUseLocalStorage(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function buildPullRequestAnalysisStorageKey({
  owner,
  repo,
  pullNumber,
}: PullRequestAnalysisStorageKeyInput): string {
  return `${PULL_REQUEST_ANALYSIS_STORAGE_PREFIX}:${owner}:${repo}:${pullNumber}`;
}

export function readPersistedPullRequestAnalysis({
  owner,
  repo,
  pullNumber,
}: PullRequestAnalysisStorageKeyInput): PersistedPullRequestAnalysis | null {
  if (!canUseLocalStorage()) {
    return null;
  }

  const storageKey = buildPullRequestAnalysisStorageKey({
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
