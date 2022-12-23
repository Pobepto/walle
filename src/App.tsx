import { formatJsonRpcError, formatJsonRpcResult } from '@json-rpc-tools/utils'
import { getSdkError } from '@walletconnect/utils'
import { Box } from 'ink'
import React, { useEffect } from 'react'
import { useClipboard } from './hooks'
import { useAutoSave } from './hooks/useAutoSave'
import { usePrevious } from './hooks/usePrevious'
import { ROUTE, useNavigate, useRoute } from './routes'
import { useWalletConnectStore } from './store'
import { subscribe } from './store/subscribers'
import { EIP155_SIGNING_METHODS } from './store/wallet-connect/constants'

// 🤔
subscribe()

export const App: React.FC = () => {
  // Temporary disable auto save
  // useAutoSave()
  const route = useRoute()
  const navigate = useNavigate()
  const pendingRequests = useWalletConnectStore((store) => store.requests)
  const signClient = useWalletConnectStore((store) => store.signClient)
  const connected = useWalletConnectStore((store) => store.connected)
  const requestsCount = pendingRequests.length
  const previousRequestsCount = usePrevious(requestsCount) ?? 0

  useEffect(() => {
    if (requestsCount > previousRequestsCount) {
      const lastRequestEvent = pendingRequests[0]

      if (lastRequestEvent) {
        const {
          id,
          topic,
          params: { request },
        } = lastRequestEvent

        const rejectRequest = () =>
          signClient!.respond({
            topic,
            response: formatJsonRpcError(
              id,
              getSdkError('USER_REJECTED_METHODS').message,
            ),
          })

        console.log(lastRequestEvent.params)

        switch (request.method) {
          case EIP155_SIGNING_METHODS.ETH_SIGN:
            navigate(ROUTE.SIGN_MESSAGE, {
              message: request.params[1],
              warning: true,
              onReject: rejectRequest,
              onSign: async (signedMessage) => {
                await signClient!.respond({
                  topic,
                  response: formatJsonRpcResult(id, signedMessage),
                })
              },
            })
            break
          case EIP155_SIGNING_METHODS.PERSONAL_SIGN:
            navigate(ROUTE.SIGN_MESSAGE, {
              message: request.params[0],
              onReject: rejectRequest,
              onSign: async (signedMessage) => {
                await signClient!.respond({
                  topic,
                  response: formatJsonRpcResult(id, signedMessage),
                })
              },
            })
            break

          case EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA:
          case EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA_V3:
          case EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA_V4:
            break
          // throw new Error(`${request.method} not supported`)

          case EIP155_SIGNING_METHODS.ETH_SEND_TRANSACTION:
          case EIP155_SIGNING_METHODS.ETH_SIGN_TRANSACTION:
            navigate(ROUTE.CONFIRM_TRANSACTION, {
              populatedTx: request.params[0],
              onRejectTx: rejectRequest,
              onApproveTx: async (hash) => {
                await signClient!.respond({
                  topic,
                  response: formatJsonRpcResult(id, hash),
                })
              },
            })
            break

          default:
            throw new Error(`${request.method} not supported`)
        }
      }
    }
  }, [requestsCount])

  useClipboard((clipboard) => {
    if (!connected && clipboard.startsWith('wc:')) {
      navigate(ROUTE.WALLET_CONNECT, {
        uri: clipboard,
      })
    }
  })

  return (
    <Box width="95%" alignSelf="center" justifyContent="center">
      {route}
    </Box>
  )
}
