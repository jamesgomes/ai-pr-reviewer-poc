"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

type WelcomeModalProps = {
  isOpen: boolean;
  onConfirm: () => void;
  onClose: () => void;
};

const MODAL_TRANSITION_MS = 200;
const MODAL_ENTER_DELAY_MS = 16;

export function WelcomeModal({ isOpen, onConfirm, onClose }: WelcomeModalProps) {
  const [isRendered, setIsRendered] = useState(isOpen);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const renderTimer = window.setTimeout(() => {
        setIsRendered(true);
      }, 0);
      const showTimer = window.setTimeout(() => {
        setIsVisible(true);
      }, MODAL_ENTER_DELAY_MS);

      return () => {
        window.clearTimeout(renderTimer);
        window.clearTimeout(showTimer);
      };
    }

    const hideTimer = window.setTimeout(() => {
      setIsVisible(false);
    }, 0);
    const unmountTimer = window.setTimeout(() => {
      setIsRendered(false);
    }, MODAL_TRANSITION_MS);

    return () => {
      window.clearTimeout(hideTimer);
      window.clearTimeout(unmountTimer);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isRendered || !isVisible) {
      return;
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isRendered, isVisible, onClose]);

  useEffect(() => {
    if (!isRendered) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isRendered]);

  if (!isRendered) {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center px-4 py-6 transition-[background-color,backdrop-filter,opacity] duration-200 ease-out motion-reduce:transition-none ${
        isVisible
          ? "bg-zinc-950/45 opacity-100 backdrop-blur-sm dark:bg-black/55"
          : "pointer-events-none bg-zinc-950/0 opacity-0 backdrop-blur-0 dark:bg-black/0"
      }`}
      role="presentation"
      onClick={isVisible ? onClose : undefined}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="welcome-modal-title"
        aria-describedby="welcome-modal-description"
        className={`w-full max-w-xl transform-gpu rounded-lg border border-zinc-200 bg-white p-5 shadow-2xl shadow-zinc-950/10 transition-all duration-200 ease-out will-change-[transform,opacity] motion-reduce:transform-none motion-reduce:transition-none dark:border-zinc-800 dark:bg-zinc-950 dark:shadow-black/40 sm:p-6 ${
          isVisible
            ? "translate-y-0 scale-100 opacity-100"
            : "translate-y-2 scale-[0.985] opacity-0"
        }`}
        onClick={(event) => {
          event.stopPropagation();
        }}
      >
        <h2
          id="welcome-modal-title"
          className="text-lg font-semibold tracking-tight text-zinc-950 dark:text-zinc-50"
        >
          Bem-vindo ao AI Reviewer
        </h2>
        <p
          id="welcome-modal-description"
          className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400"
        >
          Esta ferramenta ajuda você a revisar Pull Requests com apoio de IA e publicar no GitHub
          apenas os comentários que fizerem sentido para sua revisão.
        </p>

        <ol className="mt-4 space-y-2 text-sm text-zinc-700 dark:text-zinc-300">
          <li>1. Escolha um Pull Request</li>
          <li>2. Gere a análise com IA</li>
          <li>3. Revise e publique os comentários aprovados no GitHub</li>
        </ol>

        <div className="mt-5 flex flex-wrap items-center justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>
            Fechar
          </Button>
          <Button
            variant="primary"
            onClick={onConfirm}
            className="shadow-sm shadow-blue-900/15 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-md hover:shadow-blue-900/20 active:translate-y-0 active:scale-[0.98] motion-reduce:transform-none"
          >
            Começar
          </Button>
        </div>
      </section>
    </div>
  );
}
