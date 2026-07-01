import { readFile } from "node:fs/promises";
import path from "node:path";

let cachedAnalysisInstructions: string | null = null;

export async function getPullRequestAnalysisInstructions(): Promise<string> {
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
    throw new Error("O arquivo de instruções da análise de PR está vazio.");
  }

  cachedAnalysisInstructions = instructions;

  return instructions;
}
