import { Box, Text } from 'ink'

import React, { useEffect, useState } from 'react'
import { Link } from '@components/Link'
import { ROUTE } from '@routes'
import { isUserDataExist } from '@utils'

export const Welcome: React.FC = () => {
  const [link, setLink] = useState(ROUTE.REGISTRATION)

  useEffect(() => {
    isUserDataExist().then((isExist) => {
      isExist && setLink(ROUTE.LOGIN)
    })
  }, [])

  return (
    <Box flexDirection="column">
      <Text>Walle - Best CLI Application ever</Text>
      <Link to={link} isFocused>
        Press &quot;Enter&quot; to continue...
      </Link>
    </Box>
  )
}
