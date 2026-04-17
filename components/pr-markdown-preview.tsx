import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";

type PullRequestMarkdownPreviewProps = {
  content: string;
};

const markdownComponents: Components = {
  h1: ({ children }) => (
    <h1 className="mt-5 text-2xl font-semibold text-zinc-950 first:mt-0 dark:text-zinc-50">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="mt-5 text-xl font-semibold text-zinc-900 dark:text-zinc-100">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="mt-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">{children}</h3>
  ),
  p: ({ children }) => <p className="mt-3 text-sm leading-6 text-zinc-700 dark:text-zinc-300">{children}</p>,
  ul: ({ children }) => (
    <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-zinc-700 dark:text-zinc-300">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm text-zinc-700 dark:text-zinc-300">
      {children}
    </ol>
  ),
  li: ({ children }) => <li>{children}</li>,
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="text-blue-700 underline underline-offset-2 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
    >
      {children}
    </a>
  ),
  strong: ({ children }) => <strong className="font-semibold text-zinc-900 dark:text-zinc-100">{children}</strong>,
  em: ({ children }) => <em className="italic">{children}</em>,
  pre: ({ children }) => (
    <pre className="mt-3 overflow-x-auto rounded-md border border-zinc-200 bg-zinc-50 p-3 text-xs leading-5 text-zinc-800 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100">
      {children}
    </pre>
  ),
  code: ({ className, children }) => {
    if (className && className.startsWith("language-")) {
      return <code className={className}>{children}</code>;
    }

    return (
      <code className="rounded bg-zinc-100 px-1 py-0.5 text-xs text-zinc-800 dark:bg-zinc-800 dark:text-zinc-100">
        {children}
      </code>
    );
  },
  blockquote: ({ children }) => (
    <blockquote className="mt-3 border-l-2 border-zinc-300 pl-3 text-sm text-zinc-700 dark:border-zinc-700 dark:text-zinc-300">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="my-4 border-zinc-200 dark:border-zinc-800" />,
};

export function PullRequestMarkdownPreview({
  content,
}: PullRequestMarkdownPreviewProps) {
  return (
    <ReactMarkdown
      skipHtml
      remarkPlugins={[remarkGfm, remarkBreaks]}
      components={markdownComponents}
    >
      {content}
    </ReactMarkdown>
  );
}
