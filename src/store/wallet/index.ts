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
  accountIndex: number
  addressIndex: number
}

export enum WalletType {
  MNEMONIC = 'MNEMONIC',
  PRIVATE_KEY = 'PRIVATE_KEY',
}

export type WalletStore = {
  activeWallet: Nullable<string>
  accountIndex: number
  addressIndex: number
  type: Nullable<WalletType>
  mnemonicOrPrivateKey: Nullable<string>
  accounts: Account[]
  getWallet: (base?: boolean) => Wallet
  createWallet: (
    name: string,
    mnemonic: string,
    accountIndex?: number,
    addressIndex?: number,
  ) => void
  importWallet: (
    name: string,
    mnemonicOrPrivateKey: string,
    accountIndex?: number,
    addressIndex?: number,
  ) => void
  encryptWallet: (password: string) => Promise<void>
  decryptWallet: (wallet: string, password: string) => Promise<void>
  logout: () => void
  createAccount: (
    name: string,
    accountIndex?: number,
    addressIndex?: number,
  ) => void
  deleteAccount: (accountIndex: number, addressIndex: number) => void
  selectAccount: (accountIndex: number, addressIndex: number) => void
}

export type WalletAction<T extends keyof WalletStore> = Action<
  WalletStore,
  WalletStore[T]
>

export const useWalletStore = createWithSubscribeSelector<WalletStore>(
  (set, get) => ({
    activeWallet: null,
    accountIndex: 0,
    addressIndex: 0,
    type: null,
    mnemonicOrPrivateKey: null,
    accounts: [],
    getWallet: (base = false) => {
      const { mnemonicOrPrivateKey, type, accountIndex, addressIndex } = get()

      if (!mnemonicOrPrivateKey || !type) {
        throw new Error('Wallet not exist')
      }

      if (type === WalletType.PRIVATE_KEY) {
        return new Wallet(mnemonicOrPrivateKey)
      }

      return Wallet.fromMnemonic(
        mnemonicOrPrivateKey,
        base ? undefined : getDerivationPath(accountIndex, addressIndex),
      )
    },
    createWallet: createWallet(set, get),
    importWallet: importWallet(set, get),
    encryptWallet: encryptWallet(set, get),
    decryptWallet: decryptWallet(set, get),
    logout: logout(set, get),
    createAccount: createAccount(set, get),
    deleteAccount: deleteAccount(set, get),
    selectAccount: (accountIndex, addressIndex) => {
      set({ accountIndex, addressIndex })
    },
  }),
)
