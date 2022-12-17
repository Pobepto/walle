import SignClient from '@walletconnect/sign-client'
import { Action } from '..'
import { createWithSubscribeSelector } from '../createWithSubscribeSelector'
import {
  approve,
  connect,
  disconnect,
  SessionProposal,
  SessionRequest,
} from './actions'

export type WalletConnectStore = {
  requests: SessionRequest[]

  connect: (uri: string) => Promise<void>
  disconnect: () => Promise<void>
  approve: () => Promise<void>
} & (
  | {
      connected: true
      signClient: SignClient
      proposal: SessionProposal
    }
  | {
      connected: false
      signClient: null
      proposal: null
    }
)

export type WalletConnectAction<T extends keyof WalletConnectStore> = Action<
  WalletConnectStore,
  WalletConnectStore[T]
>

export const useWalletConnectStore =
  createWithSubscribeSelector<WalletConnectStore>((set, get) => ({
    connected: false,
    signClient: null,
    proposal: null,
    requests: [],
    connect: connect(set, get),
    disconnect: disconnect(set, get),
    approve: approve(set, get),
  }))
