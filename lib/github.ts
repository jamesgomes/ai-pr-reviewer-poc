import { Octokit } from "octokit";
import type { AuthenticatedGitHubUser } from "@/types/github-user";
import type { PullRequestPublishFileContext } from "@/lib/github-inline-review";

type AuthenticatedGitHubRequestInput = {
  accessToken: string;
};

function createGitHubClient(accessToken: string): Octokit {
  return new Octokit({
    auth: accessToken,
  });
}

export async function getAuthenticatedGitHubUser({
  accessToken,
}: AuthenticatedGitHubRequestInput): Promise<AuthenticatedGitHubUser> {
  const octokit = createGitHubClient(accessToken);
  const response = await octokit.request("GET /user");

  return {
    id: String(response.data.id),
    login: response.data.login,
    name: response.data.name,
    avatarUrl: response.data.avatar_url,
    profileUrl: response.data.html_url,
  };
}

type PullRequestCoordinatesInput = {
  owner: string;
  repo: string;
  pullNumber: number;
  accessToken: string;
};

type CreatePullRequestCommentInput = PullRequestCoordinatesInput & {
  body: string;
};

export async function createPullRequestComment({
  owner,
  repo,
  pullNumber,
  body,
  accessToken,
}: CreatePullRequestCommentInput): Promise<{ id: number; url: string }> {
  const octokit = createGitHubClient(accessToken);
  const response = await octokit.request("POST /repos/{owner}/{repo}/issues/{issue_number}/comments", {
    owner,
    repo,
    issue_number: pullNumber,
    body,
  });

  return {
    id: response.data.id,
    url: response.data.html_url,
  };
}

type CreatePullRequestInlineCommentInput = PullRequestCoordinatesInput & {
  body: string;
  commitId: string;
  path: string;
  line: number;
  side: "RIGHT";
};

export async function getPullRequestHeadSha({
  owner,
  repo,
  pullNumber,
  accessToken,
}: PullRequestCoordinatesInput): Promise<string> {
  const octokit = createGitHubClient(accessToken);
  const response = await octokit.request("GET /repos/{owner}/{repo}/pulls/{pull_number}", {
    owner,
    repo,
    pull_number: pullNumber,
  });

  return response.data.head.sha;
}

export async function listPullRequestFiles({
  owner,
  repo,
  pullNumber,
  accessToken,
}: PullRequestCoordinatesInput): Promise<PullRequestPublishFileContext[]> {
  const octokit = createGitHubClient(accessToken);
  const response = await octokit.paginate("GET /repos/{owner}/{repo}/pulls/{pull_number}/files", {
    owner,
    repo,
    pull_number: pullNumber,
    per_page: 100,
  });

  return response.map((file) => ({
    filePath: file.filename,
    patch: file.patch ?? null,
  }));
}

export async function createPullRequestInlineComment({
  owner,
  repo,
  pullNumber,
  body,
  commitId,
  path,
  line,
  side,
  accessToken,
}: CreatePullRequestInlineCommentInput): Promise<{ id: number; url: string }> {
  const octokit = createGitHubClient(accessToken);
  const response = await octokit.request("POST /repos/{owner}/{repo}/pulls/{pull_number}/comments", {
    owner,
    repo,
    pull_number: pullNumber,
    body,
    commit_id: commitId,
    path,
    line,
    side,
  });

  return {
    id: response.data.id,
    url: response.data.html_url,
  };
}
