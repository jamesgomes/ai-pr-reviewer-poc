import { getAuthenticatedAppUser } from "@/lib/auth";
import { listRequestedPullRequests } from "@/lib/pull-requests";
import type { ApiErrorResponse, PullRequestListResponse } from "@/types/pull-request";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return "Não foi possível carregar Pull Requests no GitHub.";
}

export async function GET() {
  try {
    const authenticatedUser = await getAuthenticatedAppUser();

    if (!authenticatedUser) {
      const unauthorizedPayload: ApiErrorResponse = {
        error: "Sessão inválida. Faça login novamente.",
      };

      return Response.json(unauthorizedPayload, { status: 401 });
    }

    const pullRequests = await listRequestedPullRequests(
      authenticatedUser.accessToken,
      authenticatedUser.githubLogin
    );
    const payload: PullRequestListResponse = {
      pullRequests,
      authenticatedUser: {
        githubUserId: authenticatedUser.githubUserId,
        githubLogin: authenticatedUser.githubLogin,
        name: authenticatedUser.name,
        avatarUrl: authenticatedUser.avatarUrl,
        profileUrl: authenticatedUser.profileUrl,
        storageKey: authenticatedUser.storageKey,
      },
    };

    return Response.json(payload);
  } catch (error: unknown) {
    const payload: ApiErrorResponse = {
      error: `Não foi possível carregar os Pull Requests pendentes. ${getErrorMessage(error)}`,
    };

    return Response.json(payload, { status: 500 });
  }
}
