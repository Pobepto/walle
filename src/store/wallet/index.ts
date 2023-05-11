import { Nullable } from 'tsdef'

import { Wallet } from '@ethersproject/wallet'
import { getDerivationPath } from '@src/utils'

import { createWithSubscribeSelector } from '../createWithSubscribeSelector'
import { Action } from '..'

import {
  createAccount,
  createWallet,
  decryptWallet,
  deleteAccount,
  encryptWallet,
  importWallet,
  logout,
} from './actions'

export interface Account {
  name: string
  pathId: number
}

export enum WalletType {
  MNEMONIC = 'MNEMONIC',
  PRIVATE_KEY = 'PRIVATE_KEY',
}

export type WalletStore = {
  activePathId: number
  type: Nullable<WalletType>
  mnemonicOrPrivateKey: Nullable<string>
  accounts: Account[]
  getWallet: (pathId?: number) => Wallet
  createWallet: (mnemonic: string, pathId?: number) => void
  importWallet: (mnemonicOrPrivateKey: string, pathId?: number) => void
  encryptWallet: (password: string) => Promise<string>
  decryptWallet: (password: string, encryptedWallet: string) => Promise<void>
  logout: () => void
  createAccount: (name: string, accountId?: number) => void
  deleteAccount: (accountId: number) => void
  selectAccount: (accountIndex: number) => void
}

export type WalletAction<T extends keyof WalletStore> = Action<
  WalletStore,
  WalletStore[T]
>

export const useWalletStore = createWithSubscribeSelector<WalletStore>(
  (set, get) => ({
    activePathId: 0,
    type: null,
    mnemonicOrPrivateKey: null,
    accounts: [],
    getWallet: (pathId?: number) => {
      const { mnemonicOrPrivateKey, type, activePathId } = get()

      if (!mnemonicOrPrivateKey || !type) {
        throw new Error('Wallet not exist')
      }

      if (type === WalletType.PRIVATE_KEY) {
        return new Wallet(mnemonicOrPrivateKey)
      }

      return Wallet.fromMnemonic(
        mnemonicOrPrivateKey,
        getDerivationPath(pathId ?? activePathId),
      )
    },
    createWallet: createWallet(set, get),
    importWallet: importWallet(set, get),
    encryptWallet: encryptWallet(set, get),
    decryptWallet: decryptWallet(set, get),
    logout: logout(set, get),
    createAccount: createAccount(set, get),
    deleteAccount: deleteAccount(set, get),
    selectAccount: (accountId: number) => {
      set({ activePathId: accountId })
    },
  }),
)
