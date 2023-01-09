import { formatJsonRpcError } from '@json-rpc-tools/utils'
import { getSdkError } from '@walletconnect/utils'
import { WalletConnectAction } from '@src/store'

export const rejectRequest: WalletConnectAction<'rejectRequest'> =
  (set, get) => async (request) => {
    const { connected, signClient, requests } = get()

    if (connected) {
      signClient.respond({
        topic: request.topic,
        response: formatJsonRpcError(
          request.id,
          getSdkError('USER_REJECTED_METHODS').message,
        ),
      })

      const pendingRequests = requests.filter((req) => req.id !== request.id)

      set({ requests: pendingRequests })
    }
  }
