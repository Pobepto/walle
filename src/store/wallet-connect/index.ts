import SignClient from '@walletconnect/sign-client'
import { Nullable } from 'tsdef'
import { Action } from '..'
import { createWithSubscribeSelector } from '../createWithSubscribeSelector'
import { approve, connect, disconnect, SessionProposal } from './actions'

export interface WalletConnectStore {
  signClient: Nullable<SignClient>
  proposal: Nullable<SessionProposal>
  connected: boolean

  connect: (uri: string) => Promise<void>
  disconnect: () => Promise<void>
  approve: () => Promise<void>
}

export type WalletConnectAction<T extends keyof WalletConnectStore> = Action<
  WalletConnectStore,
  WalletConnectStore[T]
>

export const useWalletConnectStore =
  createWithSubscribeSelector<WalletConnectStore>((set, get) => ({
    signClient: null,
    proposal: null,
    connected: false,
    connect: connect(set, get),
    disconnect: disconnect(set, get),

    approve: approve(set, get),
  }))
