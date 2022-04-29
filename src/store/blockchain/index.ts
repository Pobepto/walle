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
        'wss://ws-nd-455-735-490.p2pify.com/7ca76a7ca035622220f13686ed0181fa',
      // httpsRpc:
      //   'https://nd-455-735-490.p2pify.com/7ca76a7ca035622220f13686ed0181fa',
      currency: { name: 'BNB', symbol: 'BNB', decimals: 18 },
      explorer: 'http://testnet.bscscan.com/'
    }
  ]
}))
