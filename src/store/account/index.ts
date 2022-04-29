import create from 'zustand'
import { Action } from '..'
import { deriveMnemonicAddress } from './deriveMnemonicAddress'
import { generateWallet } from './generateWallet'
import { importWallet } from './importWallet'

export interface AccountStore {
  pathId: number,
  phrase: string,
  generateWallet: () => void;
  importWallet: (mnemonic: string) => void;
  deriveMnemonicAddress: () => void;
}

export type AccountAction = Action<AccountStore>

export const useAccountStore = create<AccountStore>((set, get) => ({
  pathId: 0,
  phrase: '',
  generateWallet: generateWallet(set, get),
  importWallet: importWallet(set, get),
  deriveMnemonicAddress: deriveMnemonicAddress(set, get)
}))
