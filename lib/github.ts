import { Octokit } from "octokit";

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
