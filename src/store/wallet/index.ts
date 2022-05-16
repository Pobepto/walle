import { Nullable } from 'tsdef'
import { Action } from '..'
import { deriveMnemonicAddress } from './deriveMnemonicAddress'
import { generateWallet } from './generateWallet'
import { importWallet } from './importWallet'
import { useBlockchainStore } from '../blockchain'
import { createWithSubscribeSelector } from '../createWithSubscribeSelector'
import { logout } from './logout'

export interface WalletStore {
  pathId: number
  phrase: Nullable<string>
  generateWallet: () => void
  importWallet: (mnemonic: string) => void
  deriveMnemonicAddress: () => void
  logout: () => void
}

export type WalletAction = Action<WalletStore>

export const useWalletStore = createWithSubscribeSelector<WalletStore>(
  (set, get) => ({
    pathId: 0,
    phrase: null,
    generateWallet: generateWallet(set, get),
    importWallet: importWallet(set, get),
    deriveMnemonicAddress: deriveMnemonicAddress(set, get),
    logout: logout(set, get),
  }),
)

useWalletStore.subscribe(
  (state) => state.phrase,
  () => {
    useBlockchainStore.getState().getNativeBalance()
  },
)
