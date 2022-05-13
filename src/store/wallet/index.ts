import { Nullable } from 'tsdef'
import create from 'zustand'
import { Action } from '..'
import { deriveMnemonicAddress } from './deriveMnemonicAddress'
import { generateWallet } from './generateWallet'
import { importWallet } from './importWallet'

export interface WalletStore {
  pathId: number
  phrase: Nullable<string>
  generateWallet: () => void
  importWallet: (mnemonic: string) => void
  deriveMnemonicAddress: () => void
}

export type WalletAction = Action<WalletStore>

export const useWalletStore = create<WalletStore>((set, get) => ({
  pathId: 0,
  phrase: null,
  generateWallet: generateWallet(set, get),
  importWallet: importWallet(set, get),
  deriveMnemonicAddress: deriveMnemonicAddress(set, get),
}))
