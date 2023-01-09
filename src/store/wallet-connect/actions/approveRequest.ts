import { formatJsonRpcResult } from '@json-rpc-tools/utils'
import { WalletConnectAction } from '@src/store'

export const approveRequest: WalletConnectAction<'approveRequest'> =
  (set, get) => async (request, result) => {
    const { connected, signClient, requests } = get()

    if (connected) {
      signClient.respond({
        topic: request.topic,
        response: formatJsonRpcResult(request.id, result),
      })

      const pendingRequests = requests.filter((req) => req.id !== request.id)

      set({ requests: pendingRequests })
    }
  }
