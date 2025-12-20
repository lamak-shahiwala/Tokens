import { Token, ChainId } from '@uniswap/sdk-core'

// Base Chain ID is 8453
export const CHAIN_ID = 8453;

// Addresses on Base
// Universal Router 1.2 address (standard on L2s)
export const UNIVERSAL_ROUTER_ADDRESS = "0x66a9893cc07d91d95644aedd05d03f95e1dba8af"; 
export const PERMIT2_ADDRESS = "0x000000000022D473030F116dDEE9F6B43aC78BA3"; 

// Base WETH
export const WETH_TOKEN = new Token(
  CHAIN_ID,
  '0x4200000000000000000000000000000000000006',
  18,
  'WETH',
  'Wrapped Ether'
);

// Base USDC (Native)
export const USDC_TOKEN = new Token(
  CHAIN_ID,
  '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
  6,
  'USDC',
  'USD Coin'
);
