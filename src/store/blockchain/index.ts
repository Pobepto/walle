import { PopulatedTransaction } from '@ethersproject/contracts'
import { JsonRpcProvider } from '@ethersproject/providers'
import { Action } from '..'
import { createWithSubscribeSelector } from '../createWithSubscribeSelector'
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

  sendTransaction: (
    populatedTx: PopulatedTransaction,
  ) => Promise<string | undefined>
  txInProgress: boolean
}

export type BlockchainAction<T extends keyof BlockchainStore> = Action<
  BlockchainStore,
  BlockchainStore[T]
>

export const useBlockchainStore = createWithSubscribeSelector<BlockchainStore>(
  (set, get) => ({
    chainId: 97,
    setChainId: (chainId: number) => {
      const chain = get().chains.find((chain) => chain.chainId === chainId)

      if (chain) {
        const provider = new JsonRpcProvider(chain.rpc, 'any')

        set({ chainId, provider })
      }
    },
    chains: CHAINS,
    addChain: addChain(set, get),
    provider: new JsonRpcProvider(
      'https://data-seed-prebsc-1-s3.binance.org:8545',
      'any',
    ),
    setProvider: (provider: JsonRpcProvider) => set({ provider }),

    getNativeBalance: getNativeBalance(set, get),
    nativeBalance: '0',
    nativeBalanceIsLoading: true,

    sendTransaction: sendTransaction(set, get),
    txInProgress: false,
  }),
)
