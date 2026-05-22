"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export function LogoutButton() {
  return (
    <Button
      variant="ghost"
      className="h-8 border-white/30 px-3 text-xs text-white hover:bg-white/15"
      onClick={() => {
        void signOut({ callbackUrl: "/login" });
      }}
    >
      Sair
    </Button>
  );
}
