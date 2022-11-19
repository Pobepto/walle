import React from 'react'
import { Box, Text } from 'ink'

export const Footer: React.FC = () => {
  return (
    <Box flexDirection="column" borderStyle="single" paddingX={1}>
      <Box flexDirection="row" justifyContent="space-between">
        <Text>
          <Text bold>&quot;Tab&quot;</Text> to switch
        </Text>
        <Text>
          <Text bold>🔽</Text> / <Text bold>🔼</Text> to move
        </Text>
      </Box>
    </Box>
  )
}
