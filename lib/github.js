import { Octokit } from "octokit";

export function getGitHubClient(): Octokit {
  const token = process.env.GITHUB_TOKEN;

  if (!token) {
    throw new Error("GITHUB_TOKEN nao foi definido no .env.local");
  }

  return new Octokit({
    auth: token,
  });
}
