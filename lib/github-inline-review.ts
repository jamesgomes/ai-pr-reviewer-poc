import type { PublishSuggestionInput } from "@/types/pr-analysis";

export type PullRequestPublishFileContext = {
  filePath: string;
  patch: string | null;
};

type InlineReviewPayload = {
  path: string;
  line: number;
  side: "RIGHT";
  body: string;
};

type InlineReviewResolutionResult =
  | { ok: true; payload: InlineReviewPayload }
  | { ok: false; reason: string };

const HUNK_HEADER_PATTERN = /^@@ -(\d+)(?:,\d+)? \+(\d+)(?:,\d+)? @@/;

function extractRightSideDiffLines(patch: string): number[] {
  const lines = patch.split("\n");
  const rightSideLines: number[] = [];
  let newLine = 0;
  let isInsideHunk = false;

  for (const line of lines) {
    const hunkMatch = line.match(HUNK_HEADER_PATTERN);

    if (hunkMatch) {
      newLine = Number.parseInt(hunkMatch[2], 10);
      isInsideHunk = true;
      continue;
    }

    if (!isInsideHunk) {
      continue;
    }

    if (line.startsWith("+") && !line.startsWith("+++")) {
      rightSideLines.push(newLine);
      newLine += 1;
      continue;
    }

    if (line.startsWith("-") && !line.startsWith("---")) {
      continue;
    }

    if (line.startsWith(" ")) {
      rightSideLines.push(newLine);
      newLine += 1;
      continue;
    }
  }

  return rightSideLines;
}

function resolveNearestRightSideLine(targetLine: number, candidateLines: number[]): number | null {
  if (candidateLines.length === 0) {
    return null;
  }

  let nearestLine = candidateLines[0];
  let nearestDistance = Math.abs(nearestLine - targetLine);

  for (const line of candidateLines) {
    const currentDistance = Math.abs(line - targetLine);

    if (currentDistance < nearestDistance) {
      nearestLine = line;
      nearestDistance = currentDistance;
      continue;
    }

    if (currentDistance === nearestDistance && line > nearestLine) {
      nearestLine = line;
    }
  }

  return nearestLine;
}

export function resolveInlineReviewPayload(
  suggestion: PublishSuggestionInput,
  filesByPath: Map<string, PullRequestPublishFileContext>
): InlineReviewResolutionResult {
  if (suggestion.filePath === null || suggestion.line === null) {
    return {
      ok: false,
      reason: "Sugestao sem filePath/line para publicacao inline.",
    };
  }

  const file = filesByPath.get(suggestion.filePath);

  if (!file) {
    return {
      ok: false,
      reason: "Arquivo da sugestao nao encontrado no diff do PR.",
    };
  }

  if (!file.patch) {
    return {
      ok: false,
      reason: "Arquivo sem patch disponivel para publicacao inline.",
    };
  }

  const rightSideLines = extractRightSideDiffLines(file.patch);
  const resolvedLine = resolveNearestRightSideLine(suggestion.line, rightSideLines);

  if (resolvedLine === null) {
    return {
      ok: false,
      reason: "Nao foi possivel localizar uma linha valida no diff para comentario inline.",
    };
  }

  return {
    ok: true,
    payload: {
      path: suggestion.filePath,
      line: resolvedLine,
      side: "RIGHT",
      body: suggestion.comment,
    },
  };
}
