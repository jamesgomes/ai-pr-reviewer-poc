import { Octokit } from "octokit";
import type { AuthenticatedGitHubUser } from "@/types/github-user";
import type { PullRequestPublishFileContext } from "@/lib/github-inline-review";

function readRequiredEnv(name: "GITHUB_TOKEN" | "GITHUB_USERNAME"): string {
  const value = process.env[name];

  if (!value || value.trim().length === 0) {
    throw new Error(`${name} nao esta definido no .env.local`);
  }

  return value;
}

export function getGitHubClient(): Octokit {
  const token = readRequiredEnv("GITHUB_TOKEN");

  return new Octokit({
    auth: token,
  });
}

export function getGitHubUsername(): string {
  return readRequiredEnv("GITHUB_USERNAME");
}

export async function getAuthenticatedGitHubUser(): Promise<AuthenticatedGitHubUser> {
  const octokit = getGitHubClient();
  const response = await octokit.request("GET /user");

  return {
    id: response.data.id,
    login: response.data.login,
    name: response.data.name,
    avatarUrl: response.data.avatar_url,
    profileUrl: response.data.html_url,
  };
}

type CreatePullRequestCommentInput = {
  owner: string;
  repo: string;
  pullNumber: number;
  body: string;
};

export async function createPullRequestComment({
  owner,
  repo,
  pullNumber,
  body,
}: CreatePullRequestCommentInput): Promise<{ id: number; url: string }> {
  const octokit = getGitHubClient();
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

type PullRequestCoordinatesInput = {
  owner: string;
  repo: string;
  pullNumber: number;
};

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
}: PullRequestCoordinatesInput): Promise<string> {
  const octokit = getGitHubClient();
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
}: PullRequestCoordinatesInput): Promise<PullRequestPublishFileContext[]> {
  const octokit = getGitHubClient();
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
}: CreatePullRequestInlineCommentInput): Promise<{ id: number; url: string }> {
  const octokit = getGitHubClient();
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
