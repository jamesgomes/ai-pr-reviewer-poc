"use client";

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
  return (
    <Button
      variant="apple"
      className={className}
      onClick={() => {
        void signIn("github", { callbackUrl });
      }}
    >
      Entrar com GitHub
    </Button>
  );
}
