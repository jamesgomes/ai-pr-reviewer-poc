"use client";

import dynamic from "next/dynamic";

type PullRequestAnalysisSectionClientProps = {
  githubUserKey: string;
  owner: string;
  repo: string;
  pullNumber: number;
};

const PullRequestAnalysisSection = dynamic(
  () =>
    import("@/components/pr-analysis-section").then((module) => module.PullRequestAnalysisSection),
  {
    ssr: false,
  }
);

export function PullRequestAnalysisSectionClient(
  props: PullRequestAnalysisSectionClientProps
) {
  return <PullRequestAnalysisSection {...props} />;
}
