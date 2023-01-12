import { formatJsonRpcError } from '@json-rpc-tools/utils'
import { getSdkError } from '@walletconnect/utils'
import { WalletConnectAction } from '@src/store'
import { signClient } from '@src/wallet-connect'

export const rejectRequest: WalletConnectAction<'rejectRequest'> =
  (set, get) => async (request) => {
    const { requests } = get()

    await signClient.respond({
      topic: request.topic,
      response: formatJsonRpcError(
        request.id,
        getSdkError('USER_REJECTED_METHODS').message,
      ),
    })

    const pendingRequests = requests.filter((req) => req.id !== request.id)

    set({ requests: pendingRequests })
  }
