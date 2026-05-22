import { redirect } from "next/navigation";
import Image from "next/image";
import { GitHubLoginButton } from "@/components/github-login-button";
import { getServerAuthSession } from "@/auth";

type LoginPageProps = {
  searchParams?: Promise<{
    callbackUrl?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const session = await getServerAuthSession();

  if (session) {
    redirect("/");
  }

  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const callbackUrl = resolvedSearchParams?.callbackUrl?.trim() || "/";

  return (
    <main className="flex flex-1 items-center justify-center bg-[var(--app-canvas-parchment)] px-4 py-12 sm:px-6">
      <section className="w-full max-w-3xl rounded-[18px] border border-[var(--app-divider)] bg-[var(--app-canvas)] px-6 py-10 text-center sm:px-10">
        <div className="mx-auto inline-flex">
          <Image
            src="/logo-loginj.png"
            alt="Logo do AI Reviewer"
            width={340}
            height={340}
            priority
            className="h-auto w-[min(82vw,340px)] rounded-[18px] border border-[var(--app-divider)] object-cover"
          />
        </div>

        <h1 className="mt-8 text-5xl font-semibold tracking-tight text-[var(--app-ink)] sm:text-6xl">
          AI Reviewer
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-[var(--app-body-muted)] sm:text-base">
          Entre com sua conta do GitHub para analisar Pull Requests e publicar comentários.
        </p>

        <div className="mt-8">
          <GitHubLoginButton
            callbackUrl={callbackUrl}
            className="mx-auto justify-center px-8 py-3"
          />
        </div>
      </section>
    </main>
  );
}
