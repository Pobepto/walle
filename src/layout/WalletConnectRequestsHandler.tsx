import React, { useEffect } from 'react'
import { getSdkError } from '@walletconnect/utils'
import { formatJsonRpcError, formatJsonRpcResult } from '@json-rpc-tools/utils'
import { ROUTE, useNavigate } from '@src/routes'
import { COLUMNS, useWalletConnectStore } from '@src/store'
import { usePrevious } from '@src/hooks/usePrevious'
import { EIP155_SIGNING_METHODS } from '@src/store/wallet-connect/constants'
import { useClipboard } from '@src/hooks'
import { SessionRequest } from '@src/store/wallet-connect/actions'
import { useSelectionZone } from '@src/components/SelectionZone'

export const WalletConnectRequestsHandler: React.FC = () => {
  const navigate = useNavigate()
  const parentZone = useSelectionZone()!
  const pendingRequests = useWalletConnectStore((store) => store.requests)
  const signClient = useWalletConnectStore((store) => store.signClient)
  const connected = useWalletConnectStore((store) => store.connected)
  const requestsCount = pendingRequests.length
  const previousRequestsCount = usePrevious(requestsCount) ?? 0

  const rejectRequest = (request: SessionRequest) => {
    return signClient!.respond({
      topic: request.topic,
      response: formatJsonRpcError(
        request.id,
        getSdkError('USER_REJECTED_METHODS').message,
      ),
    })
  }

  const approveRequest = (request: SessionRequest, result: any) => {
    return signClient!.respond({
      topic: request.topic,
      response: formatJsonRpcResult(request.id, result),
    })
  }

  useEffect(() => {
    if (requestsCount > previousRequestsCount) {
      const lastRequestEvent = pendingRequests[0]

      if (lastRequestEvent) {
        const {
          params: { request },
        } = lastRequestEvent

        console.log(lastRequestEvent.params)

        switch (request.method) {
          case EIP155_SIGNING_METHODS.ETH_SIGN:
            parentZone.select(COLUMNS.MAIN)
            return navigate(ROUTE.SIGN_MESSAGE, {
              message: request.params[1],
              warning: true,
              onReject: () => rejectRequest(lastRequestEvent),
              onSign: (signedMessage) =>
                approveRequest(lastRequestEvent, signedMessage),
            })
          case EIP155_SIGNING_METHODS.PERSONAL_SIGN:
            parentZone.select(COLUMNS.MAIN)
            return navigate(ROUTE.SIGN_MESSAGE, {
              message: request.params[0],
              onReject: () => rejectRequest(lastRequestEvent),
              onSign: (signedMessage) =>
                approveRequest(lastRequestEvent, signedMessage),
            })

          case EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA:
          case EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA_V3:
          case EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA_V4:
            break

          case EIP155_SIGNING_METHODS.ETH_SEND_TRANSACTION:
          case EIP155_SIGNING_METHODS.ETH_SIGN_TRANSACTION:
            parentZone.select(COLUMNS.MAIN)
            return navigate(ROUTE.CONFIRM_TRANSACTION, {
              populatedTx: request.params[0],
              onRejectTx: () => rejectRequest(lastRequestEvent),
              onApproveTx: (hash) => approveRequest(lastRequestEvent, hash),
            })

          default:
            throw new Error(`${request.method} not supported`)
        }
      }
    }
  }, [requestsCount])

  useClipboard((clipboard) => {
    if (!connected && clipboard.startsWith('wc:')) {
      parentZone.select(COLUMNS.MAIN)
      navigate(ROUTE.WALLET_CONNECT, {
        uri: clipboard,
      })
    }
  })

  return null
}
