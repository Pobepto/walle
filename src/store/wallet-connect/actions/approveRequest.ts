import { formatJsonRpcResult } from '@json-rpc-tools/utils'
import { WalletConnectAction } from '@src/store'
import { signClient } from '@src/wallet-connect'

export const approveRequest: WalletConnectAction<'approveRequest'> =
  (set, get) => async (request, result) => {
    const { requests } = get()

    await signClient.respond({
      topic: request.topic,
      response: formatJsonRpcResult(request.id, result),
    })

    const pendingRequests = requests.filter((req) => req.id !== request.id)

    set({ requests: pendingRequests })
  }
