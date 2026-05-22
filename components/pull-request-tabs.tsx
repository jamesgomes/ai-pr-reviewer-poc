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
        className="inline-flex overflow-hidden rounded-full border border-[var(--app-divider)] bg-[var(--app-canvas-parchment)]"
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
              className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--app-primary-focus)] ${
                !isLast ? "border-r border-[var(--app-divider)]" : ""
              } ${
                isActive
                  ? "bg-[var(--app-canvas)] text-[var(--app-ink)]"
                  : "text-[var(--app-body-muted-strong)] hover:bg-[var(--app-divider-soft)] hover:text-[var(--app-ink)]"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`inline-flex min-w-5 items-center justify-center rounded-full px-1.5 py-0.5 text-xs font-semibold ${
                  isActive
                    ? "bg-[var(--app-divider-soft)] text-[var(--app-body-muted-strong)]"
                    : "bg-[var(--app-divider)] text-[var(--app-body-muted)]"
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
