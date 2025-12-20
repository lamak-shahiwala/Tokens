export type Stat = {
  id: string;
  label: string;
  value: string;
  subLabel?: string; 
};

export type CardData = {
  id: string;
  position: number;
  appName: string;
  tokenSymbol: string; 
  authorHandle: string;
  authorAvatar?: string;
  tokenImage?: string;
  description: string;
  stats: Stat[];
  totalEthRaised?: string;
};