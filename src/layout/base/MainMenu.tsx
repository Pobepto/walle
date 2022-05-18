import { Box, Text } from 'ink'
import React from 'react'
import { Menu } from '../../components'
import { ROUTE, useNavigate } from '../../routes'
import { COLUMNS, useAppStore } from '../../store'

export const MainMenu: React.FC = () => {
  const navigate = useNavigate()
  const activeColumn = useAppStore((state) => state.activeColumn)

  return (
    <>
      <Box alignSelf="center" marginTop={-1}>
        <Text bold> Menu </Text>
      </Box>
      <Menu
        focused={activeColumn === COLUMNS.MENU}
        items={[
          {
            id: 0,
            title: 'Wallet',
            onSelect: () => navigate(ROUTE.WALLET),
            items: [
              {
                id: 1,

                title: 'Switch chain',
                onSelect: () => null,
              },
              {
                id: 2,
                title: 'Switch account',
                onSelect: () => null,
              },
              {
                id: 3,
                title: 'Add token',
                onSelect: () => null,
              },
              {
                id: 4,
                title: 'Logout',
                onSelect: () => null,
              },
            ],
          },
          {
            id: 5,
            title: 'DApps',
            onSelect: () => console.log('DApps'),
          },
          {
            id: 6,
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
