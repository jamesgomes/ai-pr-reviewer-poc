import {
  extractPatchSnippet,
  type PatchSnippetLine,
  type PatchSnippetLineKind,
} from "@/lib/patch-snippet";

type PullRequestSuggestionDiffSnippetProps = {
  filePath: string;
  line: number;
  patch: string | null;
};

const lineTypeRowClassName: Record<PatchSnippetLineKind, string> = {
  added: "bg-emerald-50/80 dark:bg-emerald-950/30",
  removed: "bg-red-50/80 dark:bg-red-950/30",
  context: "bg-white dark:bg-zinc-950",
};

const lineTypeMarkerClassName: Record<PatchSnippetLineKind, string> = {
  added: "text-emerald-700 dark:text-emerald-300",
  removed: "text-red-700 dark:text-red-300",
  context: "text-zinc-500 dark:text-zinc-400",
};

function renderLineNumber(line: PatchSnippetLine): string {
  if (line.lineNumber === null) {
    return "";
  }

  return String(line.lineNumber);
}

export function PullRequestSuggestionDiffSnippet({
  filePath,
  line,
  patch,
}: PullRequestSuggestionDiffSnippetProps) {
  const snippet = extractPatchSnippet(patch, line);

  return (
    <div className="mt-3 rounded-md border border-zinc-200 dark:border-zinc-800">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-200 bg-zinc-50 px-3 py-2 dark:border-zinc-800 dark:bg-zinc-900">
        <p className="min-w-0 truncate text-xs font-semibold text-zinc-700 dark:text-zinc-300">
          {filePath}
        </p>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Linha de referencia: {snippet?.referenceLine ?? line}
        </p>
      </div>

      {snippet ? (
        <div className="overflow-x-auto">
          <div className="min-w-[560px] font-mono text-xs leading-5">
            {snippet.lines.map((snippetLine, index) => (
              <div
                key={`${snippetLine.marker}-${snippetLine.lineNumber ?? "na"}-${index}`}
                className={`grid grid-cols-[72px_24px_minmax(0,1fr)] border-b border-zinc-200 last:border-b-0 dark:border-zinc-800 ${lineTypeRowClassName[snippetLine.kind]}`}
              >
                <div className="select-none border-r border-zinc-200 px-2 py-1 text-right text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
                  {renderLineNumber(snippetLine)}
                </div>
                <div
                  className={`select-none border-r border-zinc-200 px-1 py-1 text-center font-semibold dark:border-zinc-800 ${lineTypeMarkerClassName[snippetLine.kind]}`}
                >
                  {snippetLine.marker}
                </div>
                <code className="whitespace-pre px-2 py-1 text-zinc-800 dark:text-zinc-200">
                  {snippetLine.content}
                </code>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="px-3 py-3 text-sm text-zinc-600 dark:text-zinc-400">
          Nao foi possivel extrair o trecho correspondente no patch deste arquivo.
        </p>
      )}
    </div>
  );
}
