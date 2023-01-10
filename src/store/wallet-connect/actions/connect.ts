import SignClient from '@walletconnect/sign-client'
import { ProposalTypes, SignClientTypes } from '@walletconnect/types'
import { parseUri } from '@walletconnect/utils'
import type { IKeyValueStorage } from '@walletconnect/keyvaluestorage'
import { WalletConnectAction } from '@src/store'
import { SIGN_CLIENT_OPTIONS } from '../constants'

export type SessionProposal = Omit<
  SignClientTypes.BaseEventArgs<ProposalTypes.Struct>,
  'topic'
>

export type SessionRequest = SignClientTypes.EventArguments['session_request']

export const connect: WalletConnectAction<'connect'> =
  (set, get) => async (uri) => {
    const { disconnect } = get()

    const { version } = parseUri(uri)

    if (version !== 2) {
      throw new Error(`WalletConnect v${version} not supported`)
    }

    const storage: IKeyValueStorage = {
      setItem: (key, value) => {
        const { store } = get()
        set({
          store: {
            ...store,
            [key]: value,
          },
        })
        return Promise.resolve()
      },
      getItem: (key) => {
        const { store } = get()
        return Promise.resolve(store[key])
      },
      removeItem: (key) => {
        const store = { ...get().store }
        delete store[key]
        set({ store })
        return Promise.resolve()
      },
      getKeys: () => {
        const { store } = get()
        return Promise.resolve(Object.keys(store))
      },
      getEntries: () => {
        const { store } = get()
        return Promise.resolve(Object.entries(store))
      },
    }

    const signClient = await SignClient.init({
      ...SIGN_CLIENT_OPTIONS,
      storage,
    })
    set({ signClient })

    await signClient.pair({ uri })

    signClient.on('session_delete', disconnect)
    signClient.on('session_request', (requestEvent) => {
      const { requests } = get()
      set({ requests: [requestEvent, ...requests] })
    })

    // signClient.on('session_ping', (data) => console.log('ping', data))
    // signClient.on('session_event', (data) => console.log('event', data))
    // signClient.on('session_update', (data) => console.log('update', data))

    await new Promise<void>((resolve) => {
      signClient.on('session_proposal', (proposal) => {
        set({ proposal })
        resolve()
      })
    })
  }
