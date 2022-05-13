import create from 'zustand'
import { Action } from '..'

export interface Chain {
  chainId: number;
  name: string;
  rpc: string;
  currency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  explorer: string;
}

export interface BlockchainStore {
  chainId: number;
  chains: Chain[];
}

export type AppAction = Action<BlockchainStore>

export const useBlockchainStore = create<BlockchainStore>(() => ({
  chainId: 97,
  chains: [
    {
      chainId: 97,
      name: 'BNB Smart Chain',
      rpc:
        'https://data-seed-prebsc-2-s1.binance.org:8545/',
      currency: { name: 'BNB', symbol: 'BNB', decimals: 18 },
      explorer: 'http://testnet.bscscan.com/'
    }
  ]
}))
