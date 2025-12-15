export interface Tokenomics {
  devBuy: string;
  vaulted: string;
  unlockDate: string;
  fullyVested: string;
  holders: number;
  top10Holders: string;
  warnings: {
    status: "ok" | "warning";
    label: string;
  };
  startingMarketCap: string;
}