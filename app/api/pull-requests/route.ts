import { listRequestedPullRequests } from "@/lib/pull-requests";
import type { ApiErrorResponse, PullRequestListResponse } from "@/types/pull-request";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return "Falha ao carregar PRs do GitHub.";
}

export async function GET() {
  try {
    const pullRequests = await listRequestedPullRequests();
    const payload: PullRequestListResponse = { pullRequests };

    return Response.json(payload);
  } catch (error: unknown) {
    const payload: ApiErrorResponse = {
      error: `Nao foi possivel carregar os PRs pendentes de revisao. ${getErrorMessage(error)}`,
    };

    return Response.json(payload, { status: 500 });
  }
}
