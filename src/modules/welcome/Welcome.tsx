import { Box, Text } from 'ink'

import React from 'react'
import { Link } from '../../components/Link'
import { Redirect, ROUTE } from '../../routes'

export const Welcome: React.FC = () => {
  return <Redirect to={ROUTE.REGISTRATION_CREATE} />

  return (
    <Box flexDirection="column">
      <Text>Walle - Best CLI Application ever</Text>
      <Link to={ROUTE.REGISTRATION} isFocused>
        Press &quot;Enter&quot; to continue...
      </Link>
    </Box>
  )
}
