import type { PullRequestDetail, PullRequestListItem } from "@/types/pull-request";
import type { PullRequestAnalysisContext } from "@/types/pr-analysis";
import { getAuthenticatedGitHubUser } from "@/lib/github";
import { Octokit } from "octokit";

type RepositoryRef = {
  owner: string;
  name: string;
};

function parseRepositoryRef(repositoryApiUrl: string): RepositoryRef {
  const pathParts = new URL(repositoryApiUrl).pathname
    .split("/")
    .filter(Boolean);

  if (pathParts.length < 3 || pathParts[0] !== "repos") {
    throw new Error("Formato inválido de URL de repositório retornada pelo GitHub.");
  }

  return {
    owner: pathParts[1],
    name: pathParts[2],
  };
}

function toPullRequestState(state: string): "open" | "closed" {
  return state === "open" ? "open" : "closed";
}

function createGitHubClient(accessToken: string): Octokit {
  return new Octokit({
    auth: accessToken,
  });
}

export async function listRequestedPullRequests(
  accessToken: string,
  githubLogin: string
): Promise<PullRequestListItem[]> {
  const octokit = createGitHubClient(accessToken);

  const [reviewRequestedResponse, authoredResponse] = await Promise.all([
    octokit.request("GET /search/issues", {
      q: `is:open is:pr archived:false review-requested:${githubLogin}`,
      sort: "updated",
      order: "desc",
      per_page: 50,
    }),
    octokit.request("GET /search/issues", {
      q: `is:open is:pr archived:false author:${githubLogin}`,
      sort: "updated",
      order: "desc",
      per_page: 50,
    }),
  ]);

  const mergedItemsById = new Map(
    [...reviewRequestedResponse.data.items, ...authoredResponse.data.items].map((item) => [
      item.id,
      item,
    ])
  );

  const pullRequestItems = Array.from(mergedItemsById.values())
    .filter((item) => item.pull_request !== null)
    .sort(
      (firstItem, secondItem) =>
        new Date(secondItem.updated_at).getTime() - new Date(firstItem.updated_at).getTime()
    );

  const commentCountByIssueId = new Map<number, number>();

  await Promise.all(
    pullRequestItems.map(async (item) => {
      try {
        const repositoryRef = parseRepositoryRef(item.repository_url);
        const pullRequestResponse = await octokit.request(
          "GET /repos/{owner}/{repo}/pulls/{pull_number}",
          {
            owner: repositoryRef.owner,
            repo: repositoryRef.name,
            pull_number: item.number,
          }
        );

        const totalComments =
          pullRequestResponse.data.comments + pullRequestResponse.data.review_comments;
        commentCountByIssueId.set(item.id, totalComments);
      } catch {
        commentCountByIssueId.set(item.id, item.comments);
      }
    })
  );

  return pullRequestItems.map((item) => {
    const repositoryRef = parseRepositoryRef(item.repository_url);

    return {
      id: item.id,
      number: item.number,
      title: item.title,
      state: toPullRequestState(item.state),
      commentCount: commentCountByIssueId.get(item.id) ?? item.comments,
      repositoryName: repositoryRef.name,
      repositoryOwner: repositoryRef.owner,
      authorLogin: item.user?.login ?? "unknown",
      authorAvatarUrl: item.user?.avatar_url ?? null,
      updatedAt: item.updated_at,
      url: item.html_url,
    };
  });
}

export async function getPullRequestDetails(
  owner: string,
  repo: string,
  pullNumber: number,
  accessToken: string
): Promise<PullRequestDetail> {
  const octokit = createGitHubClient(accessToken);
  const response = await octokit.request("GET /repos/{owner}/{repo}/pulls/{pull_number}", {
    owner,
    repo,
    pull_number: pullNumber,
  });

  return {
    id: response.data.id,
    number: response.data.number,
    title: response.data.title,
    state: toPullRequestState(response.data.state),
    commentCount: response.data.comments + response.data.review_comments,
    repositoryName: response.data.base.repo.name,
    repositoryOwner: response.data.base.repo.owner.login,
    authorLogin: response.data.user?.login ?? "unknown",
    authorAvatarUrl: response.data.user?.avatar_url ?? null,
    updatedAt: response.data.updated_at,
    url: response.data.html_url,
    body: response.data.body,
  };
}

export async function getPullRequestAnalysisContext(
  owner: string,
  repo: string,
  pullNumber: number,
  accessToken: string
): Promise<PullRequestAnalysisContext> {
  const octokit = createGitHubClient(accessToken);

  const [pullResponse, filesResponse] = await Promise.all([
    octokit.request("GET /repos/{owner}/{repo}/pulls/{pull_number}", {
      owner,
      repo,
      pull_number: pullNumber,
    }),
    octokit.request("GET /repos/{owner}/{repo}/pulls/{pull_number}/files", {
      owner,
      repo,
      pull_number: pullNumber,
      per_page: 100,
    }),
  ]);

  return {
    repositoryOwner: pullResponse.data.base.repo.owner.login,
    repositoryName: pullResponse.data.base.repo.name,
    pullRequestNumber: pullResponse.data.number,
    pullRequestTitle: pullResponse.data.title,
    pullRequestBody: pullResponse.data.body,
    pullRequestAuthor: pullResponse.data.user?.login ?? "unknown",
    pullRequestUrl: pullResponse.data.html_url,
    files: filesResponse.data.map((file) => ({
      filePath: file.filename,
      status: file.status,
      additions: file.additions,
      deletions: file.deletions,
      patch: file.patch ?? null,
    })),
  };
}

export async function loadAuthenticatedGitHubUser(
  accessToken: string
) {
  return getAuthenticatedGitHubUser({ accessToken });
}
