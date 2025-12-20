"use client";

import { useEffect, useRef, useState } from "react";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { Web3Provider } from "@ethersproject/providers";
import { executeV4Swap } from "@/app/lib/uniswap/executeSwap";
import { WETH_TOKEN, USDC_TOKEN } from "@/app/lib/uniswap/constants";
import { FiArrowDown, FiChevronDown } from "react-icons/fi";
import { getQuote } from "@/app/lib/uniswap/getQuote";

interface Props {
  open: boolean;
  onClose: () => void;
  tokenAddress?: string; // Address of the specific token (Clanker token)
  tokenSymbol?: string; // Symbol (e.g., "CLANK")
}

type SwapSide = "ETH" | "TOKEN";

export function SwapModal({
  open,
  onClose,
  tokenAddress,
  tokenSymbol = "TOKEN",
}: Props) {
  const { authenticated, login } = usePrivy();
  const { wallets } = useWallets();
  const modalRef = useRef<HTMLDivElement>(null);

  // Default: Buying the Token with ETH
  const [sellSide, setSellSide] = useState<SwapSide>("ETH");
  const [buySide, setBuySide] = useState<SwapSide>("TOKEN");

  const [sellAmount, setSellAmount] = useState("");
  const [buyAmount, setBuyAmount] = useState(""); // Quote result

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [quoting, setQuoting] = useState(false);

  // Toggle modal class on body
  useEffect(() => {
    document.body.classList.toggle("modal-open", open);
    return () => document.body.classList.remove("modal-open");
  }, [open]);

  // Flip the direction (Buy <-> Sell)
  const switchTokens = () => {
    setSellSide((prev) => (prev === "ETH" ? "TOKEN" : "ETH"));
    setBuySide((prev) => (prev === "ETH" ? "TOKEN" : "ETH"));
    setSellAmount("");
    setBuyAmount("");
  };

  // --------------------------------------------------------------------------
  // Execute Swap
  // --------------------------------------------------------------------------
  const handleSwap = async () => {
    if (!authenticated || wallets.length === 0 || !tokenAddress) return;

    setError(null);
    setLoading(true);

    try {
      const eip1193Provider = await wallets[0].getEthereumProvider();
      const provider = new Web3Provider(eip1193Provider);
      const signer = provider.getSigner();

      // Determine Addresses
      // If selling ETH, we use WETH address for the V4 Path (logic handled in executeV4Swap)
      // If selling TOKEN, we use the tokenAddress passed via props
      const sellAddr = sellSide === "ETH" ? WETH_TOKEN.address : tokenAddress;
      const buyAddr = buySide === "ETH" ? WETH_TOKEN.address : tokenAddress;

      // Determine Decimals
      // ETH/WETH = 18. Custom tokens are usually 18, but ideally should be passed in props.
      // We assume 18 for now.
      const sellDecimals = 18;

      const result = await executeV4Swap({
        signer,
        sellTokenAddress: sellAddr,
        buyTokenAddress: buyAddr,
        amountIn: sellAmount,
        sellTokenDecimals: sellDecimals,
        isEthIn: sellSide === "ETH",
      });

      if (!result.ok) {
        setError(result.reason);
        return;
      }

      // Success
      alert("Swap Submitted! Tx Hash: " + result.txHash);
      onClose();
    } catch (err: any) {
      setError(err?.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------------------------------
  // Quoting (Optional - simplified for now)
  // --------------------------------------------------------------------------
  useEffect(() => {
    if (
      !wallets.length ||
      !sellAmount ||
      parseFloat(sellAmount) <= 0 ||
      !tokenAddress
    ) {
      setBuyAmount("");
      return;
    }

    const fetchQuote = async () => {
      setQuoting(true);
      try {
        const eip1193Provider = await wallets[0].getEthereumProvider();
        const provider = new Web3Provider(eip1193Provider);

        const sellAddr = sellSide === "ETH" ? WETH_TOKEN.address : tokenAddress;
        const buyAddr = buySide === "ETH" ? WETH_TOKEN.address : tokenAddress;

        const quote = await getQuote({
          provider,
          sellTokenAddress: sellAddr,
          buyTokenAddress: buyAddr,
          amountIn: sellAmount,
          sellTokenDecimals: 18, // Assuming 18 for now
          buyTokenDecimals: 18,
        });

        setBuyAmount(quote || "");
      } catch (e) {
        console.error(e);
      } finally {
        setQuoting(false);
      }
    };

    // Debounce 500ms
    const timer = setTimeout(fetchQuote, 500);
    return () => clearTimeout(timer);
  }, [sellAmount, sellSide, tokenAddress, wallets]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4">
      <div
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-[2.5rem] lg:rounded-[3rem] bg-bg p-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-1">
          <h2 className="text-lg font-semibold">Swap {tokenSymbol}</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Sell Section */}
        <div className="mt-4 rounded-2xl bg-gray-100 p-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500">Sell</p>
            <div className="flex items-center gap-1 rounded-full bg-white px-3 py-1 text-sm shadow-sm">
              {/* Display Symbol based on side */}
              <span className="font-semibold">
                {sellSide === "ETH" ? "ETH" : tokenSymbol}
              </span>
            </div>
          </div>

          <input
            type="number"
            value={sellAmount}
            onChange={(e) => setSellAmount(e.target.value)}
            placeholder="0.0"
            className="mt-2 w-full bg-transparent text-3xl font-medium outline-none placeholder:text-gray-300"
          />
        </div>

        {/* Switch Button */}
        <div className="flex justify-center -my-3 z-10 relative">
          <button
            onClick={switchTokens}
            className="rounded-full bg-white p-2 shadow-md border border-gray-100 hover:shadow-lg transition-shadow text-primary"
          >
            <FiArrowDown size={20} />
          </button>
        </div>

        {/* Buy Section */}
        <div className="rounded-2xl bg-gray-100 p-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500">Buy</p>
            <div className="flex items-center gap-1 rounded-full bg-white px-3 py-1 text-sm shadow-sm">
              <span className="font-semibold">
                {buySide === "ETH" ? "ETH" : tokenSymbol}
              </span>
            </div>
          </div>

          <input
            value={quoting ? "..." : buyAmount}
            readOnly
            placeholder="0.0"
            className="mt-2 w-full bg-transparent text-3xl font-medium outline-none placeholder:text-gray-300 text-gray-500"
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-3 rounded-xl bg-red-50 p-3 text-sm text-red-500 text-center">
            {error}
          </div>
        )}

        {/* Action Button */}
        {!authenticated ? (
          <button
            onClick={login}
            className="mt-5 w-full rounded-2xl bg-primary py-4 text-white font-bold text-lg hover:opacity-90 transition-opacity shadow-lg shadow-primary/20"
          >
            Connect Wallet
          </button>
        ) : (
          <button
            onClick={handleSwap}
            disabled={!sellAmount || loading || !tokenAddress}
            className="mt-5 w-full rounded-full bg-primary py-4 text-white font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-all shadow-lg shadow-primary/20"
          >
            {loading ? "Swapping..." : "Swap Now"}
          </button>
        )}
      </div>
    </div>
  );
}
