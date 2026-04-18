import type { NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth";
import GitHubProvider from "next-auth/providers/github";

function readGitHubClientId(): string {
  return (
    process.env.GITHUB_CLIENT_ID?.trim() ||
    process.env.AUTH_GITHUB_ID?.trim() ||
    process.env.GITHUB_ID?.trim() ||
    "missing-github-client-id"
  );
}

function readGitHubClientSecret(): string {
  return (
    process.env.GITHUB_CLIENT_SECRET?.trim() ||
    process.env.AUTH_GITHUB_SECRET?.trim() ||
    process.env.GITHUB_SECRET?.trim() ||
    "missing-github-client-secret"
  );
}

type GitHubProfile = {
  id?: number;
  login?: string;
  html_url?: string;
  avatar_url?: string;
};

function readAuthSecret(): string {
  return (
    process.env.NEXTAUTH_SECRET?.trim() ||
    process.env.AUTH_SECRET?.trim() ||
    "dev-nextauth-secret-change-me"
  );
}

export const authOptions: NextAuthOptions = {
  secret: readAuthSecret(),
  providers: [
    GitHubProvider({
      clientId: readGitHubClientId(),
      clientSecret: readGitHubClientSecret(),
      authorization: {
        params: {
          scope: "read:user repo",
        },
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account?.access_token) {
        token.accessToken = account.access_token;
      }

      if (profile) {
        const githubProfile = profile as GitHubProfile;

        if (typeof githubProfile.login === "string") {
          token.login = githubProfile.login;
        }

        if (typeof githubProfile.id === "number") {
          token.githubUserId = String(githubProfile.id);
        }

        if (typeof githubProfile.html_url === "string") {
          token.profileUrl = githubProfile.html_url;
        }

        if (typeof githubProfile.avatar_url === "string") {
          token.avatarUrl = githubProfile.avatar_url;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = typeof token.githubUserId === "string" ? token.githubUserId : null;
        session.user.login = typeof token.login === "string" ? token.login : null;
        session.user.profileUrl =
          typeof token.profileUrl === "string" ? token.profileUrl : null;
        session.user.avatarUrl =
          typeof token.avatarUrl === "string"
            ? token.avatarUrl
            : session.user.image ?? null;
      }

      session.accessToken = typeof token.accessToken === "string" ? token.accessToken : null;

      return session;
    },
  },
};

export function getServerAuthSession() {
  return getServerSession(authOptions);
}
