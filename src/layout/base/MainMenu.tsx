import { Box, Text } from 'ink'
import React from 'react'
import { Menu } from '@components'
import { ROUTE, useNavigate } from '@routes'
import { COLUMNS, useWalletStore } from '@store'
import { useSelectionZone } from '@src/components/SelectionZone'

export const MainMenu: React.FC = () => {
  const navigate = useNavigate()
  const parentZone = useSelectionZone()!
  const logout = useWalletStore((state) => state.logout)

  const handleLogout = () => {
    logout()
    navigate(ROUTE.REGISTRATION)
  }

  return (
    <>
      <Box alignSelf="center" marginTop={-1}>
        <Text bold> Menu </Text>
      </Box>
      <Menu
        focused={parentZone.selection === COLUMNS.MENU}
        items={[
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
              // {
              //   title: 'Switch account',
              //   onSelect: () => console.log('Switch account'),
              // },
              {
                title: 'Add token',
                onSelect: () => {
                  navigate(ROUTE.TOKEN_ADD)
                  parentZone.select(COLUMNS.MAIN)
                },
              },
              {
                title: 'Logout',
                onSelect: () => handleLogout(),
              },
            ],
          },
          // {
          //   title: 'Settings',
          //   onSelect: () => console.log('Settings'),
          // },
        ]}
        prevKey="upArrow"
        nextKey="downArrow"
      />
    </>
  )
}
