import { z } from "zod";
import { getAuthenticatedAppUser } from "@/lib/auth";
import { analyzePullRequestWithOpenAI } from "@/lib/openai";
import { buildPullRequestAnalysisPrompt } from "@/lib/prompts/pr-analysis";
import { getPullRequestAnalysisContext } from "@/lib/pull-requests";
import type {
  PullRequestAnalysisErrorResponse,
  PullRequestAnalysisResponse,
} from "@/types/pr-analysis";

const analyzePullRequestParamsSchema = z.object({
  owner: z.string().min(1),
  repo: z.string().min(1),
  number: z.coerce.number().int().positive(),
});

type AnalyzePullRequestRouteContext = {
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

  return "Erro desconhecido ao analisar o PR.";
}

export async function POST(
  _request: Request,
  { params }: AnalyzePullRequestRouteContext
) {
  try {
    const authenticatedUser = await getAuthenticatedAppUser();

    if (!authenticatedUser) {
      const unauthorizedPayload: PullRequestAnalysisErrorResponse = {
        error: "Sessão inválida. Faça login novamente.",
      };

      return Response.json(unauthorizedPayload, { status: 401 });
    }

    const parsedParams = analyzePullRequestParamsSchema.parse(await params);
    const context = await getPullRequestAnalysisContext(
      parsedParams.owner,
      parsedParams.repo,
      parsedParams.number,
      authenticatedUser.accessToken
    );
    const prompt = buildPullRequestAnalysisPrompt(context);
    const analysis = await analyzePullRequestWithOpenAI(prompt);
    const payload: PullRequestAnalysisResponse = {
      analysis,
      codeContextFiles: context.files.map((file) => ({
        filePath: file.filePath,
        patch: file.patch,
      })),
    };

    return Response.json(payload);
  } catch (error: unknown) {
    const status = error instanceof z.ZodError ? 400 : 500;
    const payload: PullRequestAnalysisErrorResponse = {
      error:
        status === 400
          ? "Parâmetros inválidos para analisar o PR."
          : `Não foi possível analisar o PR com IA. ${toErrorMessage(error)}`,
    };

    return Response.json(payload, { status });
  }
}
