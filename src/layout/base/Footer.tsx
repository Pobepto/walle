import React from 'react'
import { Box, Text } from 'ink'

import { useKey } from '@src/hooks'
import { ROUTE, useNavigate } from '@src/routes'

export const Footer: React.FC = () => {
  const navigate = useNavigate()

  const handleHelpOpen = () => {
    navigate(ROUTE.HELP)
  }

  useKey('ctrl+h', handleHelpOpen)

  return (
    <Box flexDirection="column" borderStyle="single" paddingX={1}>
      <Box flexDirection="row" justifyContent="space-between">
        <Text>
          <Text bold>&quot;CTRL+H&quot;</Text> to open Help
        </Text>
      </Box>
    </Box>
  )
}
