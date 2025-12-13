import { ethers } from "ethers";

const QUOTER_V2 =
  "0x61fFE014bA17989E743c5F6cB21bF9697530B21e";

const WETH = ethers.utils.getAddress(
  "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"
);

const USDC = ethers.utils.getAddress(
  "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
);

const FEE = 500;

const QUOTER_ABI = [
  "function quoteExactInput(bytes path, uint256 amountIn) external returns (uint256)",
];

export async function getQuote(
  provider: ethers.providers.Provider,
  sellToken: "ETH" | "USDC",
  buyToken: "ETH" | "USDC",
  amountIn: string
): Promise<string | null> {
  try {
    if (!amountIn || Number(amountIn) <= 0) return null;

    const quoter = new ethers.Contract(QUOTER_V2, QUOTER_ABI, provider);

    let path: string;
    let parsedAmount: ethers.BigNumber;

    if (sellToken === "ETH" && buyToken === "USDC") {
      parsedAmount = ethers.utils.parseEther(amountIn);
      path = ethers.utils.solidityPack(
        ["address", "uint24", "address"],
        [WETH, FEE, USDC]
      );

      const out = await quoter.callStatic.quoteExactInput(
        path,
        parsedAmount
      );

      return ethers.utils.formatUnits(out, 6);
    }

    if (sellToken === "USDC" && buyToken === "ETH") {
      parsedAmount = ethers.utils.parseUnits(amountIn, 6);
      path = ethers.utils.solidityPack(
        ["address", "uint24", "address"],
        [USDC, FEE, WETH]
      );

      const out = await quoter.callStatic.quoteExactInput(
        path,
        parsedAmount
      );

      return ethers.utils.formatEther(out);
    }

    return null;
  } catch {
    return null;
  }
}