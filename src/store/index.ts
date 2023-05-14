import type { GetState, SetState } from 'zustand'

import type { BlockchainStore } from './blockchain'
import type { TokensStore } from './tokens'
import type { WalletStore } from './wallet'
import type { WalletConnectStore } from './wallet-connect'

export type Action<TState extends object, TValue = (...args: any[]) => any> = (
  set: SetState<TState>,
  get: GetState<TState>,
) => TValue

export interface SerializedWalletSettings {
  blockchainStore: Pick<BlockchainStore, 'chainId' | 'chains'>
  walletConnectStore: Pick<WalletConnectStore, 'store' | 'requests'>
  walletStore: Pick<WalletStore, 'accountIndex' | 'addressIndex' | 'accounts'>
  tokensStore: Pick<TokensStore, 'tokens'>
}

export type SerializedUserSettings = Pick<WalletStore, 'wallets'>

export * from './app'
export * from './blockchain'
export * from './tokens'
export * from './wallet'
export * from './wallet-connect'
