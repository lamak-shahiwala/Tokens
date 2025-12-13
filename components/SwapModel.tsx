"use client";

import { useEffect, useRef } from "react";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { executeSwap } from "@/app/lib/uniswap/executeSwap";
import { Web3Provider } from "@ethersproject/providers";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function SwapModal({ open, onClose }: Props) {
  const { authenticated, login } = usePrivy();
  const { wallets } = useWallets();
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }

    return () => document.body.classList.remove("modal-open");
  }, [open]);

  const handleSwap = async () => {
    if (!authenticated || wallets.length === 0) return;

    const eip1193Provider = await wallets[0].getEthereumProvider();
    const provider = new Web3Provider(eip1193Provider);
    const signer = provider.getSigner();

    await executeSwap(signer, "0.01");
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50">
      <div
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        className="w-[420px] rounded-2xl bg-bg p-5 animate-[modalIn_0.2s_ease-out]"
      >
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Swap</h2>
          <button onClick={onClose}>✕</button>
        </div>

        <div className="mt-4 rounded-xl bg-gray-100 p-4">
          <p className="text-sm text-gray-500">Sell</p>
          <input className="w-full bg-transparent text-2xl outline-none" />
        </div>

        <div className="mt-3 rounded-xl bg-gray-100 p-4">
          <p className="text-sm text-gray-500">Buy</p>
          <input
            disabled
            className="w-full bg-transparent text-2xl outline-none"
          />
        </div>

        {!authenticated ? (
          <button
            onClick={login}
            className="mt-4 w-full rounded-xl bg-primary py-3 text-bg"
          >
            Connect Wallet
          </button>
        ) : (
          <button
            onClick={handleSwap}
            className="mt-4 w-full rounded-xl bg-primary py-3 text-white"
          >
            Swap
          </button>
        )}
      </div>
    </div>
  );
}
