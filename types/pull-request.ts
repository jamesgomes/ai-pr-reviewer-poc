export type PullRequestListItem = {
  id: number;
  number: number;
  title: string;
  state: "open" | "closed";
  commentCount: number;
  repositoryName: string;
  repositoryOwner: string;
  authorLogin: string;
  authorAvatarUrl: string | null;
  updatedAt: string;
  url: string;
};

export type PullRequestDetail = PullRequestListItem & {
  body: string | null;
};

export type PullRequestListResponse = {
  pullRequests: PullRequestListItem[];
};

export type PullRequestDetailResponse = {
  pullRequest: PullRequestDetail;
};

export type ApiErrorResponse = {
  error: string;
};
