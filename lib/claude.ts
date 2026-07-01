import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { getPullRequestAnalysisInstructions } from "@/lib/pr-analysis-instructions";
import {
  pullRequestAnalysisResultSchema,
  type PullRequestAnalysisResult,
} from "@/types/pr-analysis";

const DEFAULT_ANTHROPIC_MODEL = "claude-opus-4-8";
const MAX_ANALYSIS_TOKENS = 16000;

function readRequiredEnv(name: "ANTHROPIC_API_KEY"): string {
  const value = process.env[name];

  if (!value || value.trim().length === 0) {
    throw new Error(`${name} não está definido no .env.local`);
  }

  return value;
}

function getAnthropicModel(): string {
  const customModel = process.env.ANTHROPIC_MODEL;

  if (customModel && customModel.trim().length > 0) {
    return customModel.trim();
  }

  return DEFAULT_ANTHROPIC_MODEL;
}

let cachedClient: Anthropic | null = null;

export function getAnthropicClient(): Anthropic {
  if (cachedClient) {
    return cachedClient;
  }

  cachedClient = new Anthropic({
    apiKey: readRequiredEnv("ANTHROPIC_API_KEY"),
  });

  return cachedClient;
}

export async function analyzePullRequestWithClaude(
  prompt: string
): Promise<PullRequestAnalysisResult> {
  const client = getAnthropicClient();
  const instructions = await getPullRequestAnalysisInstructions();

  const response = await client.messages.parse({
    model: getAnthropicModel(),
    max_tokens: MAX_ANALYSIS_TOKENS,
    system: instructions,
    messages: [{ role: "user", content: prompt }],
    output_config: {
      format: zodOutputFormat(pullRequestAnalysisResultSchema),
    },
  });

  if (!response.parsed_output) {
    throw new Error("O Claude retornou uma resposta sem estrutura válida.");
  }

  return response.parsed_output;
}
