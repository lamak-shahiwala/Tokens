"use client";

import React, { createContext, useContext, useState } from "react";
import { SwapModal } from "@/components/SwapModel";

type ModalContextType = {
  openSwap: () => void;
  closeSwap: () => void;
};

const ModalContext = createContext<ModalContextType | null>(null);

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [swapOpen, setSwapOpen] = useState(false);

  return (
    <ModalContext.Provider
      value={{
        openSwap: () => setSwapOpen(true),
        closeSwap: () => setSwapOpen(false),
      }}
    >
      {children}

      <SwapModal open={swapOpen} onClose={() => setSwapOpen(false)} />
    </ModalContext.Provider>
  );
}

export function useModal() {
  const ctx = useContext(ModalContext);
  if (!ctx) {
    throw new Error("useModal must be used inside ModalProvider");
  }
  return ctx;
}
