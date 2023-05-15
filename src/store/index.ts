import { join } from 'path'

import type { GetState, SetState } from 'zustand'

import { AppStore } from './app'
import type { BlockchainStore } from './blockchain'
import type { TokensStore } from './tokens'
import type { WalletStore } from './wallet'
import type { WalletConnectStore } from './wallet-connect'

export type Action<TState extends object, TValue = (...args: any[]) => any> = (
  set: SetState<TState>,
  get: GetState<TState>,
) => TValue

export interface SerializedWalletState {
  blockchainStore: Pick<BlockchainStore, 'chainId' | 'chains'>
  walletConnectStore: Pick<WalletConnectStore, 'store' | 'requests'>
  walletStore: Pick<WalletStore, 'accountIndex' | 'addressIndex' | 'accounts'>
  tokensStore: Pick<TokensStore, 'tokens'>
}

export type SerializedAppState = Pick<AppStore, 'wallets'>

export const APP_SETTINGS = join(__dirname, 'walle.settings.json')

export const getWalletDataPath = (wallet: string) => {
  return join(__dirname, `walle.${wallet}.data`)
}

export const getWalletSettingsPath = (wallet: string) => {
  return join(__dirname, `walle.${wallet}.settings.json`)
}

export * from './app'
export * from './blockchain'
export * from './deserialize'
export * from './runStoreAutosave'
export * from './serialize'
export * from './tokens'
export * from './wallet'
export * from './wallet-connect'
