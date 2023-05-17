import {
  JsonRpcProvider,
  PreparedTransactionRequest,
  TransactionReceipt,
  Wallet,
} from 'ethers'
import { Nullable } from 'tsdef'

import { Chain, DEFAULT_CHAIN, DEFAULT_CHAINS, Token } from '@src/constants'

import { createWithSubscribeSelector } from '../createWithSubscribeSelector'
import { Action, useWalletStore } from '..'

import { sendTransaction } from './actions/sendTransaction'
import {
  addChain,
  deleteChain,
  getNativeBalance,
  loadChainId,
  loadToken,
} from './actions'

export interface BlockchainStore {
  chainId: number
  setChainId: (chainId: number) => void
  chains: Chain[]
  addChain: (chain: Chain) => Promise<void>
  deleteChain: (chainId: number) => void
  loadChainId: (rpc: string) => Promise<string>
  provider: JsonRpcProvider
  getSigner: () => Wallet
  updateProvider: () => void

  loadToken: (
    address: string,
  ) => Promise<Pick<Token, 'name' | 'symbol' | 'decimals'>>

  nativeBalance: Nullable<string>
  getNativeBalance: () => Promise<void>

  sendTransaction: (
    populatedTx: PreparedTransactionRequest,
  ) => Promise<TransactionReceipt>
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
    deleteChain: deleteChain(set, get),
    loadChainId: loadChainId(set, get),
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
    loadToken: loadToken(set, get),

    getNativeBalance: getNativeBalance(set, get),
    nativeBalance: null,

    sendTransaction: sendTransaction(set, get),
  }),
)
