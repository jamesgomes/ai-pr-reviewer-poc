import OpenAI from "openai";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { zodTextFormat } from "openai/helpers/zod";
import {
  pullRequestAnalysisResultSchema,
  type PullRequestAnalysisResult,
} from "@/types/pr-analysis";

function readRequiredEnv(name: "OPENAI_API_KEY"): string {
  const value = process.env[name];

  if (!value || value.trim().length === 0) {
    throw new Error(`${name} nao foi definido no .env.local`);
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
let cachedAnalysisInstructions: string | null = null;

async function getPullRequestAnalysisInstructions(): Promise<string> {
  if (cachedAnalysisInstructions) {
    return cachedAnalysisInstructions;
  }

  const instructionsFilePath = path.join(
    process.cwd(),
    "docs",
    "prompts",
    "pr-analysis-instructions.md"
  );

  const fileContent = await readFile(instructionsFilePath, "utf8");
  const instructions = fileContent.trim();

  if (!instructions) {
    throw new Error("O arquivo de instrucoes da analise de PR esta vazio.");
  }

  cachedAnalysisInstructions = instructions;

  return instructions;
}

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
    throw new Error("A OpenAI retornou uma resposta sem payload estruturado.");
  }

  return response.output_parsed;
}
