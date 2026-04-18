export type AuthenticatedGitHubUser = {
  id: string;
  login: string;
  name: string | null;
  avatarUrl: string | null;
  profileUrl: string | null;
};
