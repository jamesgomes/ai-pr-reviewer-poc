export type AuthenticatedGitHubUser = {
  id: number;
  login: string;
  name: string | null;
  avatarUrl: string;
  profileUrl: string;
};
