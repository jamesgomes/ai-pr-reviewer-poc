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

export type AuthenticatedPullRequestUser = {
  githubUserId: string | null;
  githubLogin: string;
  name: string | null;
  avatarUrl: string | null;
  profileUrl: string | null;
  storageKey: string;
};

export type PullRequestListResponse = {
  pullRequests: PullRequestListItem[];
  authenticatedUser: AuthenticatedPullRequestUser;
};

export type PullRequestDetailResponse = {
  pullRequest: PullRequestDetail;
};

export type ApiErrorResponse = {
  error: string;
};
