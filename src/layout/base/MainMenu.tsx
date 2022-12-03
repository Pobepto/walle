import { Box, Text } from 'ink'
import React from 'react'
import { Menu } from '@components'
import { ROUTE, useNavigate } from '@routes'
import { COLUMNS, useWalletStore } from '@store'
import { useSelectionZone } from '@src/components/SelectionZone'

// TO
export const MainMenu: React.FC = () => {
  const navigate = useNavigate()
  const parentZone = useSelectionZone()!
  const logout = useWalletStore((state) => state.logout)

  const handleLogout = () => {
    logout()
    navigate(ROUTE.REGISTRATION)
  }

  const menuItems = [
    {
      title: 'Home',
      onSelect: () => navigate(ROUTE.WALLET),
    },
    {
      title: 'Wallet',
      items: [
        {
          title: 'Switch chain',
          onSelect: () => {
            navigate(ROUTE.SWITCH_CHAIN)
            parentZone.select(COLUMNS.MAIN)
          },
        },
        {
          title: 'Switch account',
          onSelect: () => {
            navigate(ROUTE.SWITCH_ACCOUNT)
            parentZone.select(COLUMNS.MAIN)
          },
        },
        {
          title: 'Add token',
          onSelect: () => {
            navigate(ROUTE.TOKEN_ADD)
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
      title: 'Logout',
      onSelect: () => handleLogout(),
    },
    {
      title: 'Lock',
      onSelect: () => navigate(ROUTE.LOGIN),
    },
    {
      title: 'FAQ',
      onSelect: () => console.log('WIP'),
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
      />
    </>
  )
}
