import React from 'react'
import { Box } from 'ink'
import { Menu } from '../../components'
import { COLUMNS, useAppStore, useWalletStore } from '../../store'
import { ROUTE, useNavigate } from '../../routes'

export const Wallet: React.FC = () => {
  const navigate = useNavigate()
  const activeColumn = useAppStore((state) => state.activeColumn)
  const logout = useWalletStore((state) => state.logout)

  const handleSwitchChain = () => {
    navigate(ROUTE.SWITCH_CHAIN)
  }

  const handleSwitchAccount = () => {
    // navigate(ROUTE.ACCOUNTS)
  }

  const handleLogout = () => {
    logout()
    navigate(ROUTE.REGISTRATION)
  }

  const handleAddToken = () => {
    navigate(ROUTE.TOKEN_ADD)
  }

  return (
    <Box display="flex" flexDirection="column">
      <Menu
        focused={activeColumn === COLUMNS.MAIN}
        items={[
          {
            title: 'Switch chain',
            onSelect: handleSwitchChain,
          },
          {
            title: 'Switch account',
            onSelect: handleSwitchAccount,
          },
          {
            title: 'Add token',
            onSelect: handleAddToken,
          },
          {
            title: 'Logout',
            onSelect: handleLogout,
          },
        ]}
        prevKey="upArrow"
        nextKey="downArrow"
      />
    </Box>
  )
}
