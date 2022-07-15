import { Box, Text } from 'ink'
import React from 'react'
import { Menu } from '@components'
import { ROUTE, useNavigate } from '@routes'
import { COLUMNS, useAppStore, useWalletStore } from '@store'

export const MainMenu: React.FC = () => {
  const navigate = useNavigate()
  const activeColumn = useAppStore((state) => state.activeColumn)
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
        focused={activeColumn === COLUMNS.MENU}
        items={[
          {
            title: 'Wallet',
            items: [
              {
                title: 'Switch chain',
                onSelect: () => navigate(ROUTE.SWITCH_CHAIN),
              },
              {
                title: 'Switch account',
                onSelect: () => console.log('Switch account'),
              },
              {
                title: 'Add token',
                onSelect: () => navigate(ROUTE.TOKEN_ADD),
              },
              {
                title: 'Logout',
                onSelect: () => handleLogout(),
              },
            ],
          },
          {
            title: 'Settings',
            onSelect: () => console.log('Settings'),
          },
        ]}
        prevKey="upArrow"
        nextKey="downArrow"
      />
    </>
  )
}
