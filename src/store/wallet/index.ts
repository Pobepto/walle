import { Nullable } from 'tsdef'
import { subscribeWithSelector } from 'zustand/middleware'
import create, { Mutate, GetState, SetState, StoreApi } from 'zustand'
import { Action } from '..'
import { deriveMnemonicAddress } from './deriveMnemonicAddress'
import { generateWallet } from './generateWallet'
import { importWallet } from './importWallet'
import { useBlockchainStore } from '../blockchain'

export interface WalletStore {
  pathId: number
  phrase: Nullable<string>
  generateWallet: () => void
  importWallet: (mnemonic: string) => void
  deriveMnemonicAddress: () => void
}

export type WalletAction = Action<WalletStore>

export const useWalletStore = create<
  WalletStore,
  SetState<WalletStore>,
  GetState<WalletStore>,
  Mutate<StoreApi<WalletStore>, [['zustand/subscribeWithSelector', never]]>
>(
  subscribeWithSelector((set, get) => ({
    pathId: 0,
    phrase: null,
    generateWallet: generateWallet(set, get),
    importWallet: importWallet(set, get),
    deriveMnemonicAddress: deriveMnemonicAddress(set, get),
  })),
)

useWalletStore.subscribe(
  (state) => state.phrase,
  () => {
    useBlockchainStore.getState().getNativeBalance()
  },
)
