import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import { getPullRequestAnalysisInstructions } from "@/lib/pr-analysis-instructions";
import {
  pullRequestAnalysisResultSchema,
  type PullRequestAnalysisResult,
} from "@/types/pr-analysis";

function readRequiredEnv(name: "OPENAI_API_KEY"): string {
  const value = process.env[name];

  if (!value || value.trim().length === 0) {
    throw new Error(`${name} não está definido no .env.local`);
  }

  return value;
}

function getOpenAIModel(): string {
  const customModel = process.env.OPENAI_MODEL;

  if (customModel && customModel.trim().length > 0) {
    return customModel.trim();
  }

  return "gpt-5.2";
}

let cachedClient: OpenAI | null = null;

export function getOpenAIClient(): OpenAI {
  if (cachedClient) {
    return cachedClient;
  }

  cachedClient = new OpenAI({
    apiKey: readRequiredEnv("OPENAI_API_KEY"),
  });

  return cachedClient;
}

export async function analyzePullRequestWithOpenAI(
  prompt: string
): Promise<PullRequestAnalysisResult> {
  const client = getOpenAIClient();
  const instructions = await getPullRequestAnalysisInstructions();

  const response = await client.responses.parse({
    model: getOpenAIModel(),
    temperature: 0.1,
    instructions,
    input: prompt,
    text: {
      format: zodTextFormat(
        pullRequestAnalysisResultSchema,
        "pull_request_analysis_result"
      ),
    },
  });

  if (!response.output_parsed) {
    throw new Error("A OpenAI retornou uma resposta sem estrutura válida.");
  }

  return response.output_parsed;
}
