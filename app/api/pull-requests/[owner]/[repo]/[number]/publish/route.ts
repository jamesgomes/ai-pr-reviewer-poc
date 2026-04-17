import { z } from "zod";
import { buildPullRequestReviewCommentMarkdown } from "@/lib/formatters/pr-review-comment";
import { resolveInlineReviewPayload } from "@/lib/github-inline-review";
import {
  createPullRequestComment,
  createPullRequestInlineComment,
  getPullRequestHeadSha,
  listPullRequestFiles,
} from "@/lib/github";
import {
  publishPullRequestSuggestionsRequestSchema,
  type PublishPullRequestSuggestionsSummary,
  type PublishPullRequestSuggestionsErrorResponse,
  type PublishPullRequestSuggestionsResponse,
  type PublishSuggestionInput,
  type PublishSuggestionResult,
} from "@/types/pr-analysis";

const publishPullRequestParamsSchema = z.object({
  owner: z.string().min(1),
  repo: z.string().min(1),
  number: z.coerce.number().int().positive(),
});

type PublishPullRequestRouteContext = {
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

  return "Erro desconhecido ao publicar comentarios no GitHub.";
}

function buildFailedSuggestionPublishResult(
  suggestionId: string,
  errorMessage: string
): PublishSuggestionResult {
  return {
    id: suggestionId,
    published: false,
    publishedAt: null,
    publishMode: null,
    publishedUrl: null,
    publishError: errorMessage,
  };
}

function toPublishSummary(results: PublishSuggestionResult[]): PublishPullRequestSuggestionsSummary {
  return results.reduce<PublishPullRequestSuggestionsSummary>(
    (summary, result) => {
      if (result.published && result.publishMode === "inline") {
        summary.inlinePublished += 1;
        return summary;
      }

      if (result.published && result.publishMode === "consolidated") {
        summary.consolidatedPublished += 1;
        return summary;
      }

      summary.failed += 1;
      return summary;
    },
    {
      inlinePublished: 0,
      consolidatedPublished: 0,
      failed: 0,
    }
  );
}

export async function POST(
  request: Request,
  { params }: PublishPullRequestRouteContext
) {
  try {
    const parsedParams = publishPullRequestParamsSchema.parse(await params);
    const requestBody = (await request.json()) as unknown;
    const parsedBody = publishPullRequestSuggestionsRequestSchema.parse(requestBody);

    if (parsedBody.suggestions.length === 0) {
      const payload: PublishPullRequestSuggestionsErrorResponse = {
        error: "Nenhuma sugestao aprovada foi enviada para publicacao.",
      };

      return Response.json(payload, { status: 400 });
    }

    const publishedAt = new Date().toISOString();
    const pullRequestHeadSha = await getPullRequestHeadSha({
      owner: parsedParams.owner,
      repo: parsedParams.repo,
      pullNumber: parsedParams.number,
    });
    const pullRequestFiles = await listPullRequestFiles({
      owner: parsedParams.owner,
      repo: parsedParams.repo,
      pullNumber: parsedParams.number,
    });
    const filesByPath = new Map(
      pullRequestFiles.map((file) => [file.filePath, file] as const)
    );

    const suggestionResultsById = new Map<string, PublishSuggestionResult>();
    const suggestionsForConsolidatedComment: PublishSuggestionInput[] = [];
    const inlineAttemptErrorsById = new Map<string, string>();

    for (const suggestion of parsedBody.suggestions) {
      const inlineResolution = resolveInlineReviewPayload(suggestion, filesByPath);

      if (!inlineResolution.ok) {
        suggestionsForConsolidatedComment.push(suggestion);
        continue;
      }

      try {
        const inlineComment = await createPullRequestInlineComment({
          owner: parsedParams.owner,
          repo: parsedParams.repo,
          pullNumber: parsedParams.number,
          body: inlineResolution.payload.body,
          commitId: pullRequestHeadSha,
          path: inlineResolution.payload.path,
          line: inlineResolution.payload.line,
          side: inlineResolution.payload.side,
        });

        suggestionResultsById.set(suggestion.id, {
          id: suggestion.id,
          published: true,
          publishedAt,
          publishMode: "inline",
          publishedUrl: inlineComment.url,
          publishError: null,
        });
      } catch (error: unknown) {
        inlineAttemptErrorsById.set(
          suggestion.id,
          `Nao foi possivel publicar o comentario inline: ${toErrorMessage(error)}`
        );
        suggestionsForConsolidatedComment.push(suggestion);
      }
    }

    let consolidatedCommentUrl: string | null = null;

    if (suggestionsForConsolidatedComment.length > 0) {
      try {
        const commentBody = buildPullRequestReviewCommentMarkdown({
          summary: parsedBody.summary,
          suggestions: suggestionsForConsolidatedComment,
        });
        const createdComment = await createPullRequestComment({
          owner: parsedParams.owner,
          repo: parsedParams.repo,
          pullNumber: parsedParams.number,
          body: commentBody,
        });

        consolidatedCommentUrl = createdComment.url;

        for (const suggestion of suggestionsForConsolidatedComment) {
          suggestionResultsById.set(suggestion.id, {
            id: suggestion.id,
            published: true,
            publishedAt,
            publishMode: "consolidated",
            publishedUrl: createdComment.url,
            publishError: null,
          });
        }
      } catch (error: unknown) {
        const consolidatedErrorMessage = `Nao foi possivel publicar o comentario consolidado: ${toErrorMessage(
          error
        )}`;

        for (const suggestion of suggestionsForConsolidatedComment) {
          const inlineErrorMessage = inlineAttemptErrorsById.get(suggestion.id);
          const mergedErrorMessage = inlineErrorMessage
            ? `${inlineErrorMessage}; ${consolidatedErrorMessage}`
            : consolidatedErrorMessage;

          suggestionResultsById.set(
            suggestion.id,
            buildFailedSuggestionPublishResult(suggestion.id, mergedErrorMessage)
          );
        }
      }
    }

    const orderedSuggestionResults = parsedBody.suggestions.map(
      (suggestion): PublishSuggestionResult =>
        suggestionResultsById.get(suggestion.id) ??
        buildFailedSuggestionPublishResult(
          suggestion.id,
          "Nao foi possivel obter o resultado da publicacao desta sugestao."
        )
    );

    const payload: PublishPullRequestSuggestionsResponse = {
      ok: true,
      summary: toPublishSummary(orderedSuggestionResults),
      consolidatedCommentUrl,
      results: orderedSuggestionResults,
    };

    return Response.json(payload);
  } catch (error: unknown) {
    const isValidationError = error instanceof z.ZodError;
    const payload: PublishPullRequestSuggestionsErrorResponse = {
      error: isValidationError
        ? "Dados invalidos para publicar sugestoes."
        : `Nao foi possivel publicar as sugestoes no GitHub. ${toErrorMessage(error)}`,
    };

    return Response.json(payload, { status: isValidationError ? 400 : 500 });
  }
}
