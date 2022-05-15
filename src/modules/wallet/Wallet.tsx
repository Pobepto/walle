import React from 'react'
import { Box } from 'ink'
import { Menu } from '../../components'
import { COLUMNS, useAppStore } from '../../store'
import { ROUTE, useNavigate } from '../../routes'

export const Wallet: React.FC = () => {
  const navigate = useNavigate()
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
          {
            title: 'Add token',
            onSelect: () => navigate(ROUTE.TOKEN_ADD),
          },
        ]}
        prevKey="upArrow"
        nextKey="downArrow"
      />
    </Box>
  )
}
