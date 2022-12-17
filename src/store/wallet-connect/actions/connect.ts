import SignClient from '@walletconnect/sign-client'
import { ProposalTypes, SignClientTypes } from '@walletconnect/types'
import { parseUri } from '@walletconnect/utils'
import { WalletConnectAction } from '@src/store'
import { EIP155_SIGNING_METHODS, SIGN_CLIENT_OPTIONS } from '../constants'

export type SessionProposal = Omit<
  SignClientTypes.BaseEventArgs<ProposalTypes.Struct>,
  'topic'
>

export type SessionRequest = SignClientTypes.EventArguments['session_request']

const createSignClient = () => {
  return SignClient.init(SIGN_CLIENT_OPTIONS)
}

export const connect: WalletConnectAction<'connect'> =
  (set, get) => async (uri) => {
    const { disconnect, requests } = get()

    const signClient = await createSignClient()
    set({ signClient })

    const { version } = parseUri(uri)

    if (version === 1) {
      throw new Error('Not supported')
    }

    await signClient.pair({ uri })

    signClient.on('session_delete', disconnect)
    signClient.on('session_request', (requestEvent) => {
      const {
        params: { request },
      } = requestEvent

      switch (request.method) {
        case EIP155_SIGNING_METHODS.ETH_SIGN:
        case EIP155_SIGNING_METHODS.PERSONAL_SIGN:
          throw new Error(`${request.method} not supported`)

        case EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA:
        case EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA_V3:
        case EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA_V4:
          throw new Error(`${request.method} not supported`)

        case EIP155_SIGNING_METHODS.ETH_SEND_TRANSACTION:
        case EIP155_SIGNING_METHODS.ETH_SIGN_TRANSACTION:
          return set({ requests: [...requests, requestEvent] })
        default:
          return set({ requests: [...requests, requestEvent] })
        // throw new Error(`${request.method} not supported`)
      }
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
