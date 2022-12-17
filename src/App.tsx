import { Box } from 'ink'
import React, { useEffect } from 'react'
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
  const requestsCount = pendingRequests.length
  const previousRequestsCount = usePrevious(requestsCount) ?? 0

  useEffect(() => {
    if (requestsCount > previousRequestsCount) {
      const lastRequestEvent = pendingRequests.at(-1)

      if (lastRequestEvent) {
        const {
          params: { request },
        } = lastRequestEvent

        switch (request.method) {
          case EIP155_SIGNING_METHODS.ETH_SIGN:
          case EIP155_SIGNING_METHODS.PERSONAL_SIGN:
            break
          // throw new Error(`${request.method} not supported`)

          case EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA:
          case EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA_V3:
          case EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA_V4:
            break
          // throw new Error(`${request.method} not supported`)

          case EIP155_SIGNING_METHODS.ETH_SEND_TRANSACTION:
          case EIP155_SIGNING_METHODS.ETH_SIGN_TRANSACTION:
            navigate(ROUTE.CONFIRM_TRANSACTION, {
              populatedTx: request.params,
            })
            break

          default:
            throw new Error(`${request.method} not supported`)
        }
      }
    }
  }, [requestsCount])

  return (
    <Box width="95%" alignSelf="center" justifyContent="center">
      {route}
    </Box>
  )
}
