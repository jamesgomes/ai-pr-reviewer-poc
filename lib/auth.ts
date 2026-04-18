import { getServerAuthSession } from "@/auth";

export type AuthenticatedAppUser = {
  githubUserId: string | null;
  githubLogin: string;
  name: string | null;
  avatarUrl: string | null;
  profileUrl: string | null;
  accessToken: string;
  storageKey: string;
};

function toStorageKey(githubUserId: string | null, githubLogin: string): string {
  if (githubUserId && githubUserId.trim().length > 0) {
    return githubUserId;
  }

  return githubLogin;
}

export async function getAuthenticatedAppUser(): Promise<AuthenticatedAppUser | null> {
  const session = await getServerAuthSession();

  if (!session || !session.user || !session.accessToken) {
    return null;
  }

  const githubLogin = session.user.login?.trim() ?? "";

  if (!githubLogin) {
    return null;
  }

  const githubUserId = session.user.id?.trim() ?? null;

  return {
    githubUserId,
    githubLogin,
    name: session.user.name ?? null,
    avatarUrl: session.user.avatarUrl ?? null,
    profileUrl: session.user.profileUrl ?? null,
    accessToken: session.accessToken,
    storageKey: toStorageKey(githubUserId, githubLogin),
  };
}
