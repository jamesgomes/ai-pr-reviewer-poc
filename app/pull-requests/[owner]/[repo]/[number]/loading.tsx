import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function LoadingPullRequestDetailsPage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6">
      <div className="rounded-[11px] border border-[var(--app-divider)] bg-[var(--app-canvas-parchment)] p-4">
        <LoadingSpinner label="Carregando detalhes do Pull Request..." size="lg" />
      </div>
    </main>
  );
}
