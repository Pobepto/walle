import { signClient } from '@src/wallet-connect'
import { PairingTypes } from '@walletconnect/types'

import { createWithSubscribeSelector } from '../createWithSubscribeSelector'
import { Action } from '..'

import {
  approve,
  approveRequest,
  connect,
  disconnect,
  reject,
  rejectRequest,
  SessionProposal,
  SessionRequest,
} from './actions'

export type WalletConnectStore = {
  connected: () => boolean
  requests: SessionRequest[]
  pairings: () => PairingTypes.Struct[]
  store: Record<string, any>

  connect: (uri: string) => Promise<void>
  disconnect: (topic: string) => Promise<void>
  approve: (proposal: SessionProposal) => Promise<void>
  reject: (proposal: SessionProposal) => Promise<void>
  approveRequest: (request: SessionRequest, result: any) => Promise<void>
  rejectRequest: (request: SessionRequest) => Promise<void>
}

export type WalletConnectAction<T extends keyof WalletConnectStore> = Action<
  WalletConnectStore,
  WalletConnectStore[T]
>

export const useWalletConnectStore =
  createWithSubscribeSelector<WalletConnectStore>((set, get) => ({
    connected: () => signClient.session.values[0]?.acknowledged,
    requests: [],
    pairings: () => signClient.pairing.values,
    store: {},
    connect: connect(set, get),
    disconnect: disconnect(set, get),
    approve: approve(set, get),
    reject: reject(set, get),
    approveRequest: approveRequest(set, get),
    rejectRequest: rejectRequest(set, get),
  }))
