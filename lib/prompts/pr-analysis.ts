import type { PullRequestAnalysisContext } from "@/types/pr-analysis";

const MAX_FILES_IN_PROMPT = 60;
const MAX_PATCH_CHARS = 6000;

type PromptFileContext = {
  filePath: string;
  status: string;
  additions: number;
  deletions: number;
  patch: string | null;
  patchTruncated: boolean;
};

function toPromptFileContext(
  context: PullRequestAnalysisContext
): PromptFileContext[] {
  return context.files.slice(0, MAX_FILES_IN_PROMPT).map((file) => {
    const wasTruncated = typeof file.patch === "string" && file.patch.length > MAX_PATCH_CHARS;

    return {
      filePath: file.filePath,
      status: file.status,
      additions: file.additions,
      deletions: file.deletions,
      patch: file.patch?.slice(0, MAX_PATCH_CHARS) ?? null,
      patchTruncated: wasTruncated,
    };
  });
}

export function buildPullRequestAnalysisPrompt(
  context: PullRequestAnalysisContext
): string {
  const files = toPromptFileContext(context);
  const omittedFilesCount = Math.max(context.files.length - files.length, 0);

  const promptContext = {
    repository: `${context.repositoryOwner}/${context.repositoryName}`,
    pullRequest: {
      number: context.pullRequestNumber,
      title: context.pullRequestTitle,
      body: context.pullRequestBody,
      author: context.pullRequestAuthor,
      url: context.pullRequestUrl,
    },
    files,
    omittedFilesCount,
  };

  return [
    "Analise tecnicamente este pull request com foco apenas no que foi alterado no diff.",
    "Retorne apenas sugestoes acionaveis e objetivas.",
    "Nao invente arquivos, linhas ou problemas sem evidencia no contexto.",
    "Se nao houver achados relevantes, retorne suggestions vazio e explique no summary.",
    "",
    "Contexto estruturado do PR:",
    JSON.stringify(promptContext, null, 2),
  ].join("\n");
}
