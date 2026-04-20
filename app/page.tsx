import { redirect } from "next/navigation";
import { HomePullRequestsDashboard } from "@/components/home-pull-requests-dashboard";
import { WelcomeModalGate } from "@/components/welcome-modal-gate";
import { getAuthenticatedAppUser } from "@/lib/auth";

export default async function HomePage() {
  const authenticatedUser = await getAuthenticatedAppUser();

  if (!authenticatedUser) {
    redirect("/login");
  }

  return (
    <>
      <WelcomeModalGate
        user={{
          githubUserId: authenticatedUser.githubUserId,
          githubLogin: authenticatedUser.githubLogin,
        }}
      />
      <HomePullRequestsDashboard />
    </>
  );
}
