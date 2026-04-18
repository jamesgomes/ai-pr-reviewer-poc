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
    <main className="relative isolate flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-b from-zinc-100 via-zinc-50 to-white px-4 py-10 dark:from-[#0a0b10] dark:via-[#0a0b10] dark:to-black sm:px-6">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.16),transparent_42%),radial-gradient(circle_at_bottom,rgba(8,145,178,0.14),transparent_38%)] dark:bg-[radial-gradient(circle_at_top,rgba(29,78,216,0.18),transparent_42%),radial-gradient(circle_at_bottom,rgba(14,116,144,0.12),transparent_38%)]"
      >
        <div className="absolute left-1/2 top-[-120px] h-[360px] w-[360px] -translate-x-1/2 rounded-full bg-blue-500/10 blur-3xl dark:bg-blue-500/15" />
        <div className="absolute bottom-[-120px] right-[14%] h-[280px] w-[280px] rounded-full bg-cyan-500/10 blur-3xl dark:bg-cyan-500/12" />
      </div>

      <section className="w-full max-w-3xl text-center">
        <div className="mx-auto inline-flex shadow-2xl shadow-blue-500/10 dark:shadow-cyan-500/10">
          <Image
            src="/logo-loginj.png"
            alt="Logo do AI Reviewer"
            width={340}
            height={340}
            priority
            className="h-auto w-[min(82vw,340px)] rounded-[26px] border border-zinc-200/80 object-cover dark:border-white/10"
          />
        </div>

        <h1 className="mt-8 text-6xl font-semibold tracking-tight text-zinc-900 sm:text-7xl dark:text-white">
          AI Reviewer
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-zinc-600 sm:text-base dark:text-zinc-300">
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
