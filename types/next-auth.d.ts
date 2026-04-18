import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken: string | null;
    user: DefaultSession["user"] & {
      id: string | null;
      login: string | null;
      profileUrl: string | null;
      avatarUrl: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    githubUserId?: string;
    login?: string;
    profileUrl?: string;
    avatarUrl?: string;
  }
}
