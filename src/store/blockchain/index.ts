import { JsonRpcProvider } from '@ethersproject/providers'
import { Action } from '..'
import { createWithSubscribeSelector } from '../createWithSubscribeSelector'
import { Currency, Token, useTokensStore } from '../tokens'
import { getNativeBalance } from './actions'
import { transfer } from './actions/transfer'

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
  setChainId: (chainId: number) => void
  chains: Chain[]
  provider: JsonRpcProvider

  nativeBalance: string
  nativeBalanceIsLoading: boolean
  getNativeBalance: () => Promise<void>

  // TODO: Add Currency
  transfer: (recipient: string, token: Token, amount: string) => Promise<void>
  transferInProgress: boolean
}

export type BlockchainAction<T extends keyof BlockchainStore = any> = Action<
  BlockchainStore,
  BlockchainStore[T]
>

const RPC_URL = 'https://data-seed-prebsc-2-s1.binance.org:8545/'

export const useBlockchainStore = createWithSubscribeSelector<BlockchainStore>(
  (set, get) => ({
    chainId: 97,
    setChainId: (chainId: number) => set({ chainId }),
    provider: new JsonRpcProvider(RPC_URL),
    chains: [
      {
        chainId: 97,
        name: 'BNB Smart Chain',
        rpc: RPC_URL,
        currency: { name: 'BNB', symbol: 'BNB', decimals: 18 },
        explorer: 'http://testnet.bscscan.com/',
      },
      {
        chainId: 4,
        name: 'Ethereum Rinkeby',
        rpc: 'https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
        currency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
        explorer: 'https://rinkeby.etherscan.io/',
      },
    ],

    getNativeBalance: getNativeBalance(set, get),
    nativeBalance: '0',
    nativeBalanceIsLoading: true,

    transfer: transfer(set, get),
    transferInProgress: false,
  }),
)

useBlockchainStore.subscribe(
  (state) => state.chainId,
  () => {
    useBlockchainStore.getState().getNativeBalance()
    useTokensStore.getState().syncBalances()
  },
)
