import { z } from "zod";

export const pullRequestAnalysisSeveritySchema = z.enum(["low", "medium", "high"]);

export const pullRequestAnalysisCategorySchema = z.enum([
  "bug",
  "performance",
  "security",
  "readability",
  "testing",
  "api-contract",
  "observability",
  "dependency",
  "other",
]);

export const pullRequestAnalysisSuggestionSchema = z.object({
  id: z.string().min(1),
  severity: pullRequestAnalysisSeveritySchema,
  category: pullRequestAnalysisCategorySchema,
  title: z.string().min(1),
  description: z.string().min(1),
  suggestedComment: z.string().min(1),
  filePath: z.string().min(1).nullable(),
  line: z.number().int().positive().nullable(),
});

export const pullRequestAnalysisResultSchema = z.object({
  summary: z.string().min(1),
  suggestions: z.array(pullRequestAnalysisSuggestionSchema),
});

export const pullRequestSuggestionStatusSchema = z.enum([
  "pending",
  "approved",
  "rejected",
]);

export const pullRequestSuggestionPublishModeSchema = z.enum([
  "inline",
  "consolidated",
]);

export const pullRequestReviewSuggestionSchema =
  pullRequestAnalysisSuggestionSchema.extend({
    status: pullRequestSuggestionStatusSchema,
    editedComment: z.string().nullable(),
    published: z.boolean().default(false),
    publishedAt: z.string().nullable().default(null),
    publishMode: pullRequestSuggestionPublishModeSchema.nullable().default(null),
    publishedUrl: z.string().min(1).nullable().default(null),
    publishError: z.string().nullable().default(null),
  });

export const pullRequestAnalysisCodeContextFileSchema = z.object({
  filePath: z.string().min(1),
  patch: z.string().nullable(),
});

export const persistedPullRequestAnalysisSchema = z.object({
  analysisSummary: z.string().min(1),
  reviewSuggestions: z.array(pullRequestReviewSuggestionSchema),
  codeContextFiles: z.array(pullRequestAnalysisCodeContextFileSchema),
  savedAt: z.string().min(1),
});

export const publishSuggestionInputSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  filePath: z.string().nullable(),
  line: z.number().int().positive().nullable(),
  comment: z.string().min(1),
});

export const publishPullRequestSuggestionsRequestSchema = z.object({
  summary: z.string().min(1),
  suggestions: z.array(publishSuggestionInputSchema),
});

export const publishSuggestionResultSchema = z.object({
  id: z.string().min(1),
  published: z.boolean(),
  publishedAt: z.string().nullable(),
  publishMode: pullRequestSuggestionPublishModeSchema.nullable(),
  publishedUrl: z.string().min(1).nullable(),
  publishError: z.string().nullable(),
});

export const publishPullRequestSuggestionsSummarySchema = z.object({
  inlinePublished: z.number().int().nonnegative(),
  consolidatedPublished: z.number().int().nonnegative(),
  failed: z.number().int().nonnegative(),
});

export type PullRequestAnalysisSeverity = z.infer<
  typeof pullRequestAnalysisSeveritySchema
>;
export type PullRequestAnalysisCategory = z.infer<
  typeof pullRequestAnalysisCategorySchema
>;
export type PullRequestAnalysisSuggestion = z.infer<
  typeof pullRequestAnalysisSuggestionSchema
>;
export type PullRequestAnalysisResult = z.infer<
  typeof pullRequestAnalysisResultSchema
>;

export type PullRequestSuggestionStatus = "pending" | "approved" | "rejected";
export type PullRequestSuggestionFilter = "all" | PullRequestSuggestionStatus;
export type PullRequestSuggestionPublishMode = z.infer<
  typeof pullRequestSuggestionPublishModeSchema
>;

export type PullRequestReviewSuggestion = z.infer<
  typeof pullRequestReviewSuggestionSchema
>;

export type PullRequestAnalysisFileContext = {
  filePath: string;
  status: string;
  additions: number;
  deletions: number;
  patch: string | null;
};

export type PullRequestAnalysisContext = {
  repositoryOwner: string;
  repositoryName: string;
  pullRequestNumber: number;
  pullRequestTitle: string;
  pullRequestBody: string | null;
  pullRequestAuthor: string;
  pullRequestUrl: string;
  files: PullRequestAnalysisFileContext[];
};

export type PullRequestAnalysisCodeContextFile = z.infer<
  typeof pullRequestAnalysisCodeContextFileSchema
>;

export type PersistedPullRequestAnalysis = z.infer<
  typeof persistedPullRequestAnalysisSchema
>;

export type PullRequestAnalysisResponse = {
  analysis: PullRequestAnalysisResult;
  codeContextFiles: PullRequestAnalysisCodeContextFile[];
};

export type PullRequestAnalysisErrorResponse = {
  error: string;
};

export type PublishSuggestionInput = z.infer<typeof publishSuggestionInputSchema>;

export type PublishPullRequestSuggestionsRequest = z.infer<
  typeof publishPullRequestSuggestionsRequestSchema
>;

export type PublishSuggestionResult = z.infer<typeof publishSuggestionResultSchema>;
export type PublishPullRequestSuggestionsSummary = z.infer<
  typeof publishPullRequestSuggestionsSummarySchema
>;

export type PublishPullRequestSuggestionsResponse = {
  ok: true;
  summary: PublishPullRequestSuggestionsSummary;
  consolidatedCommentUrl: string | null;
  results: PublishSuggestionResult[];
};

export type PublishPullRequestSuggestionsErrorResponse = {
  error: string;
};
