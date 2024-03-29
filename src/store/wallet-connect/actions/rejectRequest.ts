import { formatJsonRpcError } from '@json-rpc-tools/utils'
import { WalletConnectAction } from '@src/store'
import { signClient } from '@src/wallet-connect'
import { getSdkError } from '@walletconnect/utils'

export const rejectRequest: WalletConnectAction<'rejectRequest'> =
  (set, get) => async (request) => {
    const { requests } = get()

    try {
      await signClient.respond({
        topic: request.topic,
        response: formatJsonRpcError(
          request.id,
          getSdkError('USER_REJECTED_METHODS').message,
        ),
      })
    } catch (err) {
      //
    }

    const pendingRequests = requests.filter((req) => req.id !== request.id)

    set({ requests: pendingRequests })
  }
