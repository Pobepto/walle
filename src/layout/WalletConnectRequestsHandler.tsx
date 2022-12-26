import React, { useEffect } from 'react'
import { ROUTE, useNavigate } from '@src/routes'
import { COLUMNS, useWalletConnectStore } from '@src/store'
import { usePrevious } from '@src/hooks/usePrevious'
import { useClipboard, useWalletConnectRequestHandler } from '@src/hooks'
import { useSelectionZone } from '@src/components/SelectionZone'

export const WalletConnectRequestsHandler: React.FC = () => {
  const navigate = useNavigate()
  const parentZone = useSelectionZone()!
  const handleRequest = useWalletConnectRequestHandler()
  const pendingRequests = useWalletConnectStore((store) => store.requests)
  const connected = useWalletConnectStore((store) => store.connected)
  const requestsCount = pendingRequests.length
  const previousRequestsCount = usePrevious(requestsCount) ?? 0

  useEffect(() => {
    if (requestsCount > previousRequestsCount) {
      const lastRequestEvent = pendingRequests[0]

      if (lastRequestEvent) {
        handleRequest(lastRequestEvent)
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
