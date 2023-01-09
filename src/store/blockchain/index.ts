import { PopulatedTransaction } from '@ethersproject/contracts'
import { JsonRpcProvider, TransactionReceipt } from '@ethersproject/providers'
import { Chain, DEFAULT_CHAINS } from '@src/constants'
import { Nullable } from 'tsdef'
import { Action } from '..'
import { createWithSubscribeSelector } from '../createWithSubscribeSelector'
import { addChain, getNativeBalance } from './actions'
import { sendTransaction } from './actions/sendTransaction'

export interface BlockchainStore {
  chainId: number
  setChainId: (chainId: number) => void
  chains: Chain[]
  addChain: (chain: Chain) => Promise<void>
  provider: JsonRpcProvider
  setProvider: (provider: JsonRpcProvider) => void

  nativeBalance: Nullable<string>
  nativeBalanceIsLoading: boolean
  getNativeBalance: () => Promise<void>

  sendTransaction: (
    populatedTx: PopulatedTransaction,
  ) => Promise<TransactionReceipt | undefined>
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
    chains: DEFAULT_CHAINS,
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
