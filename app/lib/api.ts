import { CardData } from "@/types/card";
import { Details } from "@/types/details";
import { Tokenomics } from "@/types/tokenomics";
import { Holder } from "@/types/holders";
import { Activity } from "@/types/activity";
import { Leaderboard } from "@/types/leaderboard";

// --- Types ---

export type TokenSortOption = 
  | "market-cap" 
  | "tx-h24" 
  | "price-percent-h24" 
  | "price-percent-h1" 
  | "deployed-at";

export type SortOption = "desc" | "asc";

export interface RawClankerToken {
  contract_address: string;
  name: string;
  symbol: string;
  img_url: string;
  description: string;
  deployed_at: string;
  msg_sender: string;
  factory_address: string;
  tx_hash: string;
  warnings: string[];
  related?: {
    market?: {
      market_cap?: number; marketCap?: number;
      volume_24h?: number; volume_h24?: number; volume24h?: number;
      price_percent_h1?: number; price_percent_h6?: number;
      price_percent_h24?: number; priceChangeH24?: number;
      holder_count?: number; holderCount?: number;
    };
    user?: { username: string | null; pfp_url: string | null; fid?: number; };
  };
}

export interface CompositeTokenData {
  cardData: CardData;
  tokenomics: Tokenomics;
  details: Details;
  holders: Holder[];
  activities: Activity[];
}

// --- Utils ---

const formatMoney = (n: number | undefined): string => {
  if (n === undefined || n === null || isNaN(n)) return "$0";
  if (n >= 1e6) return `$${(n / 1e6).toFixed(1)}m`;
  if (n >= 1e3) return `$${(n / 1e3).toFixed(1)}k`;
  return `$${n.toFixed(2)}`;
};

// --- Mappers ---

export function mapToLeaderboard(t: RawClankerToken): Leaderboard {
  const market = t.related?.market;
  const user = t.related?.user;
  
  return {
    id: t.contract_address,
    name: t.name || "Unknown",
    symbol: t.symbol || "???",
    image: t.img_url || undefined, 
    creator: {
      handle: user?.username || "anon",
      avatar: user?.pfp_url || undefined, 
      address: t.msg_sender
    },
    priceChange: {
      h1: market?.price_percent_h1 ?? 0,
      h6: market?.price_percent_h6 ?? 0,
      h24: market?.priceChangeH24 ?? market?.price_percent_h24 ?? 0,
    },
    volume: market?.volume24h ?? market?.volume_h24 ?? market?.volume_24h ?? 0,
    marketCap: market?.marketCap ?? market?.market_cap ?? 0
  };
}

export function mapToComposite(t: RawClankerToken, index: number = 0): CompositeTokenData {
  const m = t.related?.market;
  const u = t.related?.user;
  const mcap = m?.marketCap ?? m?.market_cap ?? 0;
  const vol = m?.volume24h ?? m?.volume_h24 ?? m?.volume_24h ?? 0;
  const change = m?.priceChangeH24 ?? m?.price_percent_h24 ?? 0;

  return {
    cardData: {
      id: t.contract_address,
      position: index + 1,
      appName: t.name || "Unknown Token",
      tokenSymbol: t.symbol || "TOKEN", // Ensuring symbol is passed
      authorHandle: u?.username || t.symbol || "unknown",
      authorAvatar: u?.pfp_url || undefined,
      tokenImage: t.img_url || undefined,
      description: t.description || "No description provided.",
      stats: [
        { id: "mktcap", label: "MCAP", value: formatMoney(mcap) },
        { id: "24h", label: "24h Vol", value: formatMoney(vol) },
        { id: "24h△", label: "24h△", value: `${change > 0 ? "+" : ""}${change.toFixed(2)}%` },
      ],
    },
    tokenomics: {
      devBuy: "0%", 
      vaulted: "100%", 
      unlockDate: "Forever", 
      fullyVested: "Yes",
      holders: m?.holderCount ?? m?.holder_count ?? 0,
      top10Holders: "Unknown",
      warnings: {
        status: t.warnings?.length > 0 ? "warning" : "ok",
        label: t.warnings?.length > 0 ? `${t.warnings.length} Warnings` : "No Issues",
      },
      startingMarketCap: formatMoney(mcap),
    },
    details: {
      interface: "Clanker.world", 
      platform: "Farcaster",
      contractAddress: t.contract_address, 
      creator: t.msg_sender,
      adminAddress: t.factory_address,
      created: t.deployed_at ? new Date(t.deployed_at).toLocaleDateString() : "Unknown",
      castHash: t.tx_hash,
    },
    holders: [], 
    activities: [],
  };
}

// --- Fetchers ---

export async function getRawTokens(sortBy: TokenSortOption, sort: SortOption = "desc"): Promise<RawClankerToken[]> {
  try {
    const res = await fetch(
      `https://www.clanker.world/api/tokens?sortBy=${sortBy}&sort=${sort}&limit=20&includeUser=true&includeMarket=true`,
      { next: { revalidate: 60 } } 
    );
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch (error) {
    console.error("Clanker Fetch Error:", error);
    return [];
  }
}

export async function getTokenByAddress(address: string): Promise<CompositeTokenData | null> {
  if (!address) return null;
  try {
    const res = await fetch(
      `https://www.clanker.world/api/tokens?q=${address.toLowerCase()}&includeUser=true&includeMarket=true`,
      { next: { revalidate: 60 } }
    );
    
    if (!res.ok) return null;
    
    const json: { data: RawClankerToken[] } = await res.json();
    
    // Find the exact match
    const token = json.data.find(
      (t) => t.contract_address.toLowerCase() === address.toLowerCase()
    );
    
    return token ? mapToComposite(token) : null;
  } catch (error) {
    console.error("Clanker Token Fetch Error:", error);
    return null;
  }
}