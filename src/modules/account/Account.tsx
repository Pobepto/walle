import React from 'react'
import { Box, Text } from 'ink'
import { ROUTE, useNavigate } from '../../routes'
import { Menu } from '../../components/Menu'

export const Account: React.FC = () => {
  const navigate = useNavigate()

  return (
    <Box>
      <Text>Account</Text>
      <Menu
        items={[
          {
            title: 'Create account',
            onSelect: () => navigate(ROUTE.ACCOUNT)
          },
          {
            title: 'Import account',
            onSelect: () => null
          }
        ]}
      />
    </Box>
  )
}
