import { getSdkError } from '@walletconnect/utils'
import { WalletConnectAction } from '@src/store'

export const disconnect: WalletConnectAction<'disconnect'> =
  (set, get) => async () => {
    const { connected, signClient } = get()

    set({
      connected: false,
      proposal: null,
      signClient: null,
      requests: [],
    })

    if (connected) {
      const session = signClient.session.values[0]

      if (session) {
        await signClient.disconnect({
          reason: getSdkError('USER_DISCONNECTED'),
          topic: signClient.session.values[0].topic,
        })
      }
    }
  }
