import React from 'react'
import { Box, Text } from 'ink'

import { version } from '../../../package.json'
import { GITHUB, WALLE_LOGO } from '@src/constants'

export const Home: React.FC = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      height="95%"
    >
      <Box flexDirection="column">
        <Box justifyContent="center">
          <Text>{WALLE_LOGO}</Text>
        </Box>
        <Text>Github: {GITHUB}</Text>
      </Box>
      <Box alignSelf="flex-end">
        <Text>Ver. {version}</Text>
      </Box>
    </Box>
  )
}
