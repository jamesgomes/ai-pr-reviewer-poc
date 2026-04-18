"use client";

import { useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";

type GitHubLoginButtonProps = {
  callbackUrl: string;
  className?: string;
};

export function GitHubLoginButton({
  callbackUrl,
  className,
}: GitHubLoginButtonProps) {
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!isSigningIn) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setIsSigningIn(false);
      setErrorMessage("Não foi possível redirecionar para o GitHub. Tente novamente.");
    }, 10000);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [isSigningIn]);

  async function handleSignIn() {
    if (isSigningIn) {
      return;
    }

    setIsSigningIn(true);
    setErrorMessage(null);

    try {
      await signIn("github", { callbackUrl });
    } catch {
      setIsSigningIn(false);
      setErrorMessage("Não foi possível iniciar o login com GitHub. Tente novamente.");
    }
  }

  return (
    <div className="inline-flex flex-col items-center gap-2">
      <Button
        variant="apple"
        className={`gap-2 ${className ?? ""}`}
        onClick={() => {
          void handleSignIn();
        }}
        disabled={isSigningIn}
        aria-busy={isSigningIn}
      >
        {isSigningIn && (
          <svg viewBox="0 0 24 24" aria-hidden className="h-4 w-4 animate-spin">
            <circle
              cx="12"
              cy="12"
              r="9"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              opacity="0.25"
            />
            <path
              d="M12 3a9 9 0 0 1 9 9"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeWidth="2"
            />
          </svg>
        )}
        {isSigningIn ? "Entrando..." : "Entrar com GitHub"}
      </Button>

      {isSigningIn && (
        <p className="text-xs text-zinc-600 dark:text-zinc-300">
          Redirecionando para autenticação no GitHub...
        </p>
      )}

      {errorMessage && (
        <p className="text-xs text-red-700 dark:text-red-300">{errorMessage}</p>
      )}
    </div>
  );
}
