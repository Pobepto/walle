import { Wallet } from '@ethersproject/wallet'
import { getDerivationPath } from '@src/utils'
import { Nullable } from 'tsdef'
import { Action } from '..'
import { useBlockchainStore } from '../blockchain'
import { createWithSubscribeSelector } from '../createWithSubscribeSelector'
import {
  decryptWallet,
  deriveMnemonicAddress,
  encryptWallet,
  generateWallet,
  importWallet,
  logout,
} from './actions'

export interface WalletStore {
  password: string // 🤔💩
  pathId: number
  phrase: Nullable<string>
  generateWallet: () => void
  importWallet: (mnemonic: string) => void
  deriveMnemonicAddress: () => void
  encryptWallet: (password: string) => Promise<string>
  decryptWallet: (password: string, encryptedWallet: string) => Promise<void>
  logout: () => void
  selectAccount: (accountIndex: number) => void
}

export type WalletAction<T extends keyof WalletStore> = Action<
  WalletStore,
  WalletStore[T]
>

export const useWalletStore = createWithSubscribeSelector<WalletStore>(
  (set, get) => ({
    password: '',
    pathId: 0,
    phrase: null,
    generateWallet: generateWallet(set, get),
    importWallet: importWallet(set, get),
    deriveMnemonicAddress: deriveMnemonicAddress(set, get),
    encryptWallet: encryptWallet(set, get),
    decryptWallet: decryptWallet(set, get),
    logout: logout(set, get),
    selectAccount: (accountIndex: number) => {
      set({ pathId: accountIndex })
    },
  }),
)

export const getWallet = (defaultPathId?: number) => {
  const { phrase, pathId } = useWalletStore.getState()

  if (!phrase) {
    throw new Error('Phrase is null')
  }

  return Wallet.fromMnemonic(
    phrase!,
    getDerivationPath(defaultPathId ?? pathId),
  )
}

export const getSigner = () => {
  const { provider } = useBlockchainStore.getState()

  return getWallet().connect(provider)
}
