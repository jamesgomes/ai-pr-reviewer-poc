const WELCOME_MODAL_STORAGE_PREFIX = "ai-reviewer:welcome-modal-seen";

export type WelcomeModalStorageUser = {
  githubUserId: string | null;
  githubLogin: string;
};

function canUseLocalStorage(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function normalizeGithubLogin(login: string): string {
  return login.trim().toLowerCase();
}

function resolveWelcomeModalUserKey(user: WelcomeModalStorageUser): string {
  const githubUserId = user.githubUserId?.trim();

  if (githubUserId && githubUserId.length > 0) {
    return githubUserId;
  }

  return normalizeGithubLogin(user.githubLogin);
}

export function buildWelcomeModalSeenStorageKey(user: WelcomeModalStorageUser): string {
  return `${WELCOME_MODAL_STORAGE_PREFIX}:${resolveWelcomeModalUserKey(user)}`;
}

export function hasSeenWelcomeModal(user: WelcomeModalStorageUser): boolean {
  if (!canUseLocalStorage()) {
    return false;
  }

  const storageKey = buildWelcomeModalSeenStorageKey(user);

  try {
    return window.localStorage.getItem(storageKey) === "1";
  } catch {
    return false;
  }
}

export function markWelcomeModalAsSeen(user: WelcomeModalStorageUser): boolean {
  if (!canUseLocalStorage()) {
    return false;
  }

  const storageKey = buildWelcomeModalSeenStorageKey(user);

  try {
    window.localStorage.setItem(storageKey, "1");
    return true;
  } catch {
    return false;
  }
}
