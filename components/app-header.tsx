import { AppHeaderContent } from "@/components/app-header-content";
import { getAuthenticatedAppUser } from "@/lib/auth";
import type { AuthenticatedGitHubUser } from "@/types/github-user";

async function loadAuthenticatedUser(): Promise<AuthenticatedGitHubUser | null> {
  const authenticatedUser = await getAuthenticatedAppUser();

  if (!authenticatedUser) {
    return null;
  }

  return {
    id: authenticatedUser.githubUserId ?? authenticatedUser.githubLogin,
    login: authenticatedUser.githubLogin,
    name: authenticatedUser.name,
    avatarUrl: authenticatedUser.avatarUrl,
    profileUrl: authenticatedUser.profileUrl,
  };
}

export async function AppHeader() {
  const authenticatedUser = await loadAuthenticatedUser();

  return <AppHeaderContent authenticatedUser={authenticatedUser} />;
}
