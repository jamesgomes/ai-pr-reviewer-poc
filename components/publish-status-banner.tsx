import { buttonVariants } from "@/components/ui/button";

type PublishStatusBannerProps = {
  inlinePublishedCount: number;
  consolidatedPublishedCount: number;
  failedCount: number;
  publishedCommentUrl: string | null;
  hasConsolidatedCommentUrl: boolean;
};

function toBannerTitle(failedCount: number): string {
  if (failedCount > 0) {
    return "Publicacao concluida com falhas";
  }

  return "Publicacao concluida";
}

export function PublishStatusBanner({
  inlinePublishedCount,
  consolidatedPublishedCount,
  failedCount,
  publishedCommentUrl,
  hasConsolidatedCommentUrl,
}: PublishStatusBannerProps) {
  const isPartialFailure = failedCount > 0;

  return (
    <div
      className={`mt-3 rounded-md border p-3 ${
        isPartialFailure
          ? "border-amber-300 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/30"
          : "border-emerald-300 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-950/30"
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p
            className={`text-sm font-semibold ${
              isPartialFailure
                ? "text-amber-900 dark:text-amber-200"
                : "text-emerald-900 dark:text-emerald-200"
            }`}
          >
            {toBannerTitle(failedCount)}
          </p>
          <p
            className={`mt-1 text-sm ${
              isPartialFailure
                ? "text-amber-800 dark:text-amber-300"
                : "text-emerald-800 dark:text-emerald-300"
            }`}
          >
            Inline: {inlinePublishedCount} · Consolidado: {consolidatedPublishedCount} · Falhas:{" "}
            {failedCount}
          </p>
        </div>

        {publishedCommentUrl && (
          <a
            href={publishedCommentUrl}
            target="_blank"
            rel="noreferrer"
            className={buttonVariants("secondary")}
          >
            {hasConsolidatedCommentUrl
              ? "Ver comentario consolidado no GitHub"
              : "Ver comentario no GitHub"}
          </a>
        )}
      </div>
    </div>
  );
}
