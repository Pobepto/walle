import { Box, Text } from 'ink'

import React from 'react'
import { Link } from '../../components/Link'
// import { useWallet } from '../../hooks'
import { ROUTE } from '../../routes'

export const Welcome: React.FC = () => {
  // const wallet = useWallet()
  // if (wallet) {
  //   return <Redirect to={ROUTE.WALLET} />
  // }

  return (
    <Box flexDirection="column">
      <Text>Walle - Best CLI Application ever</Text>
      <Link to={ROUTE.REGISTRATION} isFocused>
        Press &quot;Enter&quot; to continue...
      </Link>
    </Box>
  )
}
