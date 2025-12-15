import { Tokenomics } from "@/types/tokenomics";

interface TokenomicsRowProps {
  label: string;
  value: React.ReactNode;
}

function TokenomicsRow({ label, value }: TokenomicsRowProps) {
  return (
    <div className="flex items-center justify-between py-2">
      {/* Label */}
      <span className="text-sm text-text-muted">{label}</span>

      {/* Value */}
      <div className="text-sm font-semibold text-text">{value}</div>
    </div>
  );
}

interface TokenomicsListProps {
  tokenomics: Tokenomics;
}

export default function TokenomicsList({ tokenomics }: TokenomicsListProps) {
  return (
    <div className="space-y-1">
      <TokenomicsRow label="Dev Buy" value={tokenomics.devBuy} />
      <TokenomicsRow label="Vaulted" value={tokenomics.vaulted} />
      <TokenomicsRow label="Unlock Date" value={tokenomics.unlockDate} />
      <TokenomicsRow label="Fully vested" value={tokenomics.fullyVested} />
      <TokenomicsRow
        label="Holders"
        value={tokenomics.holders.toLocaleString()}
      />
      <TokenomicsRow label="Top 10 Holders" value={tokenomics.top10Holders} />

      {/* Warnings row with status */}
      <TokenomicsRow
        label="Warnings"
        value={
          <span className="flex items-center gap-2 text-emerald-400">
            <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500/20">
              ✓
            </span>
            {tokenomics.warnings.label}
          </span>
        }
      />

      <TokenomicsRow
        label="Starting Market Cap"
        value={tokenomics.startingMarketCap}
      />
    </div>
  );
}
