"use client";

import { useEffect, useState } from "react";
import { WelcomeModal } from "@/components/welcome-modal";
import {
  hasSeenWelcomeModal,
  markWelcomeModalAsSeen,
  type WelcomeModalStorageUser,
} from "@/lib/storage/welcome-modal-storage";

type WelcomeModalGateProps = {
  user: WelcomeModalStorageUser;
};

export function WelcomeModalGate({ user }: WelcomeModalGateProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const initializeId = window.setTimeout(() => {
      const shouldOpen = !hasSeenWelcomeModal(user);
      setIsOpen(shouldOpen);
    }, 0);

    return () => {
      window.clearTimeout(initializeId);
    };
  }, [user]);

  function dismissWelcomeModal() {
    markWelcomeModalAsSeen(user);
    setIsOpen(false);
  }

  return (
    <WelcomeModal
      isOpen={isOpen}
      onConfirm={dismissWelcomeModal}
      onClose={dismissWelcomeModal}
    />
  );
}
