import React from 'react'
import { Box } from 'ink'
import { Menu } from '../../components'
import { COLUMNS, useAppStore } from '../../store'

export const Wallet: React.FC = () => {
  const activeColumn = useAppStore((state) => state.activeColumn)

  return (
    <Box display="flex" flexDirection="column">
      <Menu
        focused={activeColumn === COLUMNS.MAIN}
        items={[
          {
            title: 'Switch account',
            onSelect: () => null,
          },
          {
            title: 'Logout',
            onSelect: () => null,
          },
        ]}
        prevKey="upArrow"
        nextKey="downArrow"
      />
    </Box>
  )
}
