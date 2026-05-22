"use client";

import dynamic from "next/dynamic";

type PullRequestAnalysisSectionClientProps = {
  githubUserKey: string;
  authenticatedGithubLogin: string;
  owner: string;
  repo: string;
  pullNumber: number;
  pullRequestState: "open" | "closed";
  pullRequestAuthorLogin: string;
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
