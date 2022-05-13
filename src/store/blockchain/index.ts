import { JsonRpcProvider } from '@ethersproject/providers'
import create from 'zustand'
import { Action } from '..'
import { getNativeBalance } from './getNativeBalance'

export interface Chain {
  chainId: number
  name: string
  rpc: string
  currency: {
    name: string
    symbol: string
    decimals: number
  }
  explorer: string
}

export interface BlockchainStore {
  chainId: number
  chains: Chain[]
  provider: JsonRpcProvider

  nativeBalance: string
  nativeBalanceIsLoading: boolean
  getNativeBalance: () => Promise<void>
}

export type BlockchainAction = Action<BlockchainStore>

const RPC_URL = 'https://data-seed-prebsc-2-s1.binance.org:8545/'

export const useBlockchainStore = create<BlockchainStore>((set, get) => ({
  chainId: 97,
  provider: new JsonRpcProvider(RPC_URL),
  chains: [
    {
      chainId: 97,
      name: 'BNB Smart Chain',
      rpc: RPC_URL,
      currency: { name: 'BNB', symbol: 'BNB', decimals: 18 },
      explorer: 'http://testnet.bscscan.com/',
    },
  ],

  getNativeBalance: getNativeBalance(set, get) as any,
  nativeBalance: '0',
  nativeBalanceIsLoading: true,
}))
