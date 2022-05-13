import React from 'react'
import { Box } from 'ink'
import { Menu } from '../../components'
import { useAppStore } from '../../store'

export const Wallet: React.FC = () => {
  const menuFocused = useAppStore(state => state.menuFocused)

  return (
    <Box display="flex" flexDirection="column">
      <Menu
        focused={!menuFocused}
        items={[
          {
            title: 'Switch account',
            onSelect: () => null
          },
          {
            title: 'Logout',
            onSelect: () => null
          }
        ]}
        prevKey='upArrow'
        nextKey='downArrow'
      />
    </Box>
  )
}
