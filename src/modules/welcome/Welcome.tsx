import { Box, Text } from 'ink'

import React from 'react'
import { Button } from '../../components'
// import { useWallet } from '../../hooks/useWallet'
import { ROUTE, useNavigate } from '../../routes'

export const Welcome: React.FC = () => {
  const navigate = useNavigate()
  // const wallet = useWallet()
  // if (wallet) {
  //   return <Redirect to={ROUTE.ACCOUNT} />
  // }

  return (
    <Box flexDirection="column">
      <Text>Walle - Best CLI Application ever</Text>
      <Button keyType="return" isFocused onPress={() => navigate(ROUTE.REGISTRATION)}>
        Press &quot;Enter&quot; to continue...
      </Button>
    </Box>
  )
}
