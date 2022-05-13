import { Box, Text } from 'ink'
import React from 'react'
import { Menu } from '../../components'
import { ROUTE, useNavigate } from '../../routes'
import { COLUMNS, useAppStore } from '../../store'

export const MainMenu: React.FC = () => {
  const navigate = useNavigate()
  const activeColumn = useAppStore(state => state.activeColumn)

  return (
    <>
      <Box alignSelf='center'>
        <Text bold>Menu</Text>
      </Box>
      <Menu
        focused={activeColumn === COLUMNS.MENU}
        items={[
          {
            title: 'Wallet',
            onSelect: () => navigate(ROUTE.WALLET)
          },
          {
            title: 'DApps',
            onSelect: () => console.log('DApps')
          },
          {
            title: 'Settings',
            onSelect: () => console.log('Settings')
          }
        ]}
        prevKey='upArrow'
        nextKey='downArrow'
      />
    </>
  )
}
