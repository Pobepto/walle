import create from 'zustand'

import { Action } from '..'

export interface AppStore {
  wallets: string[]
  addWallet: (wallet: string) => void
}

export type AppAction = Action<AppStore>

export const useAppStore = create<AppStore>((set, get) => ({
  wallets: [],
  addWallet: (wallet) => {
    const { wallets } = get()

    set({ wallets: [...wallets, wallet] })
  },
}))
