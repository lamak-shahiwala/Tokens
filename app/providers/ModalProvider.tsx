"use client";

import { SwapModal } from "@/components/SwapModel";
import React, { createContext, useContext, useState } from "react";

// Define the data we need to pass to the modal
type TokenInfo = {
  address: string;
  symbol: string;
};

type ModalContextType = {
  openSwap: (token: TokenInfo) => void;
  closeSwap: () => void;
};

const ModalContext = createContext<ModalContextType | null>(null);

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [swapOpen, setSwapOpen] = useState(false);
  const [activeToken, setActiveToken] = useState<TokenInfo | null>(null);

  const openSwap = (token: TokenInfo) => {
    setActiveToken(token);
    setSwapOpen(true);
  };

  const closeSwap = () => {
    setSwapOpen(false);
    // We don't clear activeToken immediately to prevent content flashing while closing
    setTimeout(() => setActiveToken(null), 300);
  };

  return (
    <ModalContext.Provider value={{ openSwap, closeSwap }}>
      {children}

      {/* Render Modal only if we have token data (or handle nulls inside Modal) */}
      <SwapModal
        open={swapOpen}
        onClose={closeSwap}
        tokenAddress={activeToken?.address}
        tokenSymbol={activeToken?.symbol}
      />
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
