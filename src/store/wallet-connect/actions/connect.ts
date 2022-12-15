import SignClient from '@walletconnect/sign-client'
import { ProposalTypes, SignClientTypes } from '@walletconnect/types'
import { parseUri } from '@walletconnect/utils'
import { WalletConnectAction } from '@src/store'
import { SIGN_CLIENT_OPTIONS } from '../constants'

export type SessionProposal = Omit<
  SignClientTypes.BaseEventArgs<ProposalTypes.Struct>,
  'topic'
>

const createSignClient = () => {
  return SignClient.init(SIGN_CLIENT_OPTIONS)
}

export const connect: WalletConnectAction<'connect'> =
  (set, get) => async (uri) => {
    const signClient = await createSignClient()
    const { disconnect } = get()
    set({ signClient })

    const { version } = parseUri(uri)

    if (version === 1) {
      throw new Error('Not supported')
    }

    await signClient.pair({ uri })

    signClient.on('session_delete', disconnect)
    signClient.on(
      'session_request',
      async (
        requestEvent: SignClientTypes.EventArguments['session_request'],
      ) => {
        const {
          topic,
          params: { request },
        } = requestEvent
        const requestSession = signClient.session.get(topic)

        // switch (request.method) {
        //   case EIP155_SIGNING_METHODS.ETH_SIGN:
        //   case EIP155_SIGNING_METHODS.PERSONAL_SIGN:
        //     return ModalStore.open('SessionSignModal', {
        //       requestEvent,
        //       requestSession,
        //     })

        //   case EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA:
        //   case EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA_V3:
        //   case EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA_V4:
        //     return ModalStore.open('SessionSignTypedDataModal', {
        //       requestEvent,
        //       requestSession,
        //     })

        //   case EIP155_SIGNING_METHODS.ETH_SEND_TRANSACTION:
        //   case EIP155_SIGNING_METHODS.ETH_SIGN_TRANSACTION:
        //     return ModalStore.open('SessionSendTransactionModal', {
        //       requestEvent,
        //       requestSession,
        //     })
        //   default:
        //     return ModalStore.open('SessionUnsuportedMethodModal', {
        //       requestEvent,
        //       requestSession,
        //     })
        // }
      },
    )

    await new Promise<void>((resolve) => {
      signClient.on('session_proposal', (proposal) => {
        set({ proposal })
        resolve()
      })
    })
  }
