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
        className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-zinc-300 bg-white text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400"
      >
        <span className="h-3.5 w-3.5 rounded-full bg-zinc-400 dark:bg-zinc-500" />
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
      className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
      aria-label={`Alternar para tema ${nextTheme === "dark" ? "escuro" : "claro"}`}
      title={`Mudar para ${nextTheme === "dark" ? "dark" : "light"}`}
    >
      {isDisabled ? (
        <svg viewBox="0 0 16 16" aria-hidden className="h-4 w-4" fill="currentColor">
          <path d="M4.5 7V5.75a3.5 3.5 0 1 1 7 0V7h.25A1.25 1.25 0 0 1 13 8.25v5.5A1.25 1.25 0 0 1 11.75 15h-7.5A1.25 1.25 0 0 1 3 13.75v-5.5A1.25 1.25 0 0 1 4.25 7H4.5Zm1.5 0h4V5.75a2 2 0 0 0-4 0V7Z" />
        </svg>
      ) : isDarkTheme ? (
        <svg viewBox="0 0 16 16" aria-hidden className="h-4 w-4" fill="currentColor">
          <path d="M9.598 1.591a.75.75 0 0 0-.898.94 5.25 5.25 0 0 1-6.17 6.169.75.75 0 0 0-.94.898 6.75 6.75 0 1 0 8.008-8.007Z" />
        </svg>
      ) : (
        <svg viewBox="0 0 16 16" aria-hidden className="h-4 w-4" fill="currentColor">
          <path d="M8 1a.75.75 0 0 1 .75.75v1a.75.75 0 0 1-1.5 0v-1A.75.75 0 0 1 8 1Zm0 10.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm0 1.5a5 5 0 1 1 0-10 5 5 0 0 1 0 10Zm5-5a.75.75 0 0 1 .75-.75h1a.75.75 0 0 1 0 1.5h-1A.75.75 0 0 1 13 8Zm-10.5 0a.75.75 0 0 1 .75-.75h1a.75.75 0 0 1 0 1.5h-1A.75.75 0 0 1 2.5 8Zm8.364-4.614a.75.75 0 0 1 1.06 0l.708.707a.75.75 0 0 1-1.06 1.06l-.708-.707a.75.75 0 0 1 0-1.06Zm-7.778 7.778a.75.75 0 0 1 1.06 0l.708.707a.75.75 0 1 1-1.06 1.06l-.708-.707a.75.75 0 0 1 0-1.06Zm8.485 1.767a.75.75 0 0 1 0-1.06l.707-.708a.75.75 0 1 1 1.06 1.06l-.707.708a.75.75 0 0 1-1.06 0Zm-7.778-7.778a.75.75 0 0 1 0-1.06l.707-.707a.75.75 0 1 1 1.06 1.06l-.707.708a.75.75 0 0 1-1.06 0Z" />
        </svg>
      )}
      <span className="sr-only">
        {isDisabled
          ? "Theme bloqueado"
          : nextTheme === "dark"
            ? "Mudar para Dark"
            : "Mudar para Light"}
      </span>
    </button>
  );
}
