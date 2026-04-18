type PullRequestStatusProps = {
  state: "open" | "closed";
};

const stateStyles: Record<PullRequestStatusProps["state"], string> = {
  open:
    "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/70 dark:bg-emerald-950/30 dark:text-emerald-300",
  closed:
    "border-zinc-300 bg-zinc-100 text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
};

const dotStyles: Record<PullRequestStatusProps["state"], string> = {
  open: "bg-emerald-500 dark:bg-emerald-400",
  closed: "bg-zinc-500 dark:bg-zinc-400",
};

export function PullRequestStatus({ state }: PullRequestStatusProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ${stateStyles[state]}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dotStyles[state]}`} aria-hidden />
      {state === "open" ? "Aberto" : "Fechado"}
    </span>
  );
}
