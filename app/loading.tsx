import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function LoadingHomePage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6">
      <div className="rounded-md border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
        <LoadingSpinner label="Carregando dashboard..." size="lg" />
      </div>
    </main>
  );
}
