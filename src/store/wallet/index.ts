import { Nullable } from 'tsdef'
import { Action } from '..'
import { deriveMnemonicAddress } from './deriveMnemonicAddress'
import { generateWallet } from './generateWallet'
import { importWallet } from './importWallet'
import { useBlockchainStore } from '../blockchain'
import { createWithSubscribeSelector } from '../createWithSubscribeSelector'
import { logout } from './logout'
import { encryptWallet } from './encryptWallet'
import { decryptWallet } from './decryptWallet'
import { useTokensStore } from '../tokens'

export interface WalletStore {
  pathId: number
  phrase: Nullable<string>
  generateWallet: () => void
  importWallet: (mnemonic: string) => void
  deriveMnemonicAddress: () => void
  encryptWallet: (password: string) => Promise<string>
  decryptWallet: (password: string, encryptedWallet: string) => Promise<void>
  logout: () => void
}

export type WalletAction<T extends keyof WalletStore = any> = Action<
  WalletStore,
  WalletStore[T]
>

export const useWalletStore = createWithSubscribeSelector<WalletStore>(
  (set, get) => ({
    pathId: 0,
    phrase: null,
    generateWallet: generateWallet(set, get),
    importWallet: importWallet(set, get),
    deriveMnemonicAddress: deriveMnemonicAddress(set, get),
    encryptWallet: encryptWallet(set, get),
    decryptWallet: decryptWallet(set, get),
    logout: logout(set, get),
  }),
)

useWalletStore.subscribe(
  (state) => [state.pathId, state.phrase],
  ([, phrase]) => {
    if (phrase) {
      useBlockchainStore.getState().getNativeBalance()
      useTokensStore.getState().syncBalances()
    }
  },
)
