import create from 'zustand'
import { Action } from '..'
import { generateWallet } from './generateWallet'
import { importWallet } from './importWallet'

export interface AccountStore {
  phrase: string,
  generateWallet: () => void;
  importWallet: (mnemonic: string) => void;
}

export type AccountAction = Action<AccountStore>

export const useAccountStore = create<AccountStore>((set, get) => ({
  phrase: '',
  generateWallet: generateWallet(set, get),
  importWallet: importWallet(set, get)
}))
