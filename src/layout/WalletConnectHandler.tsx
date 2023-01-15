import React, { useEffect } from 'react'
import { ROUTE, useNavigate } from '@src/routes'
import { COLUMNS, useWalletConnectStore } from '@src/store'
import { useClipboard, useWalletConnectRequestHandler } from '@src/hooks'
import { useSelectionZone } from '@src/components/SelectionZone'
import { signClient } from '@src/wallet-connect'

export const WalletConnectHandler: React.FC = () => {
  const navigate = useNavigate()
  const parentZone = useSelectionZone()!
  const connected = useWalletConnectStore((store) => store.connected())

  const handleRequest = useWalletConnectRequestHandler()

  useEffect(() => {
    signClient
      .on('session_delete', () => {
        navigate(ROUTE.WALLET)
      })
      .on('session_request', (requestEvent) => {
        const { requests } = useWalletConnectStore.getState()
        useWalletConnectStore.setState({
          requests: [...requests, requestEvent],
        })
        handleRequest(requestEvent)
      })
      .on('session_proposal', (proposal) => {
        navigate(ROUTE.WALLET_CONNECT_PROPOSAL, { proposal })
      })

    // TODO
    // signClient.on('session_ping', (data) => console.log('ping', data))
    // signClient.on('session_event', (data) => console.log('event', data))
    // signClient.on('session_update', (data) => console.log('update', data))
  }, [])

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
