import { Box, Text } from 'ink'

import React, { useEffect, useState } from 'react'
import { Link } from '@components/Link'
import { ROUTE } from '@routes'
import { isFileExist, USER_DATA } from '@utils'

const WALLE_LOGO = `
 _ _ _ _____ __    __    _____ 
| | | |  _  |  |  |  |  |   __|
| | | |     |  |__|  |__|   __|
|_____|__|__|_____|_____|_____|
`

// TODO: Understand how to pass env vars
const WALLE_VERSION = '1.0.0'

export const Welcome: React.FC = () => {
  const [link, setLink] = useState(ROUTE.REGISTRATION)

  useEffect(() => {
    isFileExist(USER_DATA).then((isExist) => {
      isExist && setLink(ROUTE.LOGIN)
    })
  }, [])

  return (
    <Box flexDirection="column" justifyContent="center" alignItems="center">
      <Box flexDirection="column" marginBottom={1}>
        <Text>{WALLE_LOGO}</Text>
        <Text>Walle - Non-Custodial CLI Wallet</Text>
      </Box>
      <Link to={link} isFocused>
        Press &quot;Enter&quot; to continue...
      </Link>
      <Box marginTop={2}>
        <Text>Ver. {WALLE_VERSION}</Text>
      </Box>
    </Box>
  )
}
