import { PopulatedTransaction } from '@ethersproject/contracts'
import { JsonRpcProvider, TransactionReceipt } from '@ethersproject/providers'
import { Wallet } from '@ethersproject/wallet'
import { Chain, DEFAULT_CHAIN, DEFAULT_CHAINS } from '@src/constants'
import { Nullable } from 'tsdef'
import { Action, useWalletStore } from '..'
import { createWithSubscribeSelector } from '../createWithSubscribeSelector'
import { addChain, getNativeBalance } from './actions'
import { sendTransaction } from './actions/sendTransaction'

export interface BlockchainStore {
  chainId: number
  setChainId: (chainId: number) => void
  chains: Chain[]
  addChain: (chain: Chain) => Promise<void>
  provider: JsonRpcProvider
  getSigner: () => Wallet
  updateProvider: () => void

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
    chainId: DEFAULT_CHAIN.chainId,
    setChainId: (chainId: number) => {
      set({ chainId })
    },
    chains: DEFAULT_CHAINS,
    addChain: addChain(set, get),
    provider: new JsonRpcProvider(DEFAULT_CHAIN.rpc, 'any'),
    getSigner() {
      const { provider } = get()
      const { getWallet } = useWalletStore.getState()

      return getWallet().connect(provider)
    },
    updateProvider: () => {
      const { chainId, chains } = get()
      const chain = chains.find((chain) => chain.chainId === chainId)
      if (chain) {
        const provider = new JsonRpcProvider(chain.rpc, 'any')
        set({ provider })
      }
    },

    getNativeBalance: getNativeBalance(set, get),
    nativeBalance: '0',
    nativeBalanceIsLoading: true,

    sendTransaction: sendTransaction(set, get),
    txInProgress: false,
  }),
)
