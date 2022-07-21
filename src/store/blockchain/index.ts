import { PopulatedTransaction } from '@ethersproject/contracts'
import { JsonRpcProvider } from '@ethersproject/providers'
import { Action } from '..'
import { createWithSubscribeSelector } from '../createWithSubscribeSelector'
import { useTokensStore } from '../tokens'
import { addChain, getNativeBalance } from './actions'
import { sendTransaction } from './actions/sendTransaction'
import { Chain, CHAINS } from './constants'

export interface BlockchainStore {
  chainId: number
  setChainId: (chainId: number) => void
  chains: Chain[]
  addChain: (chain: Chain) => void
  provider: JsonRpcProvider
  setProvider: (provider: JsonRpcProvider) => void

  nativeBalance: string
  nativeBalanceIsLoading: boolean
  getNativeBalance: () => Promise<void>

  // TODO: Add Currency
  sendTransaction: (populatedTx: PopulatedTransaction) => Promise<void>
  txInProgress: boolean
}

export type BlockchainAction<T extends keyof BlockchainStore = any> = Action<
  BlockchainStore,
  BlockchainStore[T]
>

export const useBlockchainStore = createWithSubscribeSelector<BlockchainStore>(
  (set, get) => ({
    chainId: 97,
    // Помимо айди нужно еще и провайдер менять \ пересоздавать
    setChainId: (chainId: number) => set({ chainId }),
    chains: CHAINS,
    addChain: addChain(set, get),
    provider: new JsonRpcProvider(
      'https://data-seed-prebsc-2-s1.binance.org:8545/',
    ),
    setProvider: (provider: JsonRpcProvider) => set({ provider }),

    getNativeBalance: getNativeBalance(set, get),
    nativeBalance: '0',
    nativeBalanceIsLoading: true,

    sendTransaction: sendTransaction(set, get),
    txInProgress: false,
  }),
)

useBlockchainStore.subscribe(
  (state) => state.chainId,
  () => {
    useBlockchainStore.getState().getNativeBalance()
    useTokensStore.getState().syncBalances()
  },
)
