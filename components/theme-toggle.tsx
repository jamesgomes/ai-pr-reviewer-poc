"use client";

import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";

const subscribe = () => {
  return () => {};
};

function useIsMounted(): boolean {
  return useSyncExternalStore(subscribe, () => true, () => false);
}

export function ThemeToggle() {
  const isMounted = useIsMounted();
  const { forcedTheme, resolvedTheme, setTheme } = useTheme();

  if (!isMounted || !resolvedTheme) {
    return (
      <button
        type="button"
        aria-hidden
        disabled
        className="inline-flex h-9 w-[92px] items-center rounded-md border border-zinc-300 bg-white px-3 text-sm font-medium text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400"
      >
        Theme
      </button>
    );
  }

  const isDarkTheme = resolvedTheme === "dark";
  const nextTheme = isDarkTheme ? "light" : "dark";
  const isDisabled = Boolean(forcedTheme);

  return (
    <button
      type="button"
      onClick={() => setTheme(nextTheme)}
      disabled={isDisabled}
      className="inline-flex h-9 items-center rounded-md border border-zinc-300 bg-white px-3 text-sm font-medium text-zinc-800 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
      aria-label={`Alternar para tema ${nextTheme === "dark" ? "escuro" : "claro"}`}
    >
      {isDisabled
        ? "Theme bloqueado"
        : nextTheme === "dark"
          ? "Mudar para Dark"
          : "Mudar para Light"}
    </button>
  );
}
