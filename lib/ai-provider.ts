import { analyzePullRequestWithClaude } from "@/lib/claude";
import { analyzePullRequestWithOpenAI } from "@/lib/openai";
import type { PullRequestAnalysisResult } from "@/types/pr-analysis";

export type AiProvider = "claude" | "openai";

const DEFAULT_AI_PROVIDER: AiProvider = "claude";

function getConfiguredProvider(): AiProvider {
  const provider = process.env.AI_PROVIDER?.trim().toLowerCase();

  if (provider === "openai") {
    return "openai";
  }

  return DEFAULT_AI_PROVIDER;
}

export async function analyzePullRequest(
  prompt: string
): Promise<PullRequestAnalysisResult> {
  const provider = getConfiguredProvider();

  if (provider === "openai") {
    return analyzePullRequestWithOpenAI(prompt);
  }

  return analyzePullRequestWithClaude(prompt);
}
