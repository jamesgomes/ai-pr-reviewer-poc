import { z } from "zod";
import { getAuthenticatedAppUser } from "@/lib/auth";
import { approvePullRequest } from "@/lib/github";
import type {
  ApprovePullRequestErrorResponse,
  ApprovePullRequestResponse,
} from "@/types/pr-analysis";

const approvePullRequestParamsSchema = z.object({
  owner: z.string().min(1),
  repo: z.string().min(1),
  number: z.coerce.number().int().positive(),
});

type ApprovePullRequestRouteContext = {
  params: Promise<{
    owner: string;
    repo: string;
    number: string;
  }>;
};

function toErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return "Erro desconhecido ao aprovar o Pull Request.";
}

export async function POST(
  _request: Request,
  { params }: ApprovePullRequestRouteContext
) {
  try {
    const authenticatedUser = await getAuthenticatedAppUser();

    if (!authenticatedUser) {
      const unauthorizedPayload: ApprovePullRequestErrorResponse = {
        error: "Sessão inválida. Faça login novamente.",
      };

      return Response.json(unauthorizedPayload, { status: 401 });
    }

    const parsedParams = approvePullRequestParamsSchema.parse(await params);
    const approvalResult = await approvePullRequest({
      owner: parsedParams.owner,
      repo: parsedParams.repo,
      pullNumber: parsedParams.number,
      accessToken: authenticatedUser.accessToken,
    });

    const payload: ApprovePullRequestResponse = {
      ok: true,
      approvedAt: new Date().toISOString(),
      approvalUrl: approvalResult.url,
    };

    return Response.json(payload);
  } catch (error: unknown) {
    const isValidationError = error instanceof z.ZodError;
    const payload: ApprovePullRequestErrorResponse = {
      error: isValidationError
        ? "Parâmetros inválidos para aprovar o PR."
        : `Não foi possível aprovar o Pull Request no GitHub. ${toErrorMessage(error)}`,
    };

    return Response.json(payload, { status: isValidationError ? 400 : 500 });
  }
}
