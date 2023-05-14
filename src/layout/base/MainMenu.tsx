import React from 'react'
import { Box, Text } from 'ink'

import { Menu, MenuItem } from '@components'
import { ROUTE, useNavigate } from '@routes'
import { useSelectionZone } from '@src/components/SelectionZone'
import { COLUMNS } from '@src/constants'
import { signClient } from '@src/wallet-connect'
import { useWalletConnectStore, useWalletStore } from '@store'

export const MainMenu: React.FC = () => {
  const navigate = useNavigate()
  const parentZone = useSelectionZone()!

  const logout = useWalletStore((state) => state.logout)
  const activeWallet = useWalletStore((state) => state.activeWallet)
  const disconnect = useWalletConnectStore((store) => store.disconnect)
  const pendingRequests = useWalletConnectStore((store) => store.requests)
  const connected = useWalletConnectStore((store) => store.connected())

  const menuItems: MenuItem[] = [
    {
      title: 'Home',
      onSelect: () => {
        navigate(ROUTE.HOME)
        parentZone.select(COLUMNS.MAIN)
      },
    },
    {
      title: 'Wallet',
      items: [
        {
          title: 'Chains',
          onSelect: () => {
            navigate(ROUTE.SWITCH_CHAIN)
            parentZone.select(COLUMNS.MAIN)
          },
        },
        {
          title: 'Accounts',
          onSelect: () => {
            navigate(ROUTE.ACCOUNTS)
            parentZone.select(COLUMNS.MAIN)
          },
        },
        {
          title: 'Tokens',
          onSelect: () => {
            navigate(ROUTE.TOKENS)
            parentZone.select(COLUMNS.MAIN)
          },
        },
        {
          title: 'Logout',
          onSelect: () => {
            navigate(ROUTE.WALLETS)
            logout()
          },
        },
      ],
    },
    {
      title: 'WalletConnect',
      items: connected
        ? [
            {
              title: 'Active session',
              onSelect: () => {
                navigate(ROUTE.WALLET_CONNECT, {})
                parentZone.select(COLUMNS.MAIN)
              },
            },
            {
              title: 'Pairings',
              onSelect: () => {
                navigate(ROUTE.WALLET_CONNECT_PAIRINGS)
                parentZone.select(COLUMNS.MAIN)
              },
            },
            {
              title: pendingRequests.length
                ? `Pending requests (${pendingRequests.length})`
                : 'Pending requests',
              onSelect: () => {
                navigate(ROUTE.WALLET_CONNECT_REQUESTS)
                parentZone.select(COLUMNS.MAIN)
              },
            },
            {
              title: 'Disconnect',
              onSelect: () => {
                const session = signClient.session.values[0]
                disconnect(session.topic)
                parentZone.select(COLUMNS.MAIN)
              },
            },
          ]
        : [
            {
              title: 'Connect',
              onSelect: () => {
                navigate(ROUTE.WALLET_CONNECT, {})
                parentZone.select(COLUMNS.MAIN)
              },
            },
            {
              title: 'Pairings',
              onSelect: () => {
                navigate(ROUTE.WALLET_CONNECT_PAIRINGS)
                parentZone.select(COLUMNS.MAIN)
              },
            },
          ],
    },
    {
      title: 'Security',
      onSelect: () => {
        navigate(ROUTE.SECURITY)
        parentZone.select(COLUMNS.MAIN)
      },
    },
    {
      title: 'Help',
      onSelect: () => {
        navigate(ROUTE.HELP)
        parentZone.select(COLUMNS.MAIN)
      },
    },
    {
      title: 'Lock',
      onSelect: () => {
        navigate(ROUTE.LOGIN, { wallet: activeWallet! })
        logout()
      },
    },
  ]

  return (
    <>
      <Box alignSelf="center" marginTop={-1}>
        <Text bold> Menu </Text>
      </Box>
      <Menu
        isActive={parentZone.selection === COLUMNS.MENU}
        items={menuItems}
        prevKey="upArrow"
        nextKey="downArrow"
        selectKey={['return', 'rightArrow']}
        expandMenuKey={['return', 'rightArrow']}
      />
    </>
  )
}
