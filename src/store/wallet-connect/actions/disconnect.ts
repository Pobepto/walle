import { getSdkError } from '@walletconnect/utils'
import { WalletConnectAction } from '@src/store'

export const disconnect: WalletConnectAction<'disconnect'> =
  (set, get) => async () => {
    const { signClient } = get()

    if (!signClient) {
      throw new Error('Sign client is null')
    }

    const session = signClient.session.values[0]

    if (session) {
      await signClient.disconnect({
        reason: getSdkError('USER_DISCONNECTED'),
        topic: signClient.session.values[0].topic,
      })
    }

    set({
      proposal: null,
      signClient: null,
      connected: false,
    })
  }
