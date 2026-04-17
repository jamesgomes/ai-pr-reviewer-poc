import { getGitHubClient, getGitHubUsername } from "@/lib/github";
import type { PullRequestDetail, PullRequestListItem } from "@/types/pull-request";

type RepositoryRef = {
  owner: string;
  name: string;
};

function parseRepositoryRef(repositoryApiUrl: string): RepositoryRef {
  const pathParts = new URL(repositoryApiUrl).pathname
    .split("/")
    .filter(Boolean);

  if (pathParts.length < 3 || pathParts[0] !== "repos") {
    throw new Error("Formato de URL de repositorio invalido vindo do GitHub");
  }

  return {
    owner: pathParts[1],
    name: pathParts[2],
  };
}

function toPullRequestState(state: string): "open" | "closed" {
  return state === "open" ? "open" : "closed";
}

export async function listRequestedPullRequests(): Promise<PullRequestListItem[]> {
  const octokit = getGitHubClient();
  const githubUsername = getGitHubUsername();

  const response = await octokit.request("GET /search/issues", {
    q: `is:open is:pr archived:false review-requested:${githubUsername}`,
    sort: "updated",
    order: "desc",
    per_page: 50,
  });

  return response.data.items
    .filter((item) => item.pull_request !== null)
    .map((item) => {
      const repositoryRef = parseRepositoryRef(item.repository_url);

      return {
        id: item.id,
        number: item.number,
        title: item.title,
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
  pullNumber: number
): Promise<PullRequestDetail> {
  const octokit = getGitHubClient();
  const response = await octokit.request("GET /repos/{owner}/{repo}/pulls/{pull_number}", {
    owner,
    repo,
    pull_number: pullNumber,
  });

  return {
    id: response.data.id,
    number: response.data.number,
    title: response.data.title,
    repositoryName: response.data.base.repo.name,
    repositoryOwner: response.data.base.repo.owner.login,
    authorLogin: response.data.user?.login ?? "unknown",
    authorAvatarUrl: response.data.user?.avatar_url ?? null,
    updatedAt: response.data.updated_at,
    url: response.data.html_url,
    body: response.data.body,
    state: toPullRequestState(response.data.state),
  };
}
