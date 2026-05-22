import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";

type PullRequestMarkdownPreviewProps = {
  content: string;
};

function toDisplayImageSource(source: string | undefined): string | undefined {
  if (!source) {
    return undefined;
  }

  try {
    const parsedUrl = new URL(source);

    if (
      parsedUrl.protocol === "https:" &&
      parsedUrl.hostname === "github.com" &&
      parsedUrl.pathname.startsWith("/user-attachments/assets/")
    ) {
      return `/api/github-image?url=${encodeURIComponent(source)}`;
    }

    return source;
  } catch {
    return source;
  }
}

const markdownComponents: Components = {
  h1: ({ children }) => (
    <h1 className="mt-5 text-2xl font-semibold text-[var(--app-ink)] first:mt-0">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="mt-5 text-xl font-semibold text-[var(--app-ink)]">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="mt-4 text-lg font-semibold text-[var(--app-ink)]">{children}</h3>
  ),
  p: ({ children }) => (
    <p className="mt-3 text-sm leading-6 text-[var(--app-body-muted-strong)]">{children}</p>
  ),
  ul: ({ children }) => (
    <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-[var(--app-body-muted-strong)]">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm text-[var(--app-body-muted-strong)]">
      {children}
    </ol>
  ),
  li: ({ children }) => <li>{children}</li>,
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="text-[var(--app-primary)] underline underline-offset-2 hover:text-[var(--app-primary-focus)]"
    >
      {children}
    </a>
  ),
  strong: ({ children }) => <strong className="font-semibold text-[var(--app-ink)]">{children}</strong>,
  em: ({ children }) => <em className="italic">{children}</em>,
  pre: ({ children }) => (
    <pre className="mt-3 overflow-x-auto rounded-[11px] border border-[var(--app-divider)] bg-[var(--app-canvas-parchment)] p-3 text-xs leading-5 text-[var(--app-body-muted-strong)]">
      {children}
    </pre>
  ),
  code: ({ className, children }) => {
    if (className && className.startsWith("language-")) {
      return <code className={className}>{children}</code>;
    }

    return (
      <code className="rounded bg-[var(--app-divider-soft)] px-1 py-0.5 text-xs text-[var(--app-body-muted-strong)]">
        {children}
      </code>
    );
  },
  blockquote: ({ children }) => (
    <blockquote className="mt-3 border-l-2 border-[var(--app-divider)] pl-3 text-sm text-[var(--app-body-muted-strong)]">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="my-4 border-[var(--app-divider)]" />,
  img: ({ src, alt }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={toDisplayImageSource(typeof src === "string" ? src : undefined)}
      alt={typeof alt === "string" ? alt : ""}
      loading="lazy"
      className="mt-3 h-auto max-w-full rounded-[11px] border border-[var(--app-divider)]"
    />
  ),
};

export function PullRequestMarkdownPreview({
  content,
}: PullRequestMarkdownPreviewProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkBreaks]}
      rehypePlugins={[rehypeRaw, rehypeSanitize]}
      components={markdownComponents}
    >
      {content}
    </ReactMarkdown>
  );
}
