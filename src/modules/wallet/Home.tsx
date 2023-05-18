import React from 'react'
import { Box, Text } from 'ink'

import { GITHUB, WALLE_LOGO } from '@src/constants'

import { version } from '../../../package.json'

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
          <Text color="yellowBright">{WALLE_LOGO}</Text>
        </Box>
        <Text>
          <Text bold>Github:</Text> <Text underline>{GITHUB}</Text>
        </Text>
      </Box>
      <Box alignSelf="flex-end">
        <Text>Ver. {version}</Text>
      </Box>
    </Box>
  )
}
