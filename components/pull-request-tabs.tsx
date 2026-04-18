export type PullRequestTab = "pending" | "mine" | "reviewed";

type PullRequestTabsProps = {
  activeTab: PullRequestTab;
  pendingCount: number;
  mineCount: number;
  reviewedCount: number;
  onChangeTab: (tab: PullRequestTab) => void;
};

const tabOptions: Array<{
  value: PullRequestTab;
  label: string;
}> = [
  { value: "mine", label: "Meus PRs" },
  { value: "pending", label: "Pendentes" },
  { value: "reviewed", label: "Revisados" },
];

export function PullRequestTabs({
  activeTab,
  pendingCount,
  mineCount,
  reviewedCount,
  onChangeTab,
}: PullRequestTabsProps) {
  const countByTab: Record<PullRequestTab, number> = {
    pending: pendingCount,
    mine: mineCount,
    reviewed: reviewedCount,
  };

  return (
    <div className="mb-3">
      <div
        role="tablist"
        aria-label="Filtro de Pull Requests"
        className="inline-flex overflow-hidden rounded-md border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900"
      >
        {tabOptions.map((tab) => {
          const isActive = tab.value === activeTab;
          const isLast = tab.value === tabOptions[tabOptions.length - 1].value;

          return (
            <button
              key={tab.value}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => {
                onChangeTab(tab.value);
              }}
              className={`inline-flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-blue-500 ${
                !isLast ? "border-r border-zinc-200 dark:border-zinc-800" : ""
              } ${
                isActive
                  ? "bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100"
                  : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`inline-flex min-w-5 items-center justify-center rounded-full px-1.5 py-0.5 text-xs font-semibold ${
                  isActive
                    ? "bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
                    : "bg-zinc-200/80 text-zinc-600 dark:bg-zinc-800/80 dark:text-zinc-300"
                }`}
              >
                {countByTab[tab.value]}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
