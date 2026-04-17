import { Octokit } from "octokit";
import type { AuthenticatedGitHubUser } from "@/types/github-user";

function readRequiredEnv(name: "GITHUB_TOKEN" | "GITHUB_USERNAME"): string {
  const value = process.env[name];

  if (!value || value.trim().length === 0) {
    throw new Error(`${name} nao foi definido no .env.local`);
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
