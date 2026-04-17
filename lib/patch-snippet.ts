type PatchLineMarker = " " | "+" | "-";

export type PatchSnippetLineKind = "added" | "removed" | "context";

export type PatchSnippetLine = {
  lineNumber: number | null;
  marker: PatchLineMarker;
  kind: PatchSnippetLineKind;
  content: string;
};

type ParsedPatchLine = {
  oldLineNumber: number | null;
  newLineNumber: number | null;
  marker: PatchLineMarker;
  content: string;
};

type ParsedPatchHunk = {
  lines: ParsedPatchLine[];
};

export type ExtractedPatchSnippet = {
  referenceLine: number | null;
  lines: PatchSnippetLine[];
};

function markerToKind(marker: PatchLineMarker): PatchSnippetLineKind {
  if (marker === "+") {
    return "added";
  }

  if (marker === "-") {
    return "removed";
  }

  return "context";
}

function parsePatchHunks(patch: string): ParsedPatchHunk[] {
  const hunks: ParsedPatchHunk[] = [];
  const patchLines = patch.split("\n");
  const hunkHeaderRegex = /^@@\s+-(\d+)(?:,\d+)?\s+\+(\d+)(?:,\d+)?\s+@@/;

  let currentHunk: ParsedPatchHunk | null = null;
  let currentOldLineNumber = 0;
  let currentNewLineNumber = 0;

  for (const patchLine of patchLines) {
    const headerMatch = patchLine.match(hunkHeaderRegex);

    if (headerMatch) {
      currentOldLineNumber = Number.parseInt(headerMatch[1], 10);
      currentNewLineNumber = Number.parseInt(headerMatch[2], 10);
      currentHunk = { lines: [] };
      hunks.push(currentHunk);
      continue;
    }

    if (!currentHunk || patchLine.length === 0) {
      continue;
    }

    const marker = patchLine[0] as PatchLineMarker;

    if (marker !== " " && marker !== "+" && marker !== "-") {
      continue;
    }

    const content = patchLine.slice(1);

    if (marker === " ") {
      currentHunk.lines.push({
        oldLineNumber: currentOldLineNumber,
        newLineNumber: currentNewLineNumber,
        marker,
        content,
      });
      currentOldLineNumber += 1;
      currentNewLineNumber += 1;
      continue;
    }

    if (marker === "+") {
      currentHunk.lines.push({
        oldLineNumber: null,
        newLineNumber: currentNewLineNumber,
        marker,
        content,
      });
      currentNewLineNumber += 1;
      continue;
    }

    currentHunk.lines.push({
      oldLineNumber: currentOldLineNumber,
      newLineNumber: null,
      marker,
      content,
    });
    currentOldLineNumber += 1;
  }

  return hunks;
}

function toSnippetLines(lines: ParsedPatchLine[]): PatchSnippetLine[] {
  return lines.map((line) => ({
    lineNumber: line.newLineNumber ?? line.oldLineNumber,
    marker: line.marker,
    kind: markerToKind(line.marker),
    content: line.content,
  }));
}

export function extractPatchSnippet(
  patch: string | null,
  lineNumber: number,
  contextRadius = 3
): ExtractedPatchSnippet | null {
  if (!patch) {
    return null;
  }

  const hunks = parsePatchHunks(patch);

  if (hunks.length === 0) {
    return null;
  }

  let bestHunkIndex = 0;
  let bestLineIndex = 0;
  let bestDistance = Number.POSITIVE_INFINITY;
  let bestReferenceLine: number | null = null;

  hunks.forEach((hunk, hunkIndex) => {
    hunk.lines.forEach((line, lineIndex) => {
      const candidateLineNumber = line.newLineNumber ?? line.oldLineNumber;

      if (candidateLineNumber === null) {
        return;
      }

      const distance = Math.abs(candidateLineNumber - lineNumber);

      if (distance < bestDistance) {
        bestDistance = distance;
        bestHunkIndex = hunkIndex;
        bestLineIndex = lineIndex;
        bestReferenceLine = candidateLineNumber;
      }
    });
  });

  const bestHunk = hunks[bestHunkIndex];

  if (bestHunk.lines.length === 0) {
    return null;
  }

  const startIndex = Math.max(bestLineIndex - contextRadius, 0);
  const endIndex = Math.min(bestLineIndex + contextRadius + 1, bestHunk.lines.length);
  const windowLines = bestHunk.lines.slice(startIndex, endIndex);

  return {
    referenceLine: bestReferenceLine,
    lines: toSnippetLines(windowLines),
  };
}
