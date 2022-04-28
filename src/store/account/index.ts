import create from 'zustand'
import { Action } from '..'
import { generateWallet } from './generateWallet'

export interface AccountStore {
  phrase: string,
  generateWallet: () => void;
}

export type AccountAction = Action<AccountStore>

export const useAccountStore = create<AccountStore>((set, get) => ({
  phrase: '',
  generateWallet: generateWallet(set, get)
}))
